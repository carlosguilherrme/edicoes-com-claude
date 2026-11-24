import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PALAVRAS as P0} from './dados-fonte';
import {AMP} from './amp';
import {clamp, criaQ, dentro, FPS, Janela, mola, NAVY, Palavra, SANS, SERIF, Som, VERDE, VERMELHO} from '../../_shared/conversa';
import {AMARELO, BOCA_CARLOS, Boneco as BonecoKit, cai, Carimbo, Fala, Filtros, Frase, Fundo, Grao, KRAFT, linhas, passo, Peca, SOMBRA, Topo as TopoKit, treme} from '../../_shared/papel';

// 022. teste-papel — teste do estilo "papel recortado", 1080x1920, tudo em código, sem geração por IA.
// Narração: trechos da gravação dele do "Mito ou verdade" (020): abertura + 3 frases + fecho.
// Cada frase ganha um "mundo" próprio de papel (pergaminho × bilhete, relatório com número disfarçado, notebook).
// Apresentador: a foto dele recortada como adesivo, balançando com o volume da voz (amp.ts).

const PASTA = 'papel-recortado';
const CORTES: [number, number][] = [[0, 2.72], [4.1, 20.98], [37.8, 41.0]];
const PALAVRAS: Palavra[] = [];
let base = 0;
for (const [a, b] of CORTES) {
  for (const w of P0) if (w.s >= a - 0.02 && w.s < b) PALAVRAS.push({w: w.w, s: +(w.s - a + base).toFixed(2), e: +(w.e - a + base).toFixed(2)});
  base += b - a;
}
export const DURACAO = 22.8;
export const TOTAL = Math.round((DURACAO + 2.2) * FPS);
const q = criaQ(PALAVRAS);
const T = {
  mito: q('mito'), verdade: q('verdade'), ia: q('inteligencia'),
  ts1: q('quanto'), tv1: q('mito', 4), curto: q('curto'), vence: q('vence'), longo: q('longo', 6), confuso: q('confuso'),
  seg: q('segunda'), ts2: q('ia', 7.3), cara: q('cara'), tv2: q('verdade', 9.5), fonte: q('fonte'), confira: q('confira'),
  vamos: q('vamos', 12), ts3: q('precisa'), prog: q('programar'), auto: q('automatizar'), tv3: q('mito', 15), hoje: q('hoje'), port: q('portugues'), faz: q('faz'),
  qual: q('qual'), deixa: q('deixa'),
};
const C = {
  ab: [0, T.ts1 - 0.1], m1: [T.ts1 - 0.1, T.seg - 0.08], m2: [T.seg - 0.08, T.vamos - 0.06], m3: [T.vamos - 0.06, T.qual - 0.32], fecho: [T.qual - 0.32, TOTAL / FPS + 1],
} as const;

// ---- material: vem do kit src/_shared/papel.tsx ----
const OURO = AMARELO;
const ComBoca = React.createContext(false);
const Boneco: React.FC<{x: number; y: number; w: number}> = (p) => {
  const boca = React.useContext(ComBoca);
  return <BonecoKit {...p} src={staticFile('_apresentador/carlos.png')} amp={AMP} boca={boca ? BOCA_CARLOS : undefined} />;
};
const Topo: React.FC<{n?: number}> = ({n}) => <TopoKit titulo="MITO OU VERDADE · IA" n={n} total={3} />;

