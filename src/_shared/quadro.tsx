import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as carregaPincel} from '@remotion/google-fonts/CaveatBrush';
import {loadFont as carregaMao} from '@remotion/google-fonts/Caveat';
import {clamp, FPS} from './conversa';

// Kit do estilo "quadro-negro". Vertical 1080x1920.
// Lousa verde com moldura de madeira; tudo é escrito e desenhado a giz na hora da fala,
// o traço treme de leve (rabisco tremido: três variações do filtro, trocando a cada 4 quadros)
// e a cena é apagada por um apagador antes da próxima.
// Uso: <Quadro> por baixo, <FiltrosQuadro /> uma vez, e cada cena dentro de <CenaQuadro ini fim>.

export const PINCEL = carregaPincel('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const MAO_GIZ = carregaMao('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const GIZ = {branco: '#F4F1E8', amarelo: '#F7E27C', rosa: '#F5A9BD', azul: '#A5D8F3', verde: '#B7E6A8', laranja: '#F9C08A'} as const;
const qd = (seg: number) => Math.round(seg * FPS);

export const FiltrosQuadro: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      {[0, 1, 2].map((i) => (
        <filter key={i} id={`giz${i}`} x="-2%" y="-2%" width="104%" height="104%">
          {/* grão do giz: fura o traço com ruído fino */}
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={11 + i * 7} result="grao" />
          <feColorMatrix in="grao" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="masc" />
          <feComposite in="SourceGraphic" in2="masc" operator="in" result="giz" />
          {/* tremida de mão */}
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={3 + i * 5} result="onda" />
          <feDisplacementMap in="giz" in2="onda" scale={7} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
      <filter id="poeira">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={7} />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.2" />
      </filter>
    </defs>
  </svg>
);

// lousa com moldura de madeira, manchas de apagador e a canaleta com os gizes
export const Quadro: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'linear-gradient(#7d5437, #5c3b26)'}}>
    <div style={{position: 'absolute', left: 30, right: 30, top: 30, bottom: 124, borderRadius: 14, overflow: 'hidden', background: 'radial-gradient(120% 85% at 50% 38%, #315c4e 0%, #244639 55%, #1b3830 100%)', boxShadow: 'inset 0 0 0 5px rgba(0,0,0,.28), inset 0 0 140px rgba(0,0,0,.4)'}}>
      {[
        [120, 260, 620, 190, -8, 0.06],
        [420, 900, 560, 220, 6, 0.05],
        [60, 1380, 700, 200, -4, 0.055],
        [520, 520, 420, 160, 12, 0.04],
      ].map(([x, y, w, h, g, o], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: '50%', background: '#fff', opacity: o, filter: 'blur(46px)', transform: `rotate(${g}deg)`}} />
      ))}
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.5}}><rect width="100%" height="100%" filter="url(#poeira)" /></svg>
    </div>
    {/* canaleta */}
    <div style={{position: 'absolute', left: 30, right: 30, bottom: 44, height: 80, borderRadius: '0 0 10px 10px', background: 'linear-gradient(#8a5f40, #6a4630)', boxShadow: 'inset 0 10px 14px rgba(0,0,0,.35), 0 10px 18px rgba(0,0,0,.35)'}}>
      {[
        [90, GIZ.branco, 120, -3],
        [250, GIZ.amarelo, 90, 4],
        [380, GIZ.rosa, 70, -6],
        [780, GIZ.azul, 100, 2],
      ].map(([x, cor, w, g], i) => (
        <div key={i} style={{position: 'absolute', left: x as number, top: 26, width: w as number, height: 22, borderRadius: 8, background: cor as string, transform: `rotate(${g}deg)`, boxShadow: '0 4px 6px rgba(0,0,0,.35)'}} />
      ))}
    </div>
    {children}
  </AbsoluteFill>
);

const Apagador: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 280, height: 130, transform: 'rotate(-9deg)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 22px 30px rgba(0,0,0,.45)'}}>
    <div style={{height: 50, background: 'linear-gradient(#d3a66f, #b98952)'}} />
    <div style={{height: 80, background: 'linear-gradient(#34343a, #222226)'}} />
  </div>
);

