import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {loadFont as carregaArcade} from '@remotion/google-fonts/PressStart2P';
import {loadFont as carregaPixel} from '@remotion/google-fonts/PixelifySans';

// Kit do estilo "pixel art". Vertical 1080x1920.
// Jogo de plataforma 8 bits: céu em faixas, estrelas piscando, chão de blocos, bonecos feitos de quadradinhos,
// movimento em passos (sem suavizar), caixa de diálogo de RPG com texto digitado e barras de vida/experiência.
// Os bonecos são mapas de texto: cada letra é uma cor da paleta, "." é vazio.

export const ARCADE = carregaArcade('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const PIXEL = carregaPixel('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const PX = {noite: '#141A45', ceu2: '#1D2766', ceu3: '#2A3A8F', branco: '#FFFFFF', preto: '#0B0B14', amarelo: '#FFD23F', laranja: '#FF6529', verde: '#3FBF5F', verdeEsc: '#2A8F45',
  terra: '#8A5A3B', terraEsc: '#6D4429', vermelho: '#E63946', ciano: '#4CC9F0', rosa: '#FF5D8F', roxo: '#8B5CF6'} as const;

// quadro "travado": o movimento anda de n em n quadros, como jogo antigo
export const trava = (f: number, n = 2) => Math.floor(f / n) * n;

export const Sprite: React.FC<{mapa: string[]; cores: Record<string, string>; u: number; x: number; y: number; espelha?: boolean; op?: number; branco?: boolean}> = ({mapa, cores, u, x, y, espelha, op = 1, branco}) => {
  const larg = mapa[0].length;
  return (
    <svg width={larg * u} height={mapa.length * u} viewBox={`0 0 ${larg} ${mapa.length}`} shapeRendering="crispEdges" style={{position: 'absolute', left: x, top: y, opacity: op, transform: espelha ? 'scaleX(-1)' : undefined}}>
      {mapa.flatMap((linha, j) => linha.split('').map((c, i) => (c === '.' ? null : <rect key={`${i}-${j}`} x={i} y={j} width={1.02} height={1.02} fill={branco ? '#fff' : cores[c]} />)))}
    </svg>
  );
};

// céu noturno em faixas, estrelas que piscam, nuvens e morros em degraus (paralaxe pelo deslocamento do mundo)
export const Ceu: React.FC<{desloca: number}> = ({desloca}) => {
  const f = useCurrentFrame();
  const estrelas = Array.from({length: 34}, (_, i) => ({x: (i * 197 + 61) % 1080, y: (i * 131 + 40) % 900, t: i % 3}));
  const nuvem = (x: number, y: number, k: number) => {
    const px = (((x - desloca * 0.15 - trava(f, 6) * 0.5) % 1500) + 1500) % 1500 - 300;
    return (
      <div key={`${x}-${y}`} style={{position: 'absolute', left: px, top: y}}>
        <div style={{position: 'absolute', left: 0, top: 24 * k, width: 216 * k, height: 48 * k, background: '#3B4BA8'}} />
        <div style={{position: 'absolute', left: 48 * k, top: 0, width: 120 * k, height: 48 * k, background: '#3B4BA8'}} />
      </div>
    );
  };
  const morro = (((-desloca * 0.4) % 720) + 720) % 720;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${PX.noite} 0 38%, ${PX.ceu2} 38% 54%, ${PX.ceu3} 54% 100%)`, overflow: 'hidden'}}>
      {estrelas.map((e, i) => <div key={i} style={{position: 'absolute', left: e.x, top: e.y, width: 8, height: 8, background: '#fff', opacity: (Math.floor(f / 9) + e.t) % 3 === 0 ? 0.25 : 0.9}} />)}
      {nuvem(120, 300, 1)}{nuvem(760, 520, 0.8)}{nuvem(1200, 180, 1.2)}
      {[-720, 0, 720, 1440].map((b) => (
        <svg key={b} width={720} height={260} viewBox="0 0 30 11" shapeRendering="crispEdges" style={{position: 'absolute', left: b + morro - 720, top: 980}}>
          <path d="M0 11 V7 H2 V5 H4 V3 H7 V2 H10 V3 H12 V5 H14 V6 H17 V4 H19 V2 H22 V1 H25 V3 H27 V5 H29 V7 H30 V11 Z" fill="#202B73" />
        </svg>
      ))}
    </AbsoluteFill>
  );
};

// chão: faixa de grama em xadrez e terra pontilhada; "desloca" faz o chão correr
export const Chao: React.FC<{y: number; desloca: number}> = ({y, desloca}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 36, backgroundImage: `repeating-linear-gradient(90deg, ${PX.verde} 0 36px, ${PX.verdeEsc} 36px 72px)`, backgroundPosition: `${-desloca % 72}px 0`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: y + 36, bottom: 0, backgroundColor: PX.terra, backgroundImage: `linear-gradient(${PX.terraEsc} 12px, transparent 12px), linear-gradient(90deg, ${PX.terraEsc} 12px, transparent 12px)`, backgroundSize: '96px 96px', backgroundPosition: `${-desloca % 96}px 30px`}} />
  </>
);

// caixa com borda de pixel (cantos em degrau)
export const CaixaPixel: React.FC<{x: number; y: number; w: number; h: number; cor?: string; borda?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, w, h, cor = PX.preto, borda = '#fff', style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: cor, boxShadow: `0 -10px 0 ${borda}, 0 10px 0 ${borda}, -10px 0 0 ${borda}, 10px 0 0 ${borda}, 0 -20px 0 ${PX.preto}, 0 20px 0 ${PX.preto}, -20px 0 0 ${PX.preto}, 20px 0 0 ${PX.preto}`, ...style}}>{children}</div>
);

// texto digitado letra a letra, a partir do quadro q0
export const Digita: React.FC<{q0: number; cps?: number; children: string; style?: React.CSSProperties}> = ({q0, cps = 34, children, style}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(children.length, Math.floor(((f - q0) / 30) * cps)));
  const pisca = n >= children.length && Math.floor(f / 10) % 2 === 0;
  return <div style={{fontFamily: PIXEL, fontWeight: 500, fontSize: 52, lineHeight: 1.18, color: '#fff', ...style}}>{children.slice(0, n)}{pisca ? ' ▼' : ''}</div>;
};

// barra em gomos (vida ou experiência)
export const Barra: React.FC<{x: number; y: number; gomos: number; cheios: number; cor: string; larg?: number; alt?: number}> = ({x, y, gomos, cheios, cor, larg = 56, alt = 40}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap: 8, padding: 8, background: PX.preto, boxShadow: `0 0 0 6px #fff`}}>
    {Array.from({length: gomos}, (_, i) => <div key={i} style={{width: larg, height: alt, background: i < cheios ? cor : '#2a2a3a'}} />)}
  </div>
);