// ---- abertura ----
const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.ab as Janela)) return null;
  const placa = (t: number, x: number, y: number, txt: string, cor: string, giro: number, seed: number) => (
    <>
      <Peca t={t} x={x + 150} y={y + 150} w={26} h={560} cor="#B58B5A" raio={8} giro={giro} seed={seed + 1} de="baixo" />
      <Peca t={t} x={x} y={y} cor={cor} raio={30} giro={giro} seed={seed} de="baixo">
        <div style={{padding: '34px 46px', fontFamily: SANS, fontWeight: 700, fontSize: 104, letterSpacing: 5, color: '#fff', lineHeight: 1}}>{txt}</div>
      </Peca>
    </>
  );
  return (
    <AbsoluteFill>
      <Fundo cor="#EADFC8" />
      <Topo />
      <Peca t={0} x={300} y={200} cor={OURO} raio={20} giro={-2} seed={2}><div style={{padding: '18px 34px', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: NAVY}}>3 rápidas sobre IA</div></Peca>
      {([[0.1, 150, 640], [0.3, 470, 560], [0.5, 760, 700]] as [number, number, number][]).map(([t, x, y], i) => (
        <Peca key={i} t={t} x={x} y={y} w={170} h={170} cor={['#CFE0EE', '#F3D6CF', '#D5E6CF'][i]} raio="50%" seed={90 + i} giro={i * 8 - 8}><div style={{width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 120, color: NAVY}}>?</div></Peca>
      ))}
      {placa(T.mito - 0.05, 60, 400, 'MITO', VERMELHO, -7, 11)}
      {placa(T.verdade - 0.05, 470, 560, 'VERDADE', VERDE, 5, 13)}
      <Peca t={T.ia - 0.05} x={110} y={890} w={860} giro={-1.5} seed={15} raio={22}>
        <div style={{padding: '26px 30px', textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 66, letterSpacing: -1.6, color: '#141413'}}>sobre inteligência artificial</div>
      </Peca>
      <Boneco x={250} y={1090} w={580} />
    </AbsoluteFill>
  );
};

// ---- 1 · pergaminho comprido × bilhete curto ----
const Mundo1: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.m1 as Janela)) return null;
  const alt = interpolate(passo(f), [(T.ts1 + 0.35) * FPS, T.tv1 * FPS], [150, 620], clamp);
  const murcha = cai(f, T.longo, 8);
  const pulo = interpolate(f, [T.curto * FPS, T.curto * FPS + 5, T.curto * FPS + 10], [1, 1.14, 1], clamp);
  return (
    <AbsoluteFill>
      <Fundo cor="#CFE0EE" />
      <Topo n={1} />
      <Frase t={T.ts1 - 0.05} n={1}>Quanto mais longo o pedido, melhor a resposta.</Frase>
      {/* pergaminho que não acaba */}
      <div style={{position: 'absolute', left: 120, top: 600, width: 400, transformOrigin: '50% 0', transform: `rotate(${-2 + murcha * 5 + treme(f, 21, 0.5)}deg)`, filter: SOMBRA, opacity: f >= (T.ts1 + 0.3) * FPS ? 1 : 0}}>
        <div style={{margin: '0 22px', height: alt, background: '#FFFDF7', padding: '46px 30px 0', overflow: 'hidden', filter: 'url(#rasgo)'}}>{linhas(18)}</div>
        <div style={{position: 'absolute', left: 0, top: -18, width: 400, height: 50, borderRadius: 25, background: '#E9DDC2'}} />
        <div style={{position: 'absolute', left: 0, top: alt - 26, width: 400, height: 50, borderRadius: 25, background: '#E9DDC2'}} />
      </div>
      {([[T.longo, 60, 760], [T.longo + 0.2, 470, 640], [T.confuso, 440, 1060]] as [number, number, number][]).map(([t, x, y], i) => (
        <Peca key={i} t={t} x={x} y={y} w={84} h={84} cor={VERMELHO} raio="50%" seed={40 + i} giro={i * 9 - 8}><div style={{width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 56, color: '#fff'}}>?</div></Peca>
      ))}
      {/* bilhete curto e claro */}
      <div style={{position: 'absolute', left: 620, top: 800, transform: `scale(${pulo})`}}>
        <Peca t={T.ts1 + 0.6} x={0} y={0} w={340} h={320} cor="#F6D86B" raio={10} giro={4} seed={23} de="dir">
          <div style={{padding: '40px 34px'}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: NAVY, letterSpacing: -1}}>curto<br />e claro</div>
            <div style={{marginTop: 26}}>{linhas(2, 'rgba(11,31,58,.3)', [86, 58])}</div>
          </div>
        </Peca>
        <Peca t={T.vence} x={236} y={-66} w={150} h={150} cor={OURO} raio="50%" giro={10} seed={25}>
          <div style={{width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 84, color: NAVY}}>1º</div>
        </Peca>
      </div>
      <Carimbo t={T.tv1} x={150} y={850} mito giro={-11} />
      <Fala t={T.curto - 0.3} x={470} y={1392} w={550}>Curto e claro vence longo e confuso.</Fala>
      <Boneco x={36} y={1372} w={400} />
    </AbsoluteFill>
  );
};

