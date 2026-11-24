import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as loadMao} from '@remotion/google-fonts/Caveat';
import {clamp, FPS, mola, NAVY} from './conversa';

// Kit do estilo "caderno desenhado". Vertical 1080x1920.
// Página de caderno; letra de mão que se escreve na hora da fala, traço de caneta que se desenha,
// marca-texto de cores alternadas, folhas coladas com fita e ele numa foto de polaroide.
// Uso: <FiltrosCaderno /> uma vez, <Pagina> por baixo de tudo.

export const MAO = loadMao('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const PAGINA = '#FDFBF4';
export const CANETA = NAVY;
export const VERMELHA = '#D9453C';
export const MARCA = {amarelo: '#FFE45C', rosa: '#FFA6C9', verde: '#A6ECA8', azul: '#9FD8FF', laranja: '#FFC98A'} as const;
export const SOMBRA_FOLHA = 'drop-shadow(0 4px 0 rgba(40,40,60,.08)) drop-shadow(0 14px 16px rgba(40,40,60,.18))';

export const FiltrosCaderno: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      {/* tremidinha de traço feito à mão */}
      <filter id="mao" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {/* limpa o halo do recorte da foto */}
      <filter id="corte" colorInterpolationFilters="sRGB">
        <feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 1 1" /></feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

// página quadriculada com margem vermelha e furos de espiral
export const Pagina: React.FC<{cor?: string; children?: React.ReactNode}> = ({cor = PAGINA, children}) => (
  <AbsoluteFill style={{background: cor,
    backgroundImage: 'linear-gradient(rgba(70,120,200,.16) 2px, transparent 2px), linear-gradient(90deg, rgba(70,120,200,.16) 2px, transparent 2px)', backgroundSize: '54px 54px', backgroundPosition: '0 30px'}}>
    <div style={{position: 'absolute', left: 96, top: 0, bottom: 0, width: 4, background: 'rgba(217,69,60,.5)'}} />
    {Array.from({length: 16}, (_, i) => <div key={i} style={{position: 'absolute', left: 30, top: 70 + i * 118, width: 36, height: 36, borderRadius: 18, background: '#D9D4C6', boxShadow: 'inset 0 4px 6px rgba(0,0,0,.25)'}} />)}
    {children}
  </AbsoluteFill>
);

// letra de mão que vai sendo escrita (aparece letra a letra entre t e t+dur)
export const Escrita: React.FC<{t: number; dur?: number; x: number; y: number; w?: number; tam?: number; cor?: string; giro?: number; alinhar?: 'left' | 'center'; children: string}> = ({t, dur, x, y, w, tam = 76, cor = CANETA, giro = -1.5, alinhar = 'left', children}) => {
  const f = useCurrentFrame();
  const d = dur ?? Math.max(0.25, children.length * 0.028);
  const n = Math.round(interpolate(f, [t * FPS, (t + d) * FPS], [0, children.length], clamp));
  if (f < t * FPS) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: alinhar, fontFamily: MAO, fontWeight: 700, fontSize: tam, lineHeight: 1.02, color: cor, transform: `rotate(${giro}deg)`, transformOrigin: '0 50%', whiteSpace: w ? 'normal' : 'nowrap'}}>
      <span>{children.slice(0, n)}</span><span style={{opacity: 0}}>{children.slice(n)}</span>
    </div>
  );
};

// traço de caneta que se desenha: d = caminho SVG em px dentro de uma caixa w x h
export const Traco: React.FC<{t: number; dur?: number; x: number; y: number; w: number; h: number; d: string; cor?: string; larg?: number; preenche?: string}> = ({t, dur = 0.35, x, y, w, h, d, cor = CANETA, larg = 7, preenche = 'none'}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t * FPS, (t + dur) * FPS], [0, 1], clamp);
  if (f < t * FPS) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: 'url(#mao)'}}>
      <path d={d} fill={preenche} stroke={cor} strokeWidth={larg} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