// ---- bonecos ----
export const COR_HEROI = {H: '#3B2314', S: '#F1C27D', K: '#141414', W: '#FFFFFF', T: PX.laranja, B: '#1D2957'};
export const HEROI_A = [
  '....HHHH....',
  '...HHHHHH...',
  '...HSSSSH...',
  '...SKSSKS...',
  '...SSSSSS...',
  '....SSSS....',
  '..WWWTTWWW..',
  '.WWWWTTWWWW.',
  '.SWWWTTWWWS.',
  '.SWWWWWWWWS.',
  '..BBBBBBBB..',
  '..BBB..BBB..',
  '..BBB..BBB..',
  '..BBB..BBB..',
  '..KKK..KKK..',
  '............',
];
export const HEROI_B = [...HEROI_A.slice(0, 11), '..BBB..BBB..', '.BBB....BBB.', '.BBB....BBB.', '.KKK....KKK.', '............'];
export const HEROI_PULO = [...HEROI_A.slice(0, 6), '.SWWWTTWWWS.', '.SWWWTTWWWS.', '..WWWTTWWW..', '..WWWWWWWW..', '..BBBBBBBB..', '.BBB....BBB.', '.KKK....KKK.', '............', '............', '............'];

export const COR_ROBO = {R: PX.laranja, A: PX.amarelo, W: '#FFFFFF', K: '#141414', M: '#7A2E10'};
export const ROBO = [
  '....AA....',
  '....AA....',
  '..RRRRRR..',
  '.RRRRRRRR.',
  '.RWKRRWKR.',
  '.RRRRRRRR.',
  '.RRMMMMRR.',
  '..RRRRRR..',
  '..R....R..',
];

export const COR_CHEFE = {R: PX.vermelho, W: '#FFFFFF', K: '#141414', D: '#9D1F2B'};
export const CHEFE = [
  '....RRRRRRRR....',
  '..RRRRRRRRRRRR..',
  '.RRWWRRRRRRWWRR.',
  '.RRWKRRRRRRKWRR.',
  'RRRRRRRRRRRRRRRR',
  'RRRRKKKKKKKKRRRR',
  'RRRKWKWKWKWKKRRR',
  'RRRRKKKKKKKKRRRR',
  '.RRRRRRRRRRRRRR.',
  '..DRRRRRRRRRRD..',
  '..DD..DDDD..DD..',
  '..DD..DDDD..DD..',
];

export const COR_ESTRELA = {Y: PX.amarelo, W: '#FFFFFF'};
export const ESTRELA = ['..Y..', '.YWY.', 'YWWWY', '.YWY.', '..Y..'];