// ---- 2 · relatório com número disfarçado ----
const Mundo2: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.m2 as Janela)) return null;
  const lupa = interpolate(passo(f), [T.fonte * FPS, T.fonte * FPS + 12], [0, 1], {...clamp, easing: mola});
  return (
    <AbsoluteFill>
      <Fundo cor="#F3D6CF" />
      <Topo n={2} />
      <Frase t={T.ts2 - 0.1} n={2}>A IA pode inventar um dado com cara de verdade.</Frase>
      <Peca t={T.ts2 + 0.35} x={130} y={610} w={820} h={640} giro={-2} seed={51} raio={22}>
        <div style={{padding: '40px 46px'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: 'rgba(20,20,19,.5)'}}>RELATÓRIO · EXEMPLO</div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 330, marginTop: 40}}>
            {[150, 210, 180, 300].map((h, i) => <span key={i} style={{width: 62, height: h, borderRadius: 8, background: ['#8FB3E0', '#6E9BD6', '#8FB3E0', '#3E7BE0'][i], filter: 'url(#rasgo)'}} />)}
            <div style={{flex: 1, textAlign: 'center', position: 'relative'}}>
              <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 210, color: NAVY, letterSpacing: -8, lineHeight: 1}}>87%</div>
            </div>
          </div>
          <div style={{marginTop: 34}}>{linhas(3, 'rgba(20,20,19,.13)', [96, 82, 60])}</div>
        </div>
      </Peca>
      {/* o disfarce cai em cima do número */}
      <Peca t={T.cara - 0.05} x={570} y={815} w={290} h={150} cor="transparent" liso seed={53} giro={-3} style={{filter: SOMBRA}}>
        <svg width={290} height={150} viewBox="0 0 290 150">
          <circle cx={78} cy={52} r={40} fill="#FFFDF7" stroke={NAVY} strokeWidth={13} />
          <circle cx={212} cy={52} r={40} fill="#FFFDF7" stroke={NAVY} strokeWidth={13} />
          <rect x={116} y={44} width={58} height={13} fill={NAVY} />
          <path d="M 60 118 C 80 90, 125 96, 145 112 C 165 96, 210 90, 230 118 C 205 142, 165 132, 145 124 C 125 132, 85 142, 60 118 Z" fill="#6B4A2B" />
        </svg>
      </Peca>
      <Peca t={T.cara + 0.45} x={640} y={1010} cor={VERMELHO} raio={14} giro={5} seed={55} de="dir"><div style={{padding: '12px 24px', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#fff'}}>inventado</div></Peca>
      <Carimbo t={T.tv2} x={590} y={540} mito={false} giro={6} tam={76} />
      {/* lupa pedindo a fonte */}
      <div style={{position: 'absolute', left: 1100 - lupa * 610, top: 880, opacity: f >= T.fonte * FPS ? 1 : 0, transform: `rotate(${treme(f, 57, 1.2)}deg)`, filter: SOMBRA}}>
        <svg width={300} height={300} viewBox="0 0 300 300">
          <rect x={186} y={176} width={130} height={34} rx={17} transform="rotate(45 186 176)" fill="#B58B5A" />
          <circle cx={120} cy={120} r={96} fill="rgba(255,255,255,.55)" stroke={NAVY} strokeWidth={22} />
        </svg>
      </div>
      <Peca t={T.fonte + 0.15} x={150} y={1130} cor={OURO} raio={14} giro={-4} seed={58} de="esq"><div style={{padding: '14px 28px', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: NAVY}}>qual é a fonte?</div></Peca>
      <Fala t={T.fonte - 0.35} x={470} y={1392} w={550}>Peça a fonte e confira antes de usar.</Fala>
      <Boneco x={36} y={1372} w={400} />
    </AbsoluteFill>
  );
};

