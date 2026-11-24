"""Mede o volume da narração por quadro e grava o amp.ts que faz o apresentador de papel balançar.

    python3 amp.py narracao.mp3 <projeto remotion>/src/videos/<slug>/amp.ts [--fps 30]

Só usa ffmpeg (astats). Saída: export const AMP: number[] com um valor de 0 a 1 por quadro.
"""
import argparse
import re
import subprocess

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("saida")
ap.add_argument("--fps", type=int, default=30)
a = ap.parse_args()

taxa = a.fps * 1000
txt = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", a.audio, "-af",
     f"aresample={taxa},asetnsamples=n=1000:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
     "-f", "null", "-"], capture_output=True, text=True).stdout
db = [float(x) if x not in ("-inf", "nan") else -90.0 for x in re.findall(r"RMS_level=(-?inf|nan|-?[\d.]+)", txt)]
bruto = [max(0.0, min(1.0, (x + 45) / 33)) for x in db]  # -45 dB = 0, -12 dB = 1
suave = []
for i in range(len(bruto)):
    j = bruto[max(0, i - 1):i + 2]
    suave.append(round(sum(j) / len(j), 2))
with open(a.saida, "w") as f:
    f.write("// volume da narração por quadro (0 a 1), gerado por amp.py; move o apresentador\n")
    f.write(f"export const AMP: number[] = {suave};\n")
print(f"{len(suave)} quadros -> {a.saida}")
