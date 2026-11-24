import React from 'react';
import {Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as loadBrinquedo} from '@remotion/google-fonts/Fredoka';
import {clamp, FPS, NAVY} from './conversa';

// Kit do estilo "maquete de bloquinhos". Vertical 1080x1920.
// Cenário isométrico de blocos coloridos desenhado em SVG (sem 3D de verdade): cada bloco são 3 faces.
// Plaquinhas em pé (HTML) levam os textos; ele aparece num totem que balança com a voz.
// Uso: <FiltrosMaquete /> uma vez; blocos dentro de <Cena>; placas e totem fora, posicionados com tela().

export const BRINQUEDO = loadBrinquedo('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const U = 62; // tamanho de 1 unidade da maquete, em px
export const OX = 540;
export const OY = 700;
export const COR = {laranja: '#F08A4B', verde: '#3BB273', amarelo: '#F6C945', azul: '#3E7BE0', marinho: NAVY, branco: '#FFFFFF', rosa: '#F48FB1', creme: '#FFF4DE'} as const;

// ponto da maquete (x para a direita-baixo, y para a esquerda-baixo, z para cima) -> px na cena
export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * 0.866 * U, (x + y) * 0.5 * U - z * U];
export const tela = (x: number, y: number, z = 0, ox = OX, oy = OY): [number, number] => { const [a, b] = iso(x, y, z); return [ox + a, oy + b]; };
const mistura = (hex: string, alvo: number, q: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (alvo - v) * q));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
export const cair = (f: number, t: number, d = 11) => interpolate(f, [t * FPS, t * FPS + d], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.7))});

export const FiltrosMaquete: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs><filter id="corte-maquete" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 1 1" /></feComponentTransfer></filter></defs>
  </svg>
);

export const Cena: React.FC<{ox?: number; oy?: number; children: React.ReactNode}> = ({ox = OX, oy = OY, children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><g transform={`translate(${ox},${oy})`}>{children}</g></svg>
);

// bloco: canto de trás em (x, y, z), tamanho w (em x) × d (em y) × h (altura). t = segundo em que ele cai no lugar.
// Desenhar na ordem de trás para a frente (x + y crescente; em cima do que está embaixo).
export const Bloco: React.FC<{x: number; y: number; z?: number; w: number; d: number; h: number; cor: string; t?: number; sombra?: boolean}> = ({x, y, z = 0, w, d, h, cor, t, sombra = true}) => {
  const f = useCurrentFrame();
  if (t !== undefined && f < t * FPS) return null;
  const p = t === undefined ? 1 : cair(f, t);
  const z0 = z + (1 - p) * 7;
  const z1 = z0 + h;
  const P = (a: number, b: number, c: number) => iso(a, b, c).map((v) => v.toFixed(1)).join(',');
  const topo = [P(x, y, z1), P(x + w, y, z1), P(x + w, y + d, z1), P(x, y + d, z1)].join(' ');
  const esq = [P(x, y + d, z1), P(x + w, y + d, z1), P(x + w, y + d, z0), P(x, y + d, z0)].join(' ');
  const dir = [P(x + w, y, z1), P(x + w, y + d, z1), P(x + w, y + d, z0), P(x + w, y, z0)].join(' ');
  const chao = [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)].join(' ');
  const borda = mistura(cor, 0, 0.28);
  return (
    <g opacity={Math.min(1, p * 2.5)}>
      {sombra && <polygon points={chao} fill="rgba(11,31,58,.16)" transform="translate(10,14)" />}
      <polygon points={esq} fill={mistura(cor, 0, 0.1)} stroke={borda} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={dir} fill={mistura(cor, 0, 0.24)} stroke={borda} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={topo} fill={mistura(cor, 255, 0.16)} stroke={borda} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
};

// plaquinha em pé com texto, espetada no ponto (x, y, z) da maquete
export const Placa: React.FC<{t?: number; x: number; y: number; z?: number; cor?: string; tinta?: string; tam?: number; haste?: number; ox?: number; oy?: number; children: React.ReactNode}> = ({t, x, y, z = 0, cor = COR.branco, tinta = NAVY, tam = 40, haste = 70, ox, oy, children}) => {
  const f = useCurrentFrame();
  if (t !== undefined && f < t * FPS) return null;
  const p = t === undefined ? 1 : cair(f, t);
  const [px, py] = tela(x, y, z, ox, oy);
  return (
    <div style={{position: 'absolute', left: px, top: py, transform: `translate(-50%, -100%) translateY(${(1 - p) * -120}px)`, opacity: Math.min(1, p * 2.5), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{background: cor, color: tinta, fontFamily: BRINQUEDO, fontWeight: 600, fontSize: tam, lineHeight: 1.1, padding: `${tam * 0.3}px ${tam * 0.6}px`, borderRadius: tam * 0.45, border: `4px solid ${mistura(cor === COR.branco ? '#C9D3E6' : cor, 0, 0.25)}`, boxShadow: '0 8px 0 rgba(11,31,58,.16)', whiteSpace: 'nowrap', textAlign: 'center'}}>{children}</div>
      <div style={{width: 12, height: haste, background: '#B58B5A', borderRadius: '0 0 6px 6px'}} />
    </div>
  );
};

// ele num totem em pé; balança com o volume da voz
// px/py (opcional) = posição fixa na tela (base do totem), em vez de um ponto da maquete
export const Totem: React.FC<{x?: number; y?: number; z?: number; px?: number; py?: number; w?: number; src: string; amp: number[]; fundo?: string; ox?: number; oy?: number; corte?: [number, number, number, number, number]}> = ({x = 0, y = 0, z = 0, px: fx, py: fy, w = 300, src, amp, fundo = COR.amarelo, ox, oy, corte = [260, 100, 480, 460, 1000]}) => {
  const f = useCurrentFrame();
  const bruto = amp[Math.min(amp.length - 1, Math.floor(f / 2) * 2)] ?? 0;
  const a = Math.max(0, (bruto - 0.35) / 0.65);
  const [tx, ty] = tela(x, y, z, ox, oy);
  const px = fx ?? tx;
  const py = fy ?? ty;
  const [cx, cy, cw, ch, total] = corte;
  const k = w / cw;
  return (
    <div style={{position: 'absolute', left: px, top: py, transform: `translate(-50%, -100%) rotate(${-2 + a * 4}deg) translateY(${-a * 10}px)`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{position: 'relative', width: w, height: ch * k, background: fundo, borderRadius: 34, border: `6px solid ${mistura(fundo, 0, 0.25)}`, boxShadow: '0 10px 0 rgba(11,31,58,.16)', overflow: 'hidden'}}>
        <Img src={src} style={{position: 'absolute', width: total * k, left: -cx * k, top: -cy * k, filter: 'url(#corte-maquete)'}} />
      </div>
      <div style={{width: 16, height: 60, background: '#B58B5A', borderRadius: '0 0 8px 8px'}} />
    </div>
  );
};
