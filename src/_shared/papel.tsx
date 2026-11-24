import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {clamp, FPS, mola, NAVY, SANS, SERIF, VERDE, VERMELHO} from './conversa';

// Kit do estilo "papel recortado".
// Vertical 1080x1920. Cada peça é um pedaço de papel com borda irregular, sombra dupla e tremidinha de stop motion.
// Uso: pôr <Filtros /> uma vez no topo da composição e <Grao /> por cima de tudo.
// Exemplo completo: src/videos/papel-recortado/PapelRecortado.tsx

export const KRAFT = '#E6DAC3';
export const PAPEL = '#FBF7EE';
export const AMARELO = '#E3B341';
export const SOMBRA = 'drop-shadow(0 5px 0 rgba(70,45,10,.10)) drop-shadow(0 16px 16px rgba(70,45,10,.22))';
export const passo = (f: number, n = 2) => Math.floor(f / n) * n;
// entrada "stop motion": anda de 2 em 2 quadros
export const cai = (f: number, t: number, d = 9) => interpolate(passo(f), [t * FPS, t * FPS + d], [0, 1], {...clamp, easing: mola});
// tremidinha de papel: muda a cada 4 quadros
export const treme = (f: number, seed: number, amp = 0.7) => {
  const x = Math.sin(Math.floor(f / 4) * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2 * amp;
};

export const Filtros: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="rasgo" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="adesivo" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceGraphic" result="duro"><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 1 1" /></feComponentTransfer>
        <feMorphology in="duro" operator="dilate" radius={11} result="gordo" />
        <feFlood floodColor="#FFFDF7" result="branco" />
        <feComposite in="branco" in2="gordo" operator="in" result="borda" />
        <feMerge><feMergeNode in="borda" /><feMergeNode in="duro" /></feMerge>
      </filter>
      <filter id="grao" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.15  0 0 0 0.55 -0.12" />
      </filter>
    </defs>
  </svg>
);

export type PecaProps = {t: number; x: number; y: number; w?: number; h?: number; cor?: string; giro?: number; seed?: number; raio?: number | string; de?: 'cima' | 'baixo' | 'esq' | 'dir'; liso?: boolean; style?: React.CSSProperties; children?: React.ReactNode};
// pedaço de papel: fundo com borda irregular + sombra, conteúdo por cima sem distorção
export const Peca: React.FC<PecaProps> = ({t, x, y, w, h, cor = PAPEL, giro = 0, seed = 1, raio = 18, de = 'cima', liso, style, children}) => {
  const f = useCurrentFrame();
  const p = cai(f, t);
  if (f < t * FPS) return null;
  const d = (1 - p) * 110;
  const dx = de === 'esq' ? -d : de === 'dir' ? d : 0;
  const dy = de === 'cima' ? -d : de === 'baixo' ? d : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, filter: SOMBRA, opacity: Math.min(1, p * 4),
      transform: `translate(${dx}px, ${dy}px) rotate(${giro + treme(f, seed) + (1 - p) * -9}deg)`, ...style}}>
      <div style={{position: 'absolute', inset: 0, background: cor, borderRadius: raio, filter: liso ? undefined : 'url(#rasgo)'}} />
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};

export const Carimbo: React.FC<{t: number; x: number; y: number; mito?: boolean; texto?: string; cor?: string; giro?: number; tam?: number}> = ({t, x, y, mito, texto, cor: corLivre, giro = -9, tam = 110}) => {
  const f = useCurrentFrame();
  if (f < t * FPS - 1) return null;
  const p = interpolate(f, [t * FPS - 1, t * FPS + 5], [0, 1], {...clamp, easing: mola});
  const cor = corLivre ?? (mito ? VERMELHO : VERDE);
  return (
    <div style={{position: 'absolute', left: x, top: y, filter: SOMBRA, opacity: Math.min(1, p * 2), transform: `rotate(${giro + treme(f, 31, 0.5)}deg) scale(${2.5 - 1.5 * p})`}}>
      <div style={{position: 'absolute', inset: 0, background: cor, borderRadius: 26, filter: 'url(#rasgo)'}} />
      <div style={{position: 'relative', margin: 12, border: '5px dashed rgba(255,255,255,.75)', borderRadius: 18, padding: `${tam * 0.1}px ${tam * 0.38}px`, fontFamily: SANS, fontWeight: 700, fontSize: tam, letterSpacing: tam * 0.05, color: '#fff', lineHeight: 1.1}}>
        {texto ?? (mito ? 'MITO' : 'VERDADE')}
      </div>
    </div>
  );
};

