import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {criaQ, FPS, Som} from '../../_shared/conversa';
import {Balao, CenaGibi, Estouro, FALA, GIBI, Haltere, Legenda, Letreiro, LETREIRO, PaginaGibi, Painel, pula, Raios, Texto} from '../../_shared/gibi';
import {DURACAO, PALAVRAS} from './dados-fonte';

// 029. modelos-gibi — "Qual modelo do Claude usar?" refeito em quadrinhos, 1080x1920.
// Estilo novo do catálogo (quadrinhos) com a MESMA narração do 015 (modelos-claude), analogia de treino.
// Fatos iguais aos do 015 (documentação dos modelos, 12/11/2026): Haiku mais rápido e barato; Sonnet equilibra
// velocidade e inteligência; Opus é o indicado para começar; Fable custa cerca do dobro do Opus; Mythos tem acesso limitado.
// Foto dele: recorte de projetos/_apresentador/carlos.png (uso autorizado por ele).

const PASTA = 'quadrinhos';
const FOTO = staticFile('_apresentador/carlos.png');
const w = criaQ(PALAVRAS);
const T = {
  qual: w('qual'), doClaude: w('do', 2.4), uso: w('uso'), senta: w('senta'), tito: w('tito'),
  seguinte: w('seguinte'), quem: w('quem'), ninguem1: w('ninguem'), campeonato: w('campeonato'), todo: w('todo', 10), forte: w('forte'),
  ninguem2: w('ninguem', 12), competicao: w('competicao'), aquec: w('aquecimento'), treinar: w('treinar'), comClaude: w('com', 15), mesmo: w('mesmo'), cada: w('cada'),
  vamos: w('vamos', 18), menu: w('menu'), seletor: w('seletor'), enviar: w('enviar'), cinco: w('cinco'),
  nomes: [w('haiku'), w('sonnet'), w('opus'), w('fable'), w('mythos')],
  hIni: w('haiku', 26), hTreino: w('aquecimento', 26), rapido: w('rapido'), barato: w('barato'), tarefa: w('tarefa', 28.5), separar: w('separar'), tirar: w('tirar'), classificar: w('classificar'), limite: w('nao', 34.5),
  sIni: w('sonnet', 36), sTreino: w('treino', 37), wod: w('crossfit'), equilibrio: w('equilibrio'), escrever: w('escrever'), resumir: w('resumir'), organizar: w('organizar'), maior: w('maior'),
  oIni: w('opus', 47), oTreino: w('treino', 48), longo: w('longo'), exige: w('exige'), relatorio: w('relatorio'), analise: w('analise'), projeto: w('projeto'), naoSabe: w('se', 55.8), indica: w('indica'), comeco: w('comeco'),
  fIni: w('fable', 62), fCamp: w('campeonato', 62), raciocinio: w('raciocinio'), agente: w('trabalho', 64), dobro: w('dobro'), especificas: w('so', 67.5), sobe: w('sobe', 69.5), combinado: w('combinado'),
  mIni: w('quinto'), mSel: w('selecao'), capaz: w('capaz'), acesso: w('acesso'), org: w('organizacoes'), maioria: w('maioria', 82),
  entao: w('entao', 84.5), pequena: w('pequena', 85), raikou: w('raikou'), dia: w('dia', 87.3), sonnet2: w('sonnet', 87.5), grande: w('trabalho', 88.2), opus2: w('opus', 89), soSobe: w('so', 89.5), fable2: w('fable', 90), fora: w('treino', 91.5),
  meConta: w('me', 94.5), hoje: w('hoje'), salve: w('salve'), mandar: w('mandar'),
};
export const TOTAL = Math.round((DURACAO + 1.6) * FPS);
const FIM = DURACAO + 1.6;
const MODELOS = [
  {nome: 'HAIKU', cor: GIBI.verde},
  {nome: 'SONNET', cor: GIBI.azul},
  {nome: 'OPUS', cor: GIBI.roxo},
  {nome: 'FABLE', cor: GIBI.laranja},
  {nome: 'MYTHOS', cor: GIBI.marinho},
];

// ele em recorte, com contorno preto de adesivo
const Ele: React.FC<{alt: number; x: number; baixo?: number}> = ({alt, x, baixo = 0}) => (
  <Img src={FOTO} style={{position: 'absolute', left: x, bottom: baixo, height: alt, filter: `contrast(1.12) saturate(1.2) drop-shadow(6px 0 0 ${GIBI.preto}) drop-shadow(-6px 0 0 ${GIBI.preto}) drop-shadow(0 -6px 0 ${GIBI.preto})`}} />
);

