import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as carregaTitulo} from '@remotion/google-fonts/Bangers';
import {loadFont as carregaTexto} from '@remotion/google-fonts/ComicNeue';
import {clamp, FPS} from './conversa';

// Kit do estilo "quadrinhos". Vertical 1080x1920.
// Página de gibi com retícula; painéis de contorno grosso e sombra dura que pulam na fala,
// letreiro com contorno preto, legendas amarelas, balões de fala e estouros de onomatopeia.
// Uso: <PaginaGibi> por baixo e cada cena dentro de <CenaGibi ini fim>.

export const LETREIRO = carregaTitulo('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const FALA = carregaTexto('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;
export const GIBI = {papel: '#FDF4DC', preto: '#141414', amarelo: '#FFD93B', vermelho: '#FF4B3E', azul: '#2F7BFF', verde: '#2FBF71', roxo: '#8B5CF6', laranja: '#FF8A1F', marinho: '#1F2A6B', branco: '#FFFFFF'} as const;
const qg = (seg: number) => Math.round(seg * FPS);
const salto = Easing.out(Easing.back(2.2));

// 0 a 1 com estalo (passa um pouco de 1 e volta)
export const pula = (f: number, t: number, d = 9) => (f < qg(t) ? 0 : interpolate(f, [qg(t), qg(t) + d], [0, 1], {...clamp, easing: salto}));
const reticula = (cor: string, tam = 16) => ({backgroundImage: `radial-gradient(${cor} 24%, transparent 26%)`, backgroundSize: `${tam}px ${tam}px`});

export const PaginaGibi: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: GIBI.papel}}>
    <AbsoluteFill style={{...reticula('rgba(20,20,20,.07)', 18)}} />
    {children}
  </AbsoluteFill>
);

// cena: a página entra da direita e sai pela esquerda, como virar a folha
export const CenaGibi: React.FC<{ini: number; fim: number; ultima?: boolean; children: React.ReactNode}> = ({ini, fim, ultima, children}) => {
  const f = useCurrentFrame();
  if (f < qg(ini) || f >= qg(fim)) return null;
  const entra = ini === 0 ? 1 : interpolate(f, [qg(ini), qg(ini) + 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sai = ultima ? 0 : interpolate(f, [qg(fim) - 6, qg(fim)], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return <AbsoluteFill style={{transform: `translateX(${(1 - entra) * 1100 - sai * 1100}px) rotate(${(1 - entra) * 5 - sai * 5}deg)`}}>{children}</AbsoluteFill>;
};

// painel: contorno grosso, sombra dura, retícula por cima da cor; pula em t
export const Painel: React.FC<{t: number; x: number; y: number; w: number; h: number; cor?: string; giro?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({t, x, y, w, h, cor = GIBI.branco, giro = 0, children, style}) => {
  const f = useCurrentFrame();
  const p = pula(f, t);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: cor, border: `9px solid ${GIBI.preto}`, borderRadius: 8, boxShadow: `12px 14px 0 ${GIBI.preto}`, overflow: 'hidden', transform: `scale(${p}) rotate(${giro + (1 - p) * -6}deg)`, ...style}}>
      <div style={{position: 'absolute', inset: 0, ...reticula('rgba(255,255,255,.20)', 14), pointerEvents: 'none'}} />
      <div style={{position: 'absolute', inset: 0}}>{children}</div>
    </div>
  );
};

// letreiro com contorno preto; bate na tela em t
export const Letreiro: React.FC<{t: number; x: number; y: number; w?: number; tam?: number; cor?: string; alinhar?: 'left' | 'center' | 'right'; giro?: number; children: React.ReactNode}> = ({t, x, y, w, tam = 140, cor = GIBI.branco, alinhar = 'left', giro = -2, children}) => {
  const f = useCurrentFrame();
  if (f < qg(t)) return null;
  const p = interpolate(f, [qg(t), qg(t) + 7], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: alinhar, whiteSpace: w ? 'normal' : 'nowrap', fontFamily: LETREIRO, fontSize: tam, lineHeight: 0.98, letterSpacing: '0.02em', color: cor,
      WebkitTextStroke: `${Math.max(5, tam * 0.055)}px ${GIBI.preto}`, paintOrder: 'stroke fill', textShadow: `${tam * 0.045}px ${tam * 0.05}px 0 ${GIBI.preto}`, opacity: Math.min(1, p * 2), transform: `rotate(${giro}deg) scale(${2 - p})`, transformOrigin: alinhar === 'center' ? 'center' : 'left center'}}>
      {children}
    </div>
  );
};

// texto de fala/narração (Comic Neue), aparece em t
export const Texto: React.FC<{t: number; x: number; y: number; w?: number; tam?: number; cor?: string; alinhar?: 'left' | 'center' | 'right'; children: React.ReactNode}> = ({t, x, y, w, tam = 56, cor = GIBI.preto, alinhar = 'left', children}) => {
  const f = useCurrentFrame();
  const p = pula(f, t, 7);
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: alinhar, fontFamily: FALA, fontWeight: 700, fontSize: tam, lineHeight: 1.1, color: cor, opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: alinhar === 'center' ? 'center' : 'left center'}}>{children}</div>;
};

