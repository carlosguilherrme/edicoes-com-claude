import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as carregaNeon} from '@remotion/google-fonts/TiltNeon';
import {clamp, FPS} from './conversa';

// Kit do estilo "desenho que brilha". Vertical 1080x1920.
// Parede escura; letreiros e desenhos de tubo de neon que acendem piscando na hora da fala,
// com núcleo branco e halo colorido. A cena apaga piscando antes da próxima.
// Uso: <Parede> por baixo e cada cena dentro de <CenaNeon ini fim>.

export const TUBO = carregaNeon('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const NEON = {ciano: '#3DF2FF', rosa: '#FF4FD8', amarelo: '#FFE45C', verde: '#5CFF9D', laranja: '#FF9B3D', roxo: '#A47BFF', branco: '#F4F7FF'} as const;
const qn = (seg: number) => Math.round(seg * FPS);

// acende piscando: quadros desde o instante t
const PISCA = [0.9, 0.15, 1, 0.35, 1, 0.7, 1];
export const acende = (f: number, t: number) => {
  const d = f - qn(t);
  if (d < 0) return 0;
  return d < PISCA.length ? PISCA[d] : 1;
};
// respiração leve do brilho
const pulso = (f: number, fase = 0) => 0.92 + 0.08 * Math.sin(f / 9 + fase);

export const Parede: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#06070D'}}>
    {/* tijolos bem discretos */}
    <AbsoluteFill style={{opacity: 0.5, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)', backgroundSize: '100% 74px, 180px 148px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(90% 60% at 50% 42%, rgba(60,80,200,.16), transparent 70%), radial-gradient(120% 70% at 50% 110%, rgba(255,79,216,.10), transparent 60%)'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(0,0,0,.85)'}} />
    {children}
  </AbsoluteFill>
);

// cena: tudo apaga piscando nos últimos quadros
export const CenaNeon: React.FC<{ini: number; fim: number; ultima?: boolean; children: React.ReactNode}> = ({ini, fim, ultima, children}) => {
  const f = useCurrentFrame();
  if (f < qn(ini) || f >= qn(fim)) return null;
  const r = qn(fim) - f; // quadros que faltam
  const op = ultima ? 1 : r <= 1 ? 0.1 : r === 2 ? 0.7 : r === 3 ? 0.2 : r === 4 ? 0.85 : 1;
  return <AbsoluteFill style={{opacity: op}}>{children}</AbsoluteFill>;
};

const halo = (cor: string, forca = 1) => `0 0 ${6 * forca}px #fff, 0 0 ${16 * forca}px ${cor}, 0 0 ${38 * forca}px ${cor}, 0 0 ${80 * forca}px ${cor}`;

// letreiro de neon; acende em t. "apagado" deixa o tubo desligado (cinza) até acender em t
export const Neon: React.FC<{t: number; x: number; y: number; w?: number; tam?: number; cor?: string; alinhar?: 'left' | 'center' | 'right'; giro?: number; fraco?: boolean; fantasma?: boolean; children: React.ReactNode}> = ({t, x, y, w, tam = 110, cor = NEON.ciano, alinhar = 'left', giro = 0, fraco, fantasma, children}) => {
  const f = useCurrentFrame();
  const a = acende(f, t);
  if (a <= 0 && !fantasma) return null;
  const forca = (fraco ? 0.5 : 1) * pulso(f, x + y);
  const base: React.CSSProperties = {position: 'absolute', left: x, top: y, width: w, textAlign: alinhar, whiteSpace: w ? 'normal' : 'nowrap', fontFamily: TUBO, fontSize: tam, lineHeight: 1.05, transform: `rotate(${giro}deg)`};
  return (
    <>
      {fantasma ? <div style={{...base, color: 'rgba(255,255,255,.10)'}}>{children}</div> : null}
      {a > 0 ? <div style={{...base, color: '#fff', opacity: a, textShadow: halo(cor, forca)}}>{children}</div> : null}
    </>
  );
};