// caminhos prontos
export const sublinha = (w: number) => `M 4 14 Q ${w * 0.25} 2 ${w * 0.5} 12 T ${w - 4} 10`;
export const roda = (w: number, h: number) => `M ${w * 0.52} ${h * 0.06} C ${w * 0.05} ${h * 0.02} ${-w * 0.02} ${h * 0.9} ${w * 0.45} ${h * 0.95} C ${w * 1.02} ${h} ${w * 1.04} ${h * 0.1} ${w * 0.42} ${h * 0.04}`;
export const seta = (w: number, h: number) => `M 6 6 Q ${w * 0.2} ${h * 0.9} ${w - 14} ${h - 12} M ${w - 46} ${h - 40} L ${w - 12} ${h - 12} L ${w - 50} ${h + 8}`;
export const xis = (s: number) => `M 6 6 L ${s - 6} ${s - 6} M ${s - 6} 6 L 6 ${s - 6}`;
export const certo = (s: number) => `M 6 ${s * 0.55} L ${s * 0.38} ${s - 8} L ${s - 6} 8`;
export const rabisco = (w: number, h: number) => `M 6 ${h * 0.2} L ${w - 8} ${h * 0.35} L 10 ${h * 0.5} L ${w - 6} ${h * 0.66} L 8 ${h * 0.82} L ${w - 10} ${h * 0.95}`;

// marca-texto que passa por trás do texto
export const Marca: React.FC<{t: number; x: number; y: number; w: number; h?: number; cor?: string; giro?: number}> = ({t, x, y, w, h = 56, cor = MARCA.amarelo, giro = -1.5}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t * FPS, t * FPS + 9], [0, 1], {...clamp, easing: mola});
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: cor, borderRadius: 8, transformOrigin: '0 50%', transform: `rotate(${giro}deg) scaleX(${p})`, mixBlendMode: 'multiply', filter: 'url(#mao)'}} />;
};

// folha colada na página com fita
export const Folha: React.FC<{t: number; x: number; y: number; w: number; h?: number; cor?: string; fita?: string; giro?: number; children?: React.ReactNode}> = ({t, x, y, w, h, cor = '#FFFFFF', fita = MARCA.laranja, giro = -1, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t * FPS, t * FPS + 10], [0, 1], {...clamp, easing: mola});
  if (f < t * FPS) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, filter: SOMBRA_FOLHA, opacity: Math.min(1, p * 3), transform: `translateY(${(1 - p) * 60}px) rotate(${giro + (1 - p) * -5}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: cor, borderRadius: 6}} />
      <div style={{position: 'absolute', left: '50%', top: -22, width: 190, height: 46, marginLeft: -95, background: fita, opacity: 0.85, transform: 'rotate(-3deg)'}} />
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};

// ele numa polaroide colada com fita; balança com o volume da voz
export const Polaroid: React.FC<{x: number; y: number; w: number; src: string; amp: number[]; fundo?: string; fita?: string; legenda?: string; corte?: [number, number, number, number, number]}> = ({x, y, w, src, amp, fundo = MARCA.azul, fita = MARCA.rosa, legenda, corte = [260, 100, 480, 460, 1000]}) => {
  const f = useCurrentFrame();
  const bruto = amp[Math.min(amp.length - 1, Math.floor(f / 2) * 2)] ?? 0;
  const a = Math.max(0, (bruto - 0.35) / 0.65);
  const [cx, cy, cw, ch, total] = corte;
  const lado = w - 44;
  const k = lado / cw;
  return (
    <div style={{position: 'absolute', left: x, top: y - a * 12, width: w, transformOrigin: '50% 0', transform: `rotate(${-4 + a * 5}deg)`, filter: SOMBRA_FOLHA}}>
      <div style={{background: '#FFFFFF', padding: '22px 22px 0', borderRadius: 4}}>
        <div style={{position: 'relative', width: lado, height: ch * k, background: fundo, overflow: 'hidden'}}>
          <Img src={src} style={{position: 'absolute', width: total * k, left: -cx * k, top: -cy * k, filter: 'url(#corte)'}} />
        </div>
        <div style={{height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MAO, fontWeight: 700, fontSize: 48, color: CANETA}}>{legenda}</div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: -24, width: 170, height: 46, marginLeft: -85, background: fita, opacity: 0.85, transform: 'rotate(4deg)'}} />
    </div>
  );
};