// legenda de narração: caixa amarela de contorno preto
export const Legenda: React.FC<{t: number; x: number; y: number; w?: number; tam?: number; cor?: string; giro?: number; children: React.ReactNode}> = ({t, x, y, w, tam = 50, cor = GIBI.amarelo, giro = 0, children}) => {
  const f = useCurrentFrame();
  const p = pula(f, t);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, background: cor, border: `7px solid ${GIBI.preto}`, boxShadow: `8px 9px 0 ${GIBI.preto}`, padding: `${tam * 0.26}px ${tam * 0.5}px`, fontFamily: FALA, fontWeight: 700, fontSize: tam, lineHeight: 1.08, textTransform: 'uppercase', color: GIBI.preto, transform: `scale(${p}) rotate(${giro}deg)`, transformOrigin: 'left center'}}>
      {children}
    </div>
  );
};

// balão de fala, com o rabinho apontando para baixo-esquerda ou baixo-direita
export const Balao: React.FC<{t: number; x: number; y: number; w: number; tam?: number; rabo?: 'esq' | 'dir' | 'nenhum'; children: React.ReactNode}> = ({t, x, y, w, tam = 60, rabo = 'esq', children}) => {
  const f = useCurrentFrame();
  const p = pula(f, t);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${p})`, transformOrigin: rabo === 'dir' ? 'right bottom' : 'left bottom'}}>
      <div style={{position: 'relative', background: '#fff', border: `8px solid ${GIBI.preto}`, borderRadius: 70, padding: `${tam * 0.55}px ${tam * 0.8}px`, fontFamily: FALA, fontWeight: 700, fontSize: tam, lineHeight: 1.1, color: GIBI.preto, textAlign: 'center', boxShadow: `9px 10px 0 ${GIBI.preto}`}}>{children}</div>
      {rabo !== 'nenhum' ? (
        <svg width={90} height={80} viewBox="0 0 90 80" style={{position: 'absolute', bottom: -66, [rabo === 'dir' ? 'right' : 'left']: 90, transform: rabo === 'dir' ? 'scaleX(-1)' : undefined} as React.CSSProperties}>
          <path d="M 10 0 L 4 74 L 70 0" fill="#fff" stroke={GIBI.preto} strokeWidth={8} strokeLinejoin="round" />
          <path d="M 6 -6 L 76 -6" stroke="#fff" strokeWidth={14} />
        </svg>
      ) : null}
    </div>
  );
};

// estouro de onomatopeia: estrela pontuda com letreiro dentro
export const Estouro: React.FC<{t: number; x: number; y: number; tam: number; cor?: string; corTexto?: string; fonte?: number; giro?: number; pontas?: number; children: React.ReactNode}> = ({t, x, y, tam, cor = GIBI.amarelo, corTexto = GIBI.vermelho, fonte, giro = -8, pontas = 14, children}) => {
  const f = useCurrentFrame();
  const p = pula(f, t, 10);
  if (p <= 0) return null;
  const pts = Array.from({length: pontas * 2}, (_, i) => {
    const r = i % 2 === 0 ? 50 : 34 + ((i * 7) % 5);
    const a = (Math.PI * i) / pontas;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a) * 0.82}`;
  }).join(' ');
  const treme = Math.sin(f / 2.2) * 1.2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: tam, height: tam * 0.82, transform: `scale(${p}) rotate(${giro + treme}deg)`}}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', filter: `drop-shadow(8px 10px 0 ${GIBI.preto})`}}>
        <polygon points={pts} fill={cor} stroke={GIBI.preto} strokeWidth={2.6} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: LETREIRO, fontSize: fonte ?? tam * 0.2, lineHeight: 0.95, color: corTexto, WebkitTextStroke: `${Math.max(4, (fonte ?? tam * 0.2) * 0.06)}px ${GIBI.preto}`, paintOrder: 'stroke fill', padding: `0 ${tam * 0.2}px`}}>{children}</div>
    </div>
  );
};

// linhas de velocidade saindo do centro
export const Raios: React.FC<{cor?: string; op?: number}> = ({cor = 'rgba(20,20,20,.12)', op = 1}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: op, background: `repeating-conic-gradient(from ${f * 0.6}deg, ${cor} 0deg 3deg, transparent 3deg 12deg)`, WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 22%, #000 70%)', maskImage: 'radial-gradient(circle at 50% 50%, transparent 22%, #000 70%)'}} />;
};

// haltere desenhado: n anilhas de cada lado (carga do treino)
export const Haltere: React.FC<{x: number; y: number; n: number; cor?: string; escala?: number}> = ({x, y, n, cor = GIBI.amarelo, escala = 1}) => {
  const larg = 300;
  return (
    <svg width={larg * escala} height={160 * escala} viewBox={`0 0 ${larg} 160`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <rect x={20} y={70} width={larg - 40} height={20} rx={8} fill="#ddd" stroke={GIBI.preto} strokeWidth={7} />
      {Array.from({length: n}, (_, i) => {
        const h = 150 - i * 22;
        return (
          <React.Fragment key={i}>
            <rect x={44 + i * 19} y={80 - h / 2} width={14} height={h} rx={5} fill={cor} stroke={GIBI.preto} strokeWidth={6} />
            <rect x={larg - 58 - i * 19} y={80 - h / 2} width={14} height={h} rx={5} fill={cor} stroke={GIBI.preto} strokeWidth={6} />
          </React.Fragment>
        );
      })}
    </svg>
  );
};