// apresentador: a foto dele recortada como adesivo, balança com o volume da voz
// apresentador: foto recortada como adesivo, balança com o volume da voz.
// src = staticFile do PNG recortado; amp = volume por quadro (0 a 1, gerado por amp.py);
// corte = região do busto na foto [x, y, largura, altura, largura total da foto].
// boca (opcional, teste de 15/11/2026): recorta o queixo e faz ele descer com a voz, estilo boneco de papel.
export type Boca = {curva: [number, number, number, number, number, number]; contorno: [number, number][]; centro: [number, number]; raio: [number, number]; abre?: number};
// medidas na foto carlos.png (1000 px de largura): linha embaixo dos dentes de cima + contorno do queixo
export const BOCA_CARLOS: Boca = {curva: [452, 318, 496, 326, 533, 305], contorno: [[548, 310], [556, 335], [545, 358], [520, 376], [498, 381], [470, 374], [450, 356], [444, 335]], centro: [497, 319], raio: [33, 16], abre: 13};
export const Boneco: React.FC<{x: number; y: number; w: number; src: string; amp: number[]; corte?: [number, number, number, number, number]; boca?: Boca}> = ({x, y, w, src, amp, corte = [240, 90, 520, 480, 1000], boca}) => {
  const f = useCurrentFrame();
  const bruto = amp[Math.min(amp.length - 1, passo(f))] ?? 0;
  const a = Math.max(0, (bruto - 0.35) / 0.65);
  const [cx, cy, cw, ch, total] = corte;
  const k = w / cw;
  const img: React.CSSProperties = {position: 'absolute', width: total * k, left: -cx * k, top: -cy * k};
  let queixo: React.ReactNode = null;
  if (boca) {
    const fala = Math.max(0, Math.min(1, ((amp[Math.min(amp.length - 1, f)] ?? 0) - 0.5) / 0.45));
    const d = fala * (boca.abre ?? 13) * k;
    const n = (v: number) => (v * k).toFixed(1);
    const [x0, y0, qx, qy, x1, y1] = boca.curva;
    const caminho = `path('M ${n(x0)} ${n(y0)} Q ${n(qx)} ${n(qy)} ${n(x1)} ${n(y1)} ${boca.contorno.map(([px, py]) => `L ${n(px)} ${n(py)}`).join(' ')} Z')`;
    const [bx, by] = boca.centro;
    const [rx, ry] = boca.raio;
    queixo = (
      <>
        {/* interior da boca: só aparece na fresta que o queixo abre */}
        <div style={{...img, height: (cy + ch) * k, clipPath: caminho,
          background: `radial-gradient(ellipse ${n(rx * 0.5)}px ${n(ry * 0.55)}px at ${n(bx)}px ${n(by + ry * 0.75)}px, #B5545A 0 92%, transparent 100%), radial-gradient(ellipse ${n(rx)}px ${n(ry)}px at ${n(bx)}px ${n(by)}px, #2B0B10 0 96%, transparent 100%)`}} />
        <Img src={src} style={{...img, clipPath: caminho, transform: `translateY(${d.toFixed(1)}px)`}} />
      </>
    );
  }
  return (
    <div style={{position: 'absolute', left: x, top: y - a * 18, width: w, height: ch * k, transformOrigin: '50% 100%', transform: `rotate(${-2 + a * 4 + treme(f, 9, 0.9)}deg) scale(${1 + a * 0.025})`, filter: `url(#adesivo) ${SOMBRA}`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <Img src={src} style={img} />
        {queixo}
      </div>
    </div>
  );
};

export const Fala: React.FC<{t: number; x: number; y: number; w: number; children: React.ReactNode}> = ({t, x, y, w, children}) => (
  <Peca t={t} x={x} y={y} w={w} cor="#FFFFFF" raio={40} de="esq" giro={1.5} seed={17}>
    <div style={{position: 'absolute', left: -22, top: 70, width: 50, height: 50, background: '#FFFFFF', transform: 'rotate(45deg)', borderRadius: 8}} />
    <div style={{position: 'relative', padding: '30px 38px', fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.18, letterSpacing: -0.8, color: NAVY}}>{children}</div>
  </Peca>
);

// fundo: base lisa + bola de papel no canto + folha colorida inclinada atrás do mundo + "mesa" embaixo.
// Trocar base/bola/mesa muda a cara do vídeo inteiro; cor = folha da cena (uma por frase).
export const Fundo: React.FC<{cor: string; base?: string; bola?: string; mesa?: string}> = ({cor, base = KRAFT, bola = '#EFE5D0', mesa = '#D5C5A6'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: base}}>
      <div style={{position: 'absolute', right: -220, top: -240, width: 760, height: 760, borderRadius: '50%', background: bola, filter: 'url(#rasgo)'}} />
      <div style={{position: 'absolute', left: 36, top: 540, width: 1008, height: 800, background: cor, borderRadius: 30, transform: `rotate(${-1.6 + treme(f, 3, 0.3)}deg)`, filter: `url(#rasgo) ${SOMBRA}`}} />
      <div style={{position: 'absolute', left: -60, right: -60, top: 1650, height: 400, background: mesa, borderRadius: '50% 50% 0 0 / 14% 14% 0 0', filter: 'url(#rasgo)'}} />
    </AbsoluteFill>
  );
};