// cena do quadro: o conteúdo ganha o grão do giz e treme; no fim, o apagador passa e limpa
export const CenaQuadro: React.FC<{ini: number; fim: number; ultima?: boolean; children: React.ReactNode}> = ({ini, fim, ultima, children}) => {
  const f = useCurrentFrame();
  if (f < qd(ini) || f > qd(fim) + 1) return null;
  const p = ultima ? 0 : interpolate(f, [qd(fim) - 8, qd(fim)], [0, 1], clamp);
  const x = -300 + p * 1500;
  return (
    <>
      <AbsoluteFill style={{filter: `url(#giz${Math.floor(f / 4) % 3})`, clipPath: p > 0 ? `inset(0 0 0 ${Math.min(100, Math.max(0, (x + 150) / 10.8))}%)` : undefined}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? <Apagador x={x} y={720 + Math.sin(p * 9) * 430} /> : null}
    </>
  );
};

// texto a giz, escrito letra a letra entre t e t+dur
export const Giz: React.FC<{t: number; dur?: number; x: number; y: number; w?: number; tam?: number; cor?: string; alinhar?: 'left' | 'center' | 'right'; giro?: number; mao?: boolean; children: string}> = ({t, dur, x, y, w, tam = 96, cor = GIZ.branco, alinhar = 'left', giro = 0, mao, children}) => {
  const f = useCurrentFrame();
  if (f < qd(t)) return null;
  const d = dur ?? Math.max(0.22, children.length * 0.026);
  const n = Math.round(interpolate(f, [qd(t), qd(t + d)], [0, children.length], clamp));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: alinhar, whiteSpace: w ? 'normal' : 'nowrap', fontFamily: mao ? MAO_GIZ : PINCEL, fontWeight: mao ? 700 : 400, fontSize: tam, lineHeight: 1.06, color: cor, transform: `rotate(${giro}deg)`, transformOrigin: 'left center'}}>
      <span>{children.slice(0, n)}</span><span style={{opacity: 0}}>{children.slice(n)}</span>
    </div>
  );
};

// traço a giz que se desenha: d = caminho SVG em px dentro de uma caixa w x h
export const Risco: React.FC<{t: number; dur?: number; x: number; y: number; w: number; h: number; d: string; cor?: string; larg?: number}> = ({t, dur = 0.4, x, y, w, h, d, cor = GIZ.branco, larg = 9}) => {
  const f = useCurrentFrame();
  if (f < qd(t)) return null;
  const p = interpolate(f, [qd(t), qd(t + dur)], [0, 1], clamp);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={cor} strokeWidth={larg} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// caminhos prontos (um pouco tortos de propósito)
export const caixa = (w: number, h: number, r = 30) => `M ${r} 5 L ${w - r} 0 Q ${w} 0 ${w - 3} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h - 3} L ${r} ${h} Q 0 ${h} 3 ${h - r} L 0 ${r} Q 0 0 ${r + 10} 4`;
export const oval = (w: number, h: number) => `M ${w * 0.5} 5 C ${w * 1.04} 0 ${w * 1.05} ${h} ${w * 0.5} ${h - 4} C ${-w * 0.05} ${h} ${-w * 0.04} ${h * 0.02} ${w * 0.58} 9`;
export const setaDir = (w: number, h: number) => `M 5 ${h / 2} L ${w - 8} ${h / 2} M ${w - 44} ${h / 2 - 32} L ${w - 6} ${h / 2} L ${w - 44} ${h / 2 + 32}`;
export const setaBaixo = (w: number, h: number) => `M ${w / 2} 5 L ${w / 2} ${h - 8} M ${w / 2 - 32} ${h - 44} L ${w / 2} ${h - 6} L ${w / 2 + 32} ${h - 44}`;
export const setaCima = (w: number, h: number) => `M ${w / 2} ${h - 5} L ${w / 2} 8 M ${w / 2 - 32} 44 L ${w / 2} 6 L ${w / 2 + 32} 44`;
export const sublinha = (w: number) => `M 5 16 Q ${w * 0.25} 2 ${w * 0.5} 13 T ${w - 5} 9`;
export const certo = (w: number, h: number) => `M 6 ${h * 0.55} L ${w * 0.38} ${h - 8} L ${w - 6} 8`;
export const laco = (w: number, h: number) => `M ${w * 0.86} ${h * 0.32} A ${w * 0.38} ${h * 0.38} 0 1 0 ${w * 0.88} ${h * 0.64} M ${w * 0.7} ${h * 0.1} L ${w * 0.87} ${h * 0.32} L ${w * 0.62} ${h * 0.4}`;
export const notebook = 'M 60 10 L 300 10 L 300 172 L 60 172 Z M 22 200 L 338 200 L 358 230 L 2 230 Z';
export const pasta = 'M 6 40 L 6 196 L 294 196 L 294 46 L 140 46 L 112 12 L 30 12 L 6 40 Z';