// tubo de neon desenhado: d = caminho SVG em px dentro de uma caixa w x h; desenha de t a t+dur
export const Tubo: React.FC<{t: number; dur?: number; x: number; y: number; w: number; h: number; d: string; cor?: string; larg?: number; fraco?: boolean}> = ({t, dur = 0.45, x, y, w, h, d, cor = NEON.ciano, larg = 10, fraco}) => {
  const f = useCurrentFrame();
  if (f < qn(t)) return null;
  const p = interpolate(f, [qn(t), qn(t + dur)], [0, 1], clamp);
  const k = (fraco ? 0.55 : 1) * pulso(f, x - y);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: `drop-shadow(0 0 ${5 * k}px ${cor}) drop-shadow(0 0 ${16 * k}px ${cor}) drop-shadow(0 0 ${40 * k}px ${cor})`}}>
      <path d={d} pathLength={1} fill="none" stroke={cor} strokeWidth={larg} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={larg * 0.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.92} />
    </svg>
  );
};

// bloco de neon (moldura acesa) com rótulo opcional; posição e tamanho podem vir animados de fora
export const Bloco: React.FC<{t: number; x: number; y: number; w: number; h: number; cor?: string; cheio?: boolean; tam?: number; children?: React.ReactNode}> = ({t, x, y, w, h, cor = NEON.rosa, cheio, tam = 40, children}) => {
  const f = useCurrentFrame();
  const a = acende(f, t);
  if (a <= 0) return null;
  const k = pulso(f, x + y);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, border: `5px solid #fff`, opacity: a, background: cheio ? `${cor}33` : 'transparent',
      boxShadow: `0 0 ${10 * k}px ${cor}, 0 0 ${30 * k}px ${cor}, inset 0 0 ${12 * k}px ${cor}, inset 0 0 ${30 * k}px ${cor}66`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: TUBO, fontSize: tam, color: '#fff', textShadow: halo(cor, 0.6 * k), textAlign: 'center', lineHeight: 1.05}}>
      {children}
    </div>
  );
};

// caminhos prontos
export const circulo = (w: number, h: number) => `M ${w / 2} 6 A ${w / 2 - 6} ${h / 2 - 6} 0 1 1 ${w / 2 - 0.1} 6`;
export const moldura = (w: number, h: number, r = 34) => `M ${r} 6 L ${w - r} 6 Q ${w - 6} 6 ${w - 6} ${r} L ${w - 6} ${h - r} Q ${w - 6} ${h - 6} ${w - r} ${h - 6} L ${r} ${h - 6} Q 6 ${h - 6} 6 ${h - r} L 6 ${r} Q 6 6 ${r} 6`;
export const setaBaixoN = (w: number, h: number) => `M ${w / 2} 6 L ${w / 2} ${h - 10} M ${w / 2 - 34} ${h - 48} L ${w / 2} ${h - 8} L ${w / 2 + 34} ${h - 48}`;
export const setaDirN = (w: number, h: number) => `M 6 ${h / 2} L ${w - 10} ${h / 2} M ${w - 48} ${h / 2 - 34} L ${w - 8} ${h / 2} L ${w - 48} ${h / 2 + 34}`;
export const certoN = (w: number, h: number) => `M 8 ${h * 0.55} L ${w * 0.38} ${h - 10} L ${w - 8} 10`;
export const xisN = (w: number, h: number) => `M 10 10 L ${w - 10} ${h - 10} M ${w - 10} 10 L 10 ${h - 10}`;
export const sublinhaN = (w: number) => `M 6 12 L ${w - 6} 12`;
export const pessoaN = 'M 60 12 A 26 26 0 1 1 59.9 12 M 12 128 Q 12 76 60 76 Q 108 76 108 128';
export const cartaN = 'M 8 10 L 152 10 L 152 110 L 8 110 Z M 8 14 L 80 68 L 152 14';
export const relogioN = 'M 90 8 A 82 82 0 1 1 89.9 8 M 90 44 L 90 92 L 124 112';
