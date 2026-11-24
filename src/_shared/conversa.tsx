import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadSans} from '@remotion/google-fonts/DMSans';

// Peças comuns a todos os estilos: tempo por palavra (criaQ), fontes, cores, janelas, som.
// Balões de chat à direita, resposta serifada à esquerda, cartela de título sozinha, céu em degradê, indicador de passo.
// Todos os tempos em SEGUNDOS da narração; cada peça entra numa palavra falada.
// Exemplos de uso: qualquer arquivo de src/videos/.

export const SERIF = loadSerif('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const SANS = loadSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const CREME = '#FAF9F5';
export const TINTA = '#141413';
export const NAVY = '#0B1F3A';
export const VERDE = '#1E9E6A';
export const VERMELHO = '#D9534A';
export const OURO = '#C9A24B';
export const GRIFO = '#F2DE9C';
export const FPS = 30;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const mola = Easing.bezier(0.16, 1, 0.3, 1);
export const CARD = '0 30px 80px rgba(20,20,19,.10), 0 0 0 1.5px rgba(20,20,19,.06)';

export type Palavra = {w: string; s: number; e: number};
export type Janela = readonly [number, number];

const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
// q('palavra', depois) devolve o segundo em que a palavra começa. O whisper escreve número em algarismo ("3") e
// repete palavras: use `depois` para pegar a ocorrência certa. Erra alto se não achar, para o defeito aparecer no typecheck/render.
export const criaQ = (palavras: Palavra[]) => (alvo: string, depois = 0) => {
  const w = palavras.find((p) => p.s >= depois && norm(p.w).startsWith(norm(alvo)));
  if (!w) throw new Error(`palavra não encontrada: ${alvo} depois de ${depois}`);
  return w.s;
};

export const dentro = (f: number, c: Janela) => f >= c[0] * FPS && f < c[1] * FPS;
export const sobe = (f: number, t: number, d = 14) => interpolate(f, [t * FPS, t * FPS + d], [0, 1], {...clamp, easing: mola});
export const some = (f: number, c: Janela, d = 7) => interpolate(f, [c[1] * FPS - d, c[1] * FPS], [1, 0], clamp);

// balão de quem pergunta: sempre dentro de uma coluna flex alinhada à direita
export const Balao: React.FC<{t: number; children: React.ReactNode; vidro?: boolean; tam?: number; cor?: string}> = ({t, children, vidro, tam = 50, cor}) => {
  const f = useCurrentFrame();
  const p = sobe(f, t, 12);
  return (
    <div style={{alignSelf: 'flex-end', maxWidth: 1220, padding: '26px 40px', borderRadius: 44, fontFamily: SANS, fontWeight: 500, fontSize: tam, lineHeight: 1.25, letterSpacing: -0.8, color: TINTA,
      background: cor ?? (vidro ? 'rgba(255,255,255,.84)' : '#EFEEE8'), opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})`, transformOrigin: '100% 100%'}}>
      {children}
    </div>
  );
};

// resposta do assistente: serifada, sem balão, palavra por palavra
export const Resposta: React.FC<{t: number; texto: string; cor?: string; tam?: number; passo?: number}> = ({t, texto, cor = TINTA, tam = 58, passo = 2.2}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: SERIF, fontSize: tam, lineHeight: 1.18, letterSpacing: -tam * 0.012, color: cor}}>
      {texto.split(' ').map((w, i) => {
        const p = interpolate(f, [t * FPS + i * passo, t * FPS + i * passo + 6], [0, 1], clamp);
        return <span key={i} style={{opacity: p, display: 'inline-block', marginRight: '.26em', transform: `translateY(${(1 - p) * 10}px)`}}>{w}</span>;
      })}
    </div>
  );
};

// cartela de título: número dourado + frase, sozinha no creme
export const Cartela: React.FC<{c: Janela; n?: string; children: string}> = ({c, n, children}) => {
  const f = useCurrentFrame();
  if (!dentro(f, c)) return null;
  const p = Math.min(sobe(f, c[0] + 0.08, 11), some(f, c, 6));
  return (
    <AbsoluteFill style={{background: CREME, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 34, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, filter: `blur(${(1 - p) * 6}px)`}}>
        {n && <span style={{fontFamily: SERIF, fontSize: 96, color: OURO, letterSpacing: -2}}>{n}</span>}
        <span style={{fontFamily: SERIF, fontWeight: 500, fontSize: 96, color: TINTA, letterSpacing: -2.5}}>{children}</span>
      </div>
    </AbsoluteFill>
  );
};

// fundo de céu em degradê (no lugar de b-roll): frio para o problema, quente para o alívio
export const Ceu: React.FC<{quente?: boolean}> = ({quente}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: quente ? 'linear-gradient(165deg,#3E7C99 0%,#8FC0CC 48%,#F3C99B 100%)' : 'linear-gradient(170deg,#2F7089 0%,#63A9C2 55%,#9CCBD4 100%)'}}>
      <div style={{position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', left: -300 + f * 0.5, top: -700, background: 'radial-gradient(circle, rgba(255,255,255,.35), rgba(255,255,255,0) 62%)'}} />
      <div style={{position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', right: -400 - f * 0.3, bottom: -700, background: `radial-gradient(circle, ${quente ? 'rgba(255,214,170,.6)' : 'rgba(255,255,255,.25)'}, rgba(255,255,255,0) 62%)`}} />
    </AbsoluteFill>
  );
};

// indicador "passo n de total" no canto de cima
export const Passo: React.FC<{c: Janela; n: number; total?: number; rotulo?: string}> = ({c, n, total = 3, rotulo = 'passo'}) => {
  const f = useCurrentFrame();
  if (!dentro(f, c)) return null;
  const p = Math.min(sobe(f, c[0] + 0.2, 12), some(f, c));
  return (
    <div style={{position: 'absolute', left: 70, top: 54, display: 'flex', alignItems: 'center', gap: 12, opacity: p}}>
      {Array.from({length: total}, (_, i) => i + 1).map((i) => <span key={i} style={{width: i === n ? 46 : 14, height: 14, borderRadius: 7, background: i === n ? NAVY : 'rgba(20,20,19,.18)'}} />)}
      <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: 'rgba(20,20,19,.55)', marginLeft: 8}}>{rotulo} {n} de {total}</span>
    </div>
  );
};

// marca-texto que corre por baixo da palavra a partir do segundo t: <span style={grifo(f, t)}>palavra</span>
export const grifo = (f: number, t: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(${GRIFO},${GRIFO})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 72%',
  backgroundSize: `${interpolate(f, [t * FPS, t * FPS + 8], [0, 100], {...clamp, easing: mola})}% 78%`, padding: '0 .1em', borderRadius: 8,
});

// fecho padrão: traço marinho, frase de ação, caixa de comentário digitando, assinatura. `children` entra entre o título e a caixa.
export const Fecho: React.FC<{c: Janela; titulo: string; texto: string; tTitulo: number; tCaixa: number; tFim: number; valeu?: string; tam?: number; children?: React.ReactNode}> = ({c, titulo, texto, tTitulo, tCaixa, tFim, valeu = 'Valeu.', tam = 132, children}) => {
  const f = useCurrentFrame();
  if (!dentro(f, c)) return null;
  const t0 = c[0];
  const traco = interpolate(f, [t0 * FPS, t0 * FPS + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const tracoSome = interpolate(f, [t0 * FPS + 9, t0 * FPS + 14], [1, 0], clamp);
  const p = sobe(f, Math.max(tTitulo, t0 + 0.5), 14);
  const n = Math.round(interpolate(f, [tCaixa * FPS + 6, tCaixa * FPS + 6 + texto.length * 1.6], [0, texto.length], clamp));
  const cx = sobe(f, tCaixa, 12);
  const fim = sobe(f, tFim, 12);
  return (
    <AbsoluteFill style={{background: CREME}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: tracoSome}}>
        <path d="M 760 1180 C 700 800, 900 620, 1010 500 S 1230 250, 1180 -100" fill="none" stroke={NAVY} strokeWidth={90} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: tam, color: TINTA, letterSpacing: -tam * 0.026}}>{titulo}</div>
      </div>
      {children}
      <div style={{position: 'absolute', left: 510, top: 540, width: 900, opacity: cx, transform: `translateY(${(1 - cx) * 30}px)`}}>
        <div style={{background: 'white', borderRadius: 36, boxShadow: CARD, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 22}}>
          <span style={{width: 72, height: 72, borderRadius: 36, background: 'rgba(11,31,58,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36}}>💬</span>
          <span style={{flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 46, color: TINTA}}>{texto.slice(0, n)}<span style={{display: 'inline-block', width: 4, height: 46, background: NAVY, marginLeft: 4, verticalAlign: 'middle', opacity: f % 16 < 9 ? 1 : 0}} /></span>
          <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: 'white', background: NAVY, borderRadius: 999, padding: '12px 26px'}}>comentar</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', opacity: fim}}>
        {valeu && <span style={{fontFamily: SERIF, fontSize: 64, color: TINTA}}>{valeu}</span>}
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: 'rgba(20,20,19,.55)', marginTop: 10}}>IA no dia a dia · @carlosguilherrme</div>
      </div>
    </AbsoluteFill>
  );
};

// narração + efeitos [segundo, arquivo, volume] + trilha opcional.
// Efeitos: public/_comum/sfx/<arquivo>.wav (domínio público, ver LICENCAS.md).
// Trilha: o repositório não traz nenhuma. Ponha a sua em public/<pasta>/trilha.mp3 e passe trilha="trilha.mp3".
export const Som: React.FC<{pasta: string; sons: [number, string, number][]; duracao: number; total: number; trilha?: string}> = ({pasta, sons, duracao, total, trilha}) => (
  <>
    <Audio src={staticFile(`${pasta}/audio/narracao.mp3`)} />
    {sons.map(([t, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(t * FPS))} durationInFrames={90} layout="none">
        <Audio src={staticFile(`_comum/sfx/${src}.wav`)} volume={vol} />
      </Sequence>
    ))}
    {trilha && (
      <Audio src={staticFile(`${pasta}/${trilha}`)} loop
        volume={(f) => interpolate(f, [0, 20, duracao * FPS, duracao * FPS + 15, total - 25, total], [0, 0.05, 0.05, 0.13, 0.13, 0], clamp)} />
    )}
  </>
);

// rótulo pequeno de cena (ex.: "jeito 1", "exemplo")
export const Etiqueta: React.FC<{children: React.ReactNode; cor?: string; fundo?: string}> = ({children, cor = 'rgba(20,20,19,.6)', fundo = 'rgba(20,20,19,.07)'}) => (
  <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: cor, background: fundo, borderRadius: 999, padding: '8px 20px', letterSpacing: 0.3}}>{children}</span>
);