// painel pequeno com texto centralizado
const Mini: React.FC<{t: number; x: number; y: number; w: number; h: number; cor?: string; tam?: number; giro?: number; children: React.ReactNode}> = ({t, x, y, w: larg, h, cor = GIBI.branco, tam = 48, giro = 0, children}) => (
  <Painel t={t} x={x} y={y} w={larg} h={h} cor={cor} giro={giro}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 22px', fontFamily: FALA, fontWeight: 700, fontSize: tam, lineHeight: 1.08, color: cor === GIBI.marinho || cor === GIBI.roxo || cor === GIBI.azul ? '#fff' : GIBI.preto}}>{children}</div>
  </Painel>
);

// página de um modelo: cabeçalho colorido com o haltere, o treino, selos, frase, quadrinhos de exemplo
type Item = {t: number; txt: string};
const PaginaModelo: React.FC<{ini: number; nome: string; cor: string; pesos: number; treino: string; tTreino: number; tamTreino?: number; selos: (Item & {x: number; giro: number})[]; faixa?: Item; minis: Item[]; children?: React.ReactNode}> = ({ini, nome, cor, pesos, treino, tTreino, tamTreino = 118, selos, faixa, minis, children}) => (
  <>
    <Painel t={ini} x={50} y={150} w={980} h={300} cor={cor}>
      <Letreiro t={ini + 0.05} x={44} y={52} tam={nome.length > 5 ? 176 : 210}>{nome}</Letreiro>
      <Haltere x={650} y={68} n={pesos} />
    </Painel>
    <Letreiro t={tTreino - 0.15} x={60} y={492} tam={tamTreino} cor={GIBI.amarelo}>{`= ${treino}`}</Letreiro>
    {selos.map((s, i) => <Legenda key={i} t={s.t} x={s.x} y={668} tam={42} giro={s.giro} cor={i % 2 ? GIBI.branco : GIBI.amarelo}>{s.txt}</Legenda>)}
    {faixa ? <Mini t={faixa.t} x={50} y={810} w={980} h={140} tam={56}>{faixa.txt}</Mini> : null}
    {minis.length === 3
      ? minis.map((m, i) => <Mini key={i} t={m.t} x={50 + i * 337} y={1010} w={306} h={290} cor={i === 1 ? cor : GIBI.branco} giro={i === 1 ? 0 : i === 0 ? -1.5 : 1.5}>{m.txt}</Mini>)
      : minis.map((m, i) => <Mini key={i} t={m.t} x={50} y={1010 + i * 176} w={980} h={146} cor={i === 0 ? GIBI.branco : cor} tam={50}>{m.txt}</Mini>)}
    {children}
  </>
);

// linha do resumo: situação à esquerda, modelo à direita
const Linha: React.FC<{t: number; t2: number; y: number; txt: string; nome: string; cor: string}> = ({t, t2, y, txt, nome, cor}) => {
  const f = useCurrentFrame();
  const p = pula(f, t2);
  return (
    <Painel t={t} x={50} y={y} w={980} h={170}>
      <div style={{position: 'absolute', left: 30, top: 0, bottom: 0, width: 540, display: 'flex', alignItems: 'center', fontFamily: FALA, fontWeight: 700, fontSize: 50, lineHeight: 1.06, color: GIBI.preto}}>{txt}</div>
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 380, background: cor, borderLeft: `9px solid ${GIBI.preto}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scaleX(${p})`, transformOrigin: 'right center'}}>
        <span style={{fontFamily: LETREIRO, fontSize: 96, color: '#fff', WebkitTextStroke: `6px ${GIBI.preto}`, paintOrder: 'stroke fill', letterSpacing: '0.02em'}}>{nome}</span>
      </div>
    </Painel>
  );
};