// ---- 3 · notebook: do código para o português ----
const CODIGO: [string, number, number, string, number][] = [['</>', 60, 50, '#F6D86B', -6], ['{ }', 330, 40, '#9AD0B5', 5], ['if (x) {', 520, 90, '#F3B6A6', -3], ['return y;', 90, 250, '#A9C7EE', 4], ['for (i=0…)', 400, 280, '#F6D86B', -5]];
const Mundo3: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.m3 as Janela)) return null;
  const some = cai(f, T.hoje - 0.1, 8);
  const gira = Math.floor(Math.max(0, f - T.auto * FPS) / 3) * 11;
  const dente = (x: number, y: number, r: number, cor: string, sentido: number, seed: number) => (
    <Peca t={T.auto - 0.05} x={x} y={y} w={r * 2} h={r * 2} cor="transparent" liso seed={seed} style={{filter: SOMBRA}}>
      <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200" style={{transform: `rotate(${gira * sentido}deg)`}}>
        {Array.from({length: 8}, (_, i) => <rect key={i} x={-17} y={-98} width={34} height={46} rx={6} fill={cor} transform={`rotate(${i * 45})`} />)}
        <circle r={70} fill={cor} /><circle r={24} fill={KRAFT} />
      </svg>
    </Peca>
  );
  return (
    <AbsoluteFill>
      <Fundo cor="#D5E6CF" />
      <Topo n={3} />
      <Frase t={T.ts3 - 0.1} n={3}>Precisa saber programar para automatizar tarefas.</Frase>
      {/* notebook */}
      <Peca t={T.ts3 + 0.35} x={84} y={1140} w={912} h={74} cor="#CFC6B4" raio="10px 10px 34px 34px" seed={61} de="baixo" />
      <Peca t={T.ts3 + 0.35} x={140} y={640} w={800} h={510} cor="#12284A" raio={30} seed={62} de="baixo">
        <div style={{position: 'relative', width: 800, height: 510}}>
          {CODIGO.map(([txt, x, y, cor, g], i) => {
            const p = cai(f, T.prog - 0.1 + i * 0.13, 7);
            return (
              <div key={txt} style={{position: 'absolute', left: x, top: y - some * 420, opacity: p * (1 - some), transform: `rotate(${g + some * (i % 2 ? 40 : -40) + treme(f, 70 + i, 0.8)}deg) scale(${0.6 + 0.4 * p})`,
                background: cor, borderRadius: 10, padding: '12px 22px', fontFamily: 'Menlo, monospace', fontWeight: 700, fontSize: 44, color: NAVY, boxShadow: '0 8px 0 rgba(0,0,0,.18)'}}>{txt}</div>
            );
          })}
        </div>
      </Peca>
      {dente(820, 540, 96, '#E8833A', 1, 64)}
      {dente(700, 500, 64, OURO, -1, 65)}
      <Carimbo t={T.tv3} x={150} y={930} mito giro={-8} tam={96} />
      {/* o pedido em português */}
      <Peca t={T.hoje + 0.15} x={190} y={700} w={700} cor="#FFFFFF" raio={34} giro={-1.5} seed={66} de="baixo">
        <div style={{padding: '34px 40px', fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.16, letterSpacing: -1, color: NAVY}}>Todo dia às 8h, me manda o resumo das vendas.</div>
      </Peca>
      <Peca t={T.port - 0.05} x={520} y={648} cor={OURO} raio={14} giro={5} seed={67} de="dir"><div style={{padding: '12px 24px', fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY}}>em português claro</div></Peca>
      <Peca t={T.faz - 0.05} x={640} y={990} cor={VERDE} raio={18} giro={-5} seed={68} de="baixo"><div style={{padding: '16px 34px', fontFamily: SANS, fontWeight: 700, fontSize: 60, color: '#fff'}}>feito ✓</div></Peca>
      <Fala t={T.hoje - 0.3} x={470} y={1392} w={550}>Você explica em português. A IA faz.</Fala>
      <Boneco x={36} y={1372} w={400} />
    </AbsoluteFill>
  );
};

