import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp, criaQ, FPS, Som} from '../../_shared/conversa';
import {Bloco, CenaNeon, certoN, circulo, moldura, NEON, Neon, Parede, pessoaN, relogioN, setaBaixoN, Tubo, xisN} from '../../_shared/neon';
import {DURACAO, PALAVRAS} from './dados-fonte';

// 028. semana-neon — "Claude, organiza minha semana" refeito em desenho que brilha, 1080x1920.
// Estilo novo do catálogo (neon em parede escura) com a MESMA narração do 016 (semana-claude).
// Conteúdo igual ao do 016: três passos (mostrar a semana, agrupar reuniões e abrir foco, tirar coisa da mesa).
// Grade da semana e blocos são ilustração.

const PASTA = 'neon';
const p = criaQ(PALAVRAS);
const T = {
  calmas: PALAVRAS.slice(0, 4).map((w) => w.s), agenda: p('agenda'), pede: p('pede'), tres: p('tres'),
  primeiro: p('primeiro'), semana: p('semana'), cola: p('cola'), ou: p('ou', 7), conecta: p('conecta'), facil: p('facil'), google: p('google'), olhar: p('olhar'),
  segundo: p('segundo'), agrupar: p('agrupar'), aquela: p('aquela'), mata: p('mata'), mail: p('mail'), fazer: p('fazer', 20), foco: p('foco'),
  terceiro: p('terceiro'), tirar: p('tirar'), outra: p('outra'), proprio: p('proprio'),
  final: p('no', 28), sobra: p('sobra'), ditado: p('ditado'), trabalha: p('trabalha'), liso: p('liso'), desorg: p('desorganizado'), dois: p('dois'),
  sexta: p('sexta'), nenhum: p('nenhum'), ajeitou: p('ajeitou'), foco2: p('foco', 37), entao: p('entao', 38), testa: p('testa'), conta: p('conta', 39), valeu: p('valeu'),
};
export const TOTAL = Math.round((DURACAO + 1.6) * FPS);
const FIM = DURACAO + 1.6;
const q = (seg: number) => Math.round(seg * FPS);
const X = 100;

// mostra os filhos só entre dois instantes
const Entre: React.FC<{de: number; ate: number; children: React.ReactNode}> = ({de, ate, children}) => {
  const f = useCurrentFrame();
  return f >= q(de) && f < q(ate) ? <>{children}</> : null;
};

// número do passo num círculo + título em duas linhas
const Passo: React.FC<{n: string; t: number; l1: string; l2: string; t2: number; cor: string}> = ({n, t, l1, l2, t2, cor}) => (
  <>
    <Tubo t={t} dur={0.35} x={X} y={200} w={190} h={190} d={circulo(190, 190)} cor={NEON.amarelo} larg={10} />
    <Neon t={t + 0.1} x={X} y={218} w={190} tam={140} cor={NEON.amarelo} alinhar="center">{n}</Neon>
    <Neon t={t + 0.25} x={340} y={196} tam={98} cor={cor}>{l1}</Neon>
    <Neon t={t2} x={340} y={302} tam={98} cor={cor}>{l2}</Neon>
  </>
);

// grade da semana (cinco colunas)
const COL = (c: number) => 96 + c * 180;
const LIN = (r: number) => 640 + r * 104;
const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
// reuniões: [coluna, linha] espalhadas -> agrupadas
const REUNIOES: [number, number, number, number][] = [
  [0, 0, 1, 0],
  [1, 3, 1, 1],
  [2, 1, 1, 2],
  [3, 4, 3, 0],
  [4, 2, 3, 1],
];