export const ModelosGibi: React.FC = () => (
  <AbsoluteFill>
    <PaginaGibi />

    {/* 0 · gancho */}
    <CenaGibi ini={0} fim={T.seguinte - 0.35}>
      <Raios />
      <Painel t={0} x={50} y={150} w={980} h={720} cor={GIBI.amarelo}>
        <Texto t={0.1} x={44} y={40} tam={56}>você já se perguntou...</Texto>
        <Letreiro t={T.qual - 0.1} x={44} y={140} tam={168}>QUAL MODELO</Letreiro>
        <Letreiro t={T.doClaude - 0.1} x={44} y={320} tam={190} cor={GIBI.vermelho}>DO CLAUDE</Letreiro>
        <Letreiro t={T.uso - 0.1} x={44} y={530} tam={160} cor={GIBI.azul}>EU USO?</Letreiro>
      </Painel>
      <Estouro t={T.qual + 0.3} x={800} y={640} tam={260} cor={GIBI.vermelho} corTexto={GIBI.amarelo} fonte={130}>?!</Estouro>
      <Painel t={T.senta - 0.15} x={50} y={920} w={980} h={680} cor={GIBI.azul}>
        <Ele alt={640} x={-70} />
        <Balao t={T.senta} x={410} y={56} w={520} tam={60}>Senta na cadeira aí!</Balao>
        <Legenda t={T.tito - 0.1} x={430} y={420} w={500} tam={42}>que o titio Carlos Guilherme vai te ensinar</Legenda>
      </Painel>
    </CenaGibi>

    {/* 1 · quem treina sabe */}
    <CenaGibi ini={T.seguinte - 0.35} fim={T.vamos - 0.1}>
      <Legenda t={T.quem - 0.25} x={50} y={160} tam={60}>Quem treina sabe:</Legenda>
      <Painel t={T.ninguem1 - 0.1} x={50} y={310} w={980} h={410}>
        <Texto t={T.ninguem1} x={40} y={40} tam={68}>treino de campeonato</Texto>
        <Letreiro t={T.todo - 0.1} x={40} y={150} tam={160} cor={GIBI.laranja}>TODO DIA?</Letreiro>
      </Painel>
      <Estouro t={T.forte - 0.5} x={700} y={250} tam={340} cor={GIBI.vermelho} corTexto={GIBI.amarelo} fonte={110}>NÃO!</Estouro>
      <Painel t={T.ninguem2 - 0.1} x={50} y={790} w={980} h={410}>
        <Texto t={T.ninguem2} x={40} y={40} tam={68}>competição só com</Texto>
        <Letreiro t={T.aquec - 0.15} x={40} y={150} tam={120} cor={GIBI.verde}>AQUECIMENTO?</Letreiro>
      </Painel>
      <Estouro t={T.treinar - 0.25} x={610} y={1010} tam={430} fonte={68}>TEM QUE TREINAR!</Estouro>
      <Painel t={T.comClaude} x={50} y={1270} w={980} h={320} cor={GIBI.amarelo}>
        <Letreiro t={T.mesmo - 0.25} x={40} y={34} tam={100}>COM O CLAUDE É IGUAL</Letreiro>
        <Texto t={T.cada - 0.15} x={40} y={176} w={900} tam={62}>cada modelo é um tipo de treino</Texto>
      </Painel>
    </CenaGibi>

    {/* 2 · onde ficam e quais são */}
    <CenaGibi ini={T.vamos - 0.1} fim={T.hIni - 0.25}>
      <Legenda t={T.vamos} x={50} y={160} tam={56}>Onde eles ficam?</Legenda>
      <Painel t={T.menu - 0.3} x={50} y={290} w={980} h={420}>
        <div style={{position: 'absolute', left: 36, top: 56, width: 890, height: 150, border: `7px solid ${GIBI.preto}`, borderRadius: 40, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: FALA, fontWeight: 700, fontSize: 44, color: '#8a8a8a'}}>
          Como posso ajudar?
          <span style={{marginLeft: 'auto', background: GIBI.amarelo, color: GIBI.preto, border: `6px solid ${GIBI.preto}`, borderRadius: 999, padding: '10px 26px', fontSize: 42}}>Opus ▾</span>
          <span style={{marginLeft: 18, width: 84, height: 84, borderRadius: 999, background: GIBI.preto, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50}}>↑</span>
        </div>
        <Texto t={T.enviar - 0.6} x={40} y={244} w={600} tam={46}>no seletor de modelo, do lado do botão de enviar</Texto>
      </Painel>
      <Estouro t={T.seletor - 0.1} x={700} y={500} tam={310} giro={8} cor={GIBI.vermelho} corTexto={GIBI.amarelo} fonte={94}>AQUI!</Estouro>
      <Legenda t={T.cinco - 0.3} x={50} y={790} tam={56}>A Anthropic tem 5 modelos:</Legenda>
      {MODELOS.map((m, i) => (
        <Painel key={m.nome} t={T.nomes[i] - 0.1} x={50} y={930 + i * 134} w={980} h={112} cor={m.cor} giro={i % 2 ? 0.8 : -0.8}>
          <Letreiro t={T.nomes[i] - 0.1} x={0} y={8} w={962} tam={92} alinhar="center" giro={0}>{m.nome}</Letreiro>
        </Painel>
      ))}
    </CenaGibi>

    {/* 3 · Haiku */}
    <CenaGibi ini={T.hIni - 0.25} fim={T.sIni - 0.25}>
      <PaginaModelo ini={T.hIni - 0.2} nome="HAIKU" cor={GIBI.verde} pesos={1} treino="AQUECIMENTO" tTreino={T.hTreino}
        selos={[{t: T.rapido - 0.1, txt: 'mais rápido', x: 60, giro: -3}, {t: T.barato - 0.1, txt: 'mais barato', x: 520, giro: 3}]}
        faixa={{t: T.tarefa - 0.3, txt: 'pra tarefa pequena e repetitiva'}}
        minis={[{t: T.separar - 0.1, txt: 'separar mensagens'}, {t: T.tirar - 0.1, txt: 'tirar dados de uma lista'}, {t: T.classificar - 0.1, txt: 'classificar e-mail'}]}>
        <Balao t={T.limite - 0.3} x={50} y={1360} w={980} tam={54} rabo="nenhum">e quase não mexe no seu limite</Balao>
      </PaginaModelo>
    </CenaGibi>

    {/* 4 · Sonnet */}
    <CenaGibi ini={T.sIni - 0.25} fim={T.oIni - 0.3}>
      <PaginaModelo ini={T.sIni - 0.2} nome="SONNET" cor={GIBI.azul} pesos={2} treino="TREINO DO DIA" tTreino={T.sTreino} tamTreino={108}
        selos={[{t: T.wod - 0.1, txt: 'o WOD do CrossFit', x: 60, giro: -3}]}
        faixa={{t: T.equilibrio - 0.2, txt: 'velocidade + inteligência'}}
        minis={[{t: T.escrever - 0.1, txt: 'escrever um texto'}, {t: T.resumir - 0.1, txt: 'resumir um documento'}, {t: T.organizar - 0.1, txt: 'organizar uma planilha'}]}>
        <Balao t={T.maior - 0.2} x={50} y={1360} w={980} tam={54} rabo="nenhum">resolve a maior parte do dia a dia</Balao>
      </PaginaModelo>
    </CenaGibi>

    {/* 5 · Opus */}
    <CenaGibi ini={T.oIni - 0.3} fim={T.fIni - 0.3}>
      <PaginaModelo ini={T.oIni - 0.25} nome="OPUS" cor={GIBI.roxo} pesos={3} treino="TREINO PESADO" tTreino={T.oTreino} tamTreino={108}
        selos={[{t: T.longo - 0.3, txt: 'trabalho longo', x: 60, giro: -3}, {t: T.exige - 0.1, txt: 'exige conhecimento', x: 500, giro: 3}]}
        minis={[{t: T.relatorio - 0.2, txt: 'relatório completo'}, {t: T.analise - 0.1, txt: 'análise de vários arquivos'}, {t: T.projeto - 0.1, txt: 'projeto que roda sozinho'}]}>
        <Balao t={T.naoSabe} x={50} y={818} w={980} tam={52} rabo="nenhum">Não sabe por onde começar?</Balao>
        <Estouro t={T.indica - 0.2} x={200} y={1290} tam={680} fonte={72} giro={-4}>A ANTHROPIC INDICA: COMECE PELO OPUS</Estouro>
      </PaginaModelo>
    </CenaGibi>

    {/* 6 · Fable */}
    <CenaGibi ini={T.fIni - 0.3} fim={T.mIni - 0.6}>
      <PaginaModelo ini={T.fIni - 0.25} nome="FABLE" cor={GIBI.laranja} pesos={4} treino="CAMPEONATO" tTreino={T.fCamp}
        selos={[{t: T.raciocinio - 0.1, txt: 'raciocínio difícil', x: 60, giro: -3}, {t: T.agente - 0.1, txt: 'trabalho de agente', x: 500, giro: 3}]}
        faixa={{t: T.dobro - 0.7, txt: 'custa mais ou menos o dobro do Opus'}}
        minis={[{t: T.especificas - 0.3, txt: 'use só pra coisa específica'}, {t: T.sobe - 0.3, txt: 'suba pra ele quando o Opus não der conta'}]}>
        <Estouro t={T.dobro - 0.1} x={790} y={470} tam={250} cor={GIBI.vermelho} corTexto={GIBI.amarelo} fonte={112} giro={10}>2x</Estouro>
        <Balao t={T.combinado - 0.4} x={300} y={1400} w={480} tam={60} rabo="nenhum">Combinado?</Balao>
      </PaginaModelo>
    </CenaGibi>

    {/* 7 · Mythos */}
    <CenaGibi ini={T.mIni - 0.6} fim={T.entao - 0.1}>
      <PaginaModelo ini={T.mIni - 0.5} nome="MYTHOS" cor={GIBI.marinho} pesos={5} treino="A SELEÇÃO" tTreino={T.mSel}
        selos={[{t: T.capaz - 0.3, txt: 'o mais capaz de todos', x: 60, giro: -3}]}
        faixa={{t: T.acesso - 0.4, txt: 'só que o acesso é limitado'}}
        minis={[{t: T.org - 0.2, txt: 'só organizações verificadas pelos programas da Anthropic'}, {t: T.maioria - 0.1, txt: 'a maioria das pessoas nem precisa'}]}>
        <Estouro t={T.acesso} x={730} y={470} tam={300} cor={GIBI.amarelo} corTexto={GIBI.vermelho} fonte={64} giro={9}>RESTRITO</Estouro>
      </PaginaModelo>
    </CenaGibi>

    {/* 8 · resumo */}
    <CenaGibi ini={T.entao - 0.1} fim={T.meConta - 0.1}>
      <Letreiro t={T.entao} x={50} y={160} tam={112} cor={GIBI.amarelo}>ENTÃO ESCOLHE ASSIM:</Letreiro>
      <Linha t={T.pequena - 0.5} t2={T.raikou - 0.1} y={320} txt="tarefa pequena e repetitiva" nome="HAIKU" cor={GIBI.verde} />
      <Linha t={T.dia - 0.15} t2={T.sonnet2 - 0.1} y={515} txt="dia a dia" nome="SONNET" cor={GIBI.azul} />
      <Linha t={T.grande - 0.1} t2={T.opus2 - 0.1} y={710} txt="trabalho grande" nome="OPUS" cor={GIBI.roxo} />
      <Linha t={T.soSobe - 0.1} t2={T.fable2 - 0.1} y={905} txt="a resposta veio rasa?" nome="FABLE" cor={GIBI.laranja} />
      <Estouro t={T.fora - 0.1} x={190} y={1100} tam={700} fonte={60} giro={-3} cor={GIBI.vermelho} corTexto={GIBI.amarelo}>CAMPEONATO FORA DE HORA SÓ CANSA E CUSTA CARO</Estouro>
    </CenaGibi>

    {/* 9 · chamada */}
    <CenaGibi ini={T.meConta - 0.1} fim={FIM} ultima>
      <Painel t={T.meConta - 0.05} x={50} y={150} w={980} h={760} cor={GIBI.amarelo}>
        <Ele alt={700} x={-80} />
        <Balao t={T.hoje - 0.3} x={400} y={50} w={540} tam={56}>Hoje você tá treinando em qual modelo?</Balao>
        <Legenda t={T.meConta} x={430} y={560} w={480} tam={44} cor={GIBI.branco}>comenta aqui embaixo</Legenda>
      </Painel>
      <Estouro t={T.salve - 0.1} x={40} y={950} tam={620} fonte={92} cor={GIBI.vermelho} corTexto={GIBI.amarelo}>SALVA ESSE VÍDEO!</Estouro>
      <Legenda t={T.mandar - 0.1} x={560} y={1130} w={470} tam={44} giro={3}>e manda pra quem não sabe qual modelo usar</Legenda>
      <Texto t={T.mandar + 0.8} x={60} y={1490} tam={50}>@carlosguilherrme</Texto>
    </CenaGibi>

    <Som pasta={PASTA} sons={[]} duracao={DURACAO} total={TOTAL} />
  </AbsoluteFill>
);