// ---- fecho ----
const FechoPapel: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.fecho as Janela)) return null;
  const t0 = C.fecho[0];
  const txt = 'A número 2!';
  const n = Math.round(interpolate(f, [(T.deixa + 0.1) * FPS, (T.deixa + 0.9) * FPS], [0, txt.length], clamp));
  const placar: [string, boolean][] = [['1 · mito', true], ['2 · verdade', false], ['3 · mito', true]];
  return (
    <AbsoluteFill>
      <Fundo cor="#EADFC8" />
      <Topo />
      <Peca t={t0 + 0.05} x={70} y={230} w={940} giro={-1.5} seed={81} raio={28}>
        <div style={{padding: '54px 40px', textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 108, lineHeight: 1.02, letterSpacing: -3, color: '#141413'}}>Qual você<br />não sabia?</div>
      </Peca>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, height: 90}}>
        {placar.map(([rot, mito], i) => (
          <Peca key={rot} t={T.qual + 0.3 + i * 0.12} x={96 + i * 300} y={0} cor={mito ? VERMELHO : VERDE} raio={16} giro={[-4, 3, -2][i]} seed={83 + i}>
            <div style={{padding: '16px 28px', fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#fff', whiteSpace: 'nowrap'}}>{rot}</div>
          </Peca>
        ))}
      </div>
      <Peca t={T.deixa - 0.2} x={110} y={770} w={860} cor="#FFFFFF" raio={36} giro={1} seed={87} de="baixo">
        <div style={{padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 22}}>
          <span style={{flex: 1, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: NAVY}}>{txt.slice(0, n)}<span style={{display: 'inline-block', width: 5, height: 52, background: NAVY, marginLeft: 4, verticalAlign: 'middle', opacity: f % 16 < 9 ? 1 : 0}} /></span>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: '#fff', background: NAVY, borderRadius: 999, padding: '14px 28px'}}>comentar</span>
        </div>
      </Peca>
      <Peca t={DURACAO - 0.2} x={300} y={960} cor={OURO} raio={16} giro={-3} seed={89}><div style={{padding: '14px 30px', fontFamily: SANS, fontWeight: 700, fontSize: 42, color: NAVY}}>@carlosguilherrme</div></Peca>
      <Boneco x={250} y={1110} w={580} />
    </AbsoluteFill>
  );
};

const SONS: [number, string, number][] = [
  [T.mito - 0.05, 'pop-ui-1', 0.2], [T.verdade - 0.05, 'pop-ui-1', 0.2], [T.ia - 0.05, 'whoosh-3', 0.1],
  [C.m1[0], 'whoosh-2', 0.13], [T.ts1 + 0.6, 'pop-ui-1', 0.13], [T.tv1, 'pop-ui-1', 0.24], [T.vence, 'certo-1', 0.18], [T.longo, 'pop-ui-1', 0.12], [T.confuso, 'pop-ui-1', 0.12],
  [C.m2[0], 'whoosh-2', 0.13], [T.cara - 0.05, 'pop-ui-1', 0.18], [T.tv2, 'certo-1', 0.22], [T.fonte, 'whoosh-3', 0.1], [T.fonte + 0.15, 'pop-ui-1', 0.14],
  [C.m3[0], 'whoosh-2', 0.13], [T.prog - 0.1, 'digitacao-2', 0.08], [T.auto - 0.05, 'pop-ui-1', 0.14], [T.tv3, 'pop-ui-1', 0.24], [T.hoje + 0.15, 'mensagem-1', 0.18], [T.faz - 0.05, 'certo-1', 0.22],
  [C.fecho[0], 'whoosh-2', 0.13], [T.deixa + 0.1, 'digitacao-2', 0.09], [DURACAO - 0.2, 'ding-3', 0.14],
];

export const PapelRecortado: React.FC<{boca?: boolean}> = ({boca = false}) => (
  <ComBoca.Provider value={boca}>
  <AbsoluteFill style={{background: KRAFT}}>
    <Filtros />
    <Abertura />
    <Mundo1 />
    <Mundo2 />
    <Mundo3 />
    <FechoPapel />
    <Grao />
    <Som pasta={PASTA} sons={SONS} duracao={DURACAO} total={TOTAL} />
  </AbsoluteFill>
  </ComBoca.Provider>
);