const Agrupar: React.FC = () => {
  const f = useCurrentFrame();
  const anda = interpolate(f, [q(T.fazer), q(T.fazer + 0.9)], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
  return (
    <>
      <Tubo t={T.aquela - 0.35} dur={0.6} x={66} y={540} w={948} h={660} d={moldura(948, 660, 40)} cor={NEON.ciano} larg={7} fraco />
      {DIAS.map((d, i) => <Neon key={d} t={T.aquela - 0.3 + i * 0.05} x={COL(i)} y={566} w={168} tam={44} cor={NEON.ciano} alinhar="center" fraco>{d}</Neon>)}
      {REUNIOES.map(([c0, r0, c1, r1], i) => (
        <Bloco key={i} t={T.aquela + i * 0.1} x={COL(c0) + (COL(c1) - COL(c0)) * anda + 6} y={LIN(r0) + (LIN(r1) - LIN(r0)) * anda} w={156} h={88} cor={NEON.rosa} tam={32}>reunião</Bloco>
      ))}
      {/* a reunião que podia ser um e-mail */}
      <Entre de={T.aquela + 0.5} ate={T.mail - 0.1}><Bloco t={T.aquela + 0.5} x={COL(2) + 6} y={LIN(4)} w={156} h={88} cor={NEON.rosa} tam={32}>reunião</Bloco></Entre>
      <Entre de={T.mail - 0.1} ate={T.fazer + 0.35}><Bloco t={T.mail - 0.1} x={COL(2) + 6} y={LIN(4)} w={156} h={88} cor={NEON.amarelo} cheio tam={34}>e-mail</Bloco></Entre>
      {/* horários de foco */}
      {[0, 2, 4].map((c, i) => <Bloco key={c} t={T.foco - 0.15 + i * 0.12} x={COL(c) + 6} y={LIN(0)} w={156} h={296} cor={NEON.verde} cheio tam={44}>foco</Bloco>)}
      <Entre de={T.aquela} ate={T.mail - 0.1}><Neon t={T.aquela + 0.2} x={X} y={1284} tam={66} cor={NEON.rosa}>reunião espalhada mata o dia</Neon></Entre>
      <Entre de={T.mail - 0.1} ate={T.fazer - 0.1}><Neon t={T.mail - 0.1} x={X} y={1280} tam={74} cor={NEON.amarelo}>essa podia ser um e-mail</Neon></Entre>
      <Entre de={T.fazer - 0.1} ate={T.foco - 0.2}><Neon t={T.fazer - 0.1} x={X} y={1280} tam={74} cor={NEON.ciano}>o Claude junta as reuniões</Neon></Entre>
      <Entre de={T.foco - 0.2} ate={FIM}><Neon t={T.foco - 0.2} x={X} y={1280} tam={74} cor={NEON.verde}>e abre horário de foco</Neon></Entre>
    </>
  );
};

export const SemanaNeon: React.FC = () => (
  <AbsoluteFill>
    <Parede />

    {/* 1a · calma, calma */}
    <CenaNeon ini={0} fim={T.agenda - 0.25}>
      <Neon t={T.calmas[0]} x={110} y={330} tam={150} cor={NEON.ciano} giro={-4}>calma,</Neon>
      <Neon t={T.calmas[1]} x={330} y={560} tam={170} cor={NEON.rosa} giro={3}>calma,</Neon>
      <Neon t={T.calmas[2]} x={140} y={800} tam={190} cor={NEON.amarelo} giro={-2}>calma,</Neon>
      <Neon t={T.calmas[3]} x={250} y={1060} tam={230} cor={NEON.verde} giro={4}>calma.</Neon>
    </CenaNeon>

    {/* 1b · agenda um caos? */}
    <CenaNeon ini={T.agenda - 0.25} fim={T.primeiro - 0.1}>
      <Neon t={T.agenda - 0.2} x={X} y={250} tam={110} cor={NEON.rosa}>Agenda um caos?</Neon>
      <Tubo t={T.agenda} dur={0.5} x={170} y={450} w={740} h={520} d={moldura(740, 520, 40)} cor={NEON.ciano} larg={8} fraco />
      {[
        [200, 480, 190, 80, NEON.rosa], [520, 500, 230, 80, NEON.amarelo], [260, 600, 150, 80, NEON.laranja], [470, 640, 260, 80, NEON.rosa],
        [210, 730, 240, 80, NEON.amarelo], [640, 760, 220, 80, NEON.laranja], [330, 850, 300, 80, NEON.rosa],
      ].map(([x, y, w, h, cor], i) => <Bloco key={i} t={T.agenda + 0.15 + i * 0.07} x={x as number} y={y as number} w={w as number} h={h as number} cor={cor as string} />)}
      <Neon t={T.pede} x={X} y={1060} tam={128} cor={NEON.ciano}>Pede pro Claude</Neon>
      <Neon t={T.tres - 0.15} x={X} y={1260} tam={96} cor={NEON.amarelo}>em 3 passos</Neon>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Tubo t={T.tres + i * 0.1} dur={0.25} x={640 + i * 126} y={1250} w={112} h={112} d={circulo(112, 112)} cor={NEON.amarelo} larg={7} />
          <Neon t={T.tres + 0.05 + i * 0.1} x={640 + i * 126} y={1266} w={112} tam={76} cor={NEON.amarelo} alinhar="center">{String(i + 1)}</Neon>
        </React.Fragment>
      ))}
    </CenaNeon>

    {/* 2 · passo 1: mostra a semana */}
    <CenaNeon ini={T.primeiro - 0.1} fim={T.segundo - 0.1}>
      <Passo n="1" t={T.primeiro - 0.05} l1="Mostra a" l2="semana inteira" t2={T.semana - 0.1} cor={NEON.ciano} />
      <Bloco t={T.cola} x={X} y={560} w={880} h={170} cor={NEON.rosa} tam={66}>colar os compromissos</Bloco>
      <Neon t={T.ou} x={0} y={752} w={1080} tam={70} cor={NEON.branco} alinhar="center" fraco>ou</Neon>
      <Bloco t={T.conecta} x={X} y={860} w={880} h={170} cor={NEON.verde} cheio tam={66}>conectar a agenda</Bloco>
      <Neon t={T.facil - 0.15} x={640} y={1046} tam={64} cor={NEON.verde} giro={-4}>mais fácil</Neon>
      <Neon t={T.google - 0.15} x={X} y={1190} tam={72} cor={NEON.amarelo}>eu uso o Google Agenda</Neon>
      <Neon t={T.olhar - 0.3} x={X} y={1340} tam={100} cor={NEON.rosa}>olha tudo de uma vez</Neon>
    </CenaNeon>

    {/* 3 · passo 2: agrupar */}
    <CenaNeon ini={T.segundo - 0.1} fim={T.terceiro - 0.1}>
      <Passo n="2" t={T.segundo - 0.05} l1="Pede pra" l2="agrupar" t2={T.agrupar - 0.1} cor={NEON.rosa} />
      <Agrupar />
    </CenaNeon>

    {/* 4 · passo 3: tirar da mesa */}
    <CenaNeon ini={T.terceiro - 0.1} fim={T.final - 0.1}>
      <Passo n="3" t={T.terceiro - 0.05} l1="Tira coisa" l2="da sua mesa" t2={T.tirar - 0.2} cor={NEON.verde} />
      <Tubo t={T.tirar} dur={0.3} x={X + 10} y={620} w={110} h={110} d={xisN(110, 110)} cor={NEON.rosa} larg={11} />
      <Neon t={T.tirar + 0.1} x={270} y={622} tam={84} cor={NEON.rosa}>o que dá pra tirar</Neon>
      <Tubo t={T.outra} dur={0.4} x={X + 6} y={860} w={120} h={140} d={pessoaN} cor={NEON.ciano} larg={10} />
      <Neon t={T.outra + 0.1} x={270} y={860} w={740} tam={84} cor={NEON.ciano}>o que outra pessoa faz</Neon>
      <Tubo t={T.proprio} dur={0.3} x={X + 6} y={1150} w={120} h={110} d={certoN(120, 110)} cor={NEON.verde} larg={12} />
      <Neon t={T.proprio + 0.1} x={270} y={1124} w={740} tam={84} cor={NEON.verde}>o que o Claude já deixa pronto</Neon>
    </CenaNeon>

    {/* 5a · sobra tempo, o ditado */}
    <CenaNeon ini={T.final - 0.1} fim={T.sexta - 0.15}>
      <Tubo t={T.sobra - 0.3} dur={0.5} x={X} y={215} w={180} h={180} d={relogioN} cor={NEON.amarelo} larg={10} />
      <Neon t={T.sobra - 0.1} x={320} y={236} tam={124} cor={NEON.amarelo}>Sobra tempo</Neon>
      <Neon t={T.ditado - 0.1} x={X} y={560} tam={64} cor={NEON.branco} fraco>diz o ditado:</Neon>
      <Neon t={T.trabalha - 0.3} x={X} y={670} w={900} tam={92} cor={NEON.ciano}>quem trabalha depois do meio-dia é...</Neon>
      <Neon t={T.liso} x={X} y={990} tam={160} cor={NEON.rosa}>liso</Neon>
      <Neon t={T.liso + 0.12} x={430} y={1050} tam={80} cor={NEON.branco} fraco>ou</Neon>
      <Neon t={T.desorg} x={X} y={1200} tam={118} cor={NEON.laranja}>desorganizado</Neon>
      <Neon t={T.dois - 0.5} x={X} y={1400} tam={78} cor={NEON.amarelo}>(às vezes os dois)</Neon>
    </CenaNeon>

    {/* 5b · sexta à tarde livre */}
    <CenaNeon ini={T.sexta - 0.15} fim={T.entao - 0.1}>
      <Neon t={T.sexta - 0.1} x={X} y={250} tam={116} cor={NEON.ciano}>Sexta à tarde:</Neon>
      <Tubo t={T.nenhum - 0.35} dur={0.5} x={130} y={520} w={820} h={430} d={moldura(820, 430, 50)} cor={NEON.verde} larg={14} />
      <Neon t={T.nenhum} x={130} y={590} w={820} tam={270} cor={NEON.verde} alinhar="center">LIVRE</Neon>
      <Neon t={T.ajeitou} x={X} y={1080} tam={84} cor={NEON.branco}>agenda ajeitada</Neon>
      <Neon t={T.foco2 - 0.3} x={X} y={1220} w={900} tam={100} cor={NEON.amarelo}>foco onde realmente precisava</Neon>
    </CenaNeon>

    {/* 6 · chamada */}
    <CenaNeon ini={T.entao - 0.1} fim={FIM} ultima>
      <Neon t={T.testa - 0.25} x={X} y={300} tam={140} cor={NEON.ciano}>Testa essa</Neon>
      <Neon t={T.testa} x={X} y={460} tam={140} cor={NEON.ciano}>semana</Neon>
      <Neon t={T.conta - 0.15} x={X} y={720} w={900} tam={104} cor={NEON.rosa}>e me conta se funcionou</Neon>
      <Tubo t={T.conta + 0.2} dur={0.35} x={490} y={1010} w={100} h={250} d={setaBaixoN(100, 250)} cor={NEON.rosa} larg={12} />
      <Neon t={T.valeu} x={X} y={1320} tam={150} cor={NEON.amarelo}>Valeu!</Neon>
      <Neon t={T.valeu + 0.3} x={X} y={1510} tam={60} cor={NEON.branco} fraco>@carlosguilherrme</Neon>
    </CenaNeon>

    <Som pasta={PASTA} sons={[]} duracao={DURACAO} total={TOTAL} />
  </AbsoluteFill>
);
