import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

// uso: cutout <entrada.png> <saida.png>
// recorta a maior pessoa da imagem (instance mask) e salva PNG com alfa
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("nao abriu") }

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
let req = VNGeneratePersonInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { fatalError("sem pessoa") }

// escolhe a instancia com maior area
var best: (idx: Int, area: Int) = (0, -1)
for i in obs.allInstances {
    let buf = try obs.generateMask(forInstances: IndexSet(integer: i))
    CVPixelBufferLockBaseAddress(buf, .readOnly)
    let w = CVPixelBufferGetWidth(buf), h = CVPixelBufferGetHeight(buf)
    let rb = CVPixelBufferGetBytesPerRow(buf)
    let base = CVPixelBufferGetBaseAddress(buf)!.assumingMemoryBound(to: Float32.self)
    var area = 0
    for y in stride(from: 0, to: h, by: 4) {
        let row = base.advanced(by: y * rb / 4)
        for x in stride(from: 0, to: w, by: 4) where row[x] > 0.5 { area += 1 }
    }
    CVPixelBufferUnlockBaseAddress(buf, .readOnly)
    print("instancia \(i): area \(area)")
    if area > best.area { best = (i, area) }
}
print("usando instancia \(best.idx)")

let maskBuf = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: best.idx), from: handler)
let ciImg = CIImage(cgImage: cg)
let ciMask = CIImage(cvPixelBuffer: maskBuf)
let blend = CIFilter.blendWithMask()
blend.inputImage = ciImg
blend.backgroundImage = CIImage.empty()
blend.maskImage = ciMask
let out = blend.outputImage!.cropped(to: ciImg.extent)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: outURL, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok \(outURL.path)")