export const Frase: React.FC<{t: number; n: number; children: string; tam?: number}> = ({t, n, children, tam = 68}) => (
  <>
    <Peca t={t} x={70} y={200} w={940} giro={-1} seed={5} raio={26}>
      <div style={{padding: '46px 54px 46px 150px', fontFamily: SERIF, fontWeight: 500, fontSize: tam, lineHeight: 1.08, letterSpacing: -tam * 0.026, color: '#141413'}}>“{children}”</div>
    </Peca>
    <Peca t={t + 0.12} x={38} y={168} w={132} h={132} cor={AMARELO} raio="50%" giro={-8} seed={6}>
      <div style={{width: 132, height: 132, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: NAVY}}>{n}</div>
    </Peca>
  </>
);

// claro = fundo escuro: a faixa vira papel claro com letra marinho
export const Topo: React.FC<{titulo: string; n?: number; total?: number; claro?: boolean}> = ({titulo, n, total = 3, claro}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
    <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: claro ? NAVY : '#fff', background: claro ? PAPEL : NAVY, borderRadius: 12, padding: '12px 24px 10px', filter: SOMBRA}}>{titulo}</span>
    {n && <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: NAVY, background: claro ? AMARELO : PAPEL, borderRadius: 12, padding: '12px 20px 10px', filter: SOMBRA}}>{n}/{total}</span>}
  </div>
);

export const linhas = (qtd: number, cor = 'rgba(20,20,19,.16)', larguras = [92, 80, 96, 70, 88, 60]) =>
  Array.from({length: qtd}, (_, i) => <span key={i} style={{display: 'block', height: 14, borderRadius: 7, width: `${larguras[i % larguras.length]}%`, background: cor, marginBottom: 20}} />);

// grão de papel por cima de tudo (um filtro só por quadro)
export const Grao: React.FC<{w?: number; h?: number}> = ({w = 1080, h = 1920}) => (
  <AbsoluteFill style={{mixBlendMode: 'multiply', pointerEvents: 'none'}}>
    <svg width={w} height={h}><rect width={w} height={h} filter="url(#grao)" /></svg>
  </AbsoluteFill>
);
