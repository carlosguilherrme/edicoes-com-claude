import React from 'react';
import {AbsoluteFill} from 'remotion';
import {criaQ, FPS, Som} from '../../_shared/conversa';
import {caixa, CenaQuadro, certo, FiltrosQuadro, GIZ, Giz, laco, notebook, oval, pasta, Quadro, Risco, setaBaixo, setaCima, setaDir, sublinha} from '../../_shared/quadro';
import {DURACAO, PALAVRAS} from './dados-fonte';

// 027. skill-quadro — "Como criar uma skill" refeito em quadro-negro, 1080x1920.
// Teste de estilo novo do catálogo (quadro-negro + rabisco tremido) com a MESMA narração do 021 (criar-skill).
// Fatos iguais aos do 021: ligar "criar e editar arquivos" nas configurações; Personalizar > Skills;
// "+" > Criar skill > Enviar uma skill; o arquivo é uma pasta compactada com nome, quando usar e passo a passo.

const PASTA = 'quadro-negro';
const p = criaQ(PALAVRAS);
const T = {
  como: p('como'), senta: p('senta'), abre: p('abre'), cima: p('vamos', 3.5), entao: p('entao'), repete: p('voce', 4.8), mesma: p('mesma'),
  proposta: p('proposta'), resumo: p('resum'), relatorio: p('relatorio'), oquefor: p('for', 8.3),
  existe: p('existe'), guarda: p('guarda'), jeito: p('jeito'), chama: p('chama'), skill: p('skill', 13), habilidade: p('habilidade'), mostro: p('mostro'), tres: p('tres'),
  p1: p('passo', 17), config: p('configuracoes'), liga: p('liga'), arquivos: p('arquivos'), sem: p('sem', 20),
  p2: p('passo', 21.5), personalizar: p('personalizar'), skills: p('skills'),
  p3: p('passo', 24), mais: p('mais'), criar: p('criar', 25.5), envia: p('envia'), sobe: p('sobe'),
  esse: p('esse'), pasta: p('pasta'), instr: p('instrucoes'), nome: p('nome'), quando: p('quando'), pap: p('passo', 33),
  nao: p('nao', 34), pede: p('pede'), monta: p('monta', 36.5), pronto: p('pronto'), viu: p('viu'), taPronto: p('pronto', 41.5),
  proxima: p('proxima'), reconhece: p('reconhece'), ja: p('ja', 44), agora: p('agora'), qual: p('qual'), deixa: p('deixa'),
};
export const TOTAL = Math.round((DURACAO + 1.6) * FPS);
const FIM = DURACAO + 1.6;
const X = 110; // margem esquerda do texto

// número do passo dentro de um círculo
const Passo: React.FC<{n: string; t: number}> = ({n, t}) => (
  <>
    <Risco t={t} x={X} y={210} w={210} h={210} d={oval(210, 210)} cor={GIZ.amarelo} larg={11} />
    <Giz t={t + 0.1} x={X} y={212} w={210} tam={170} cor={GIZ.amarelo} alinhar="center">{n}</Giz>
    <Giz t={t + 0.15} x={370} y={262} tam={118}>{`Passo ${n}`}</Giz>
  </>
);

export const SkillQuadro: React.FC = () => (
  <AbsoluteFill>
    <FiltrosQuadro />
    <Quadro />

    {/* 1 · abertura */}
    <CenaQuadro ini={0} fim={T.entao - 0.05}>
      <Giz t={0.05} x={X} y={210} tam={66} cor={GIZ.amarelo} mao>aula de hoje</Giz>
      <Risco t={0.3} x={X} y={290} w={330} h={24} d={sublinha(330)} cor={GIZ.amarelo} larg={6} />
      <Giz t={T.como - 0.1} x={X} y={360} tam={150}>Como criar</Giz>
      <Giz t={1.15} x={X} y={540} tam={150}>uma</Giz>
      <Giz t={1.35} x={380} y={470} tam={270} cor={GIZ.amarelo}>skill?</Giz>
      <Risco t={1.75} x={380} y={760} w={600} h={26} d={sublinha(600)} cor={GIZ.amarelo} larg={10} />
      <Giz t={T.senta} x={X} y={900} tam={88} mao>senta na cadeira,</Giz>
      <Giz t={T.abre} x={X} y={1010} tam={88} mao>abre o computador</Giz>
      <Risco t={T.abre + 0.15} dur={0.5} x={600} y={1130} w={360} h={236} d={notebook} cor={GIZ.azul} />
      <Giz t={T.cima - 0.1} dur={0.25} x={X} y={1420} tam={120} cor={GIZ.rosa}>e vamos pra cima!</Giz>
    </CenaQuadro>

    {/* 2 · o problema */}
    <CenaQuadro ini={T.entao - 0.05} fim={T.existe - 0.08}>
      <Giz t={T.entao} x={X} y={210} tam={66} cor={GIZ.amarelo} mao>o problema</Giz>
      <Giz t={T.repete} x={X} y={330} tam={128}>Toda semana,</Giz>
      <Giz t={T.mesma} x={X} y={480} tam={128}>a mesma tarefa</Giz>
      <Risco t={T.mesma + 0.3} dur={0.5} x={800} y={250} w={190} h={190} d={laco(190, 190)} cor={GIZ.rosa} larg={10} />
      {[
        {t: T.proposta, y: 760, txt: 'proposta'},
        {t: T.resumo, y: 910, txt: 'resumo de reunião'},
        {t: T.relatorio, y: 1060, txt: 'relatório'},
      ].map((it) => (
        <React.Fragment key={it.txt}>
          <Risco t={it.t - 0.1} dur={0.25} x={X + 10} y={it.y + 22} w={70} h={70} d={caixa(70, 70, 14)} larg={7} />
          <Giz t={it.t} x={X + 120} y={it.y} tam={104} mao>{it.txt}</Giz>
        </React.Fragment>
      ))}
      <Giz t={T.oquefor - 0.25} dur={0.2} x={X + 120} y={1210} tam={104} cor={GIZ.azul} mao>o que for...</Giz>
    </CenaQuadro>

    {/* 3 · a solução */}
    <CenaQuadro ini={T.existe - 0.08} fim={T.p1 - 0.08}>
      <Giz t={T.existe} x={X} y={210} tam={66} cor={GIZ.amarelo} mao>a solução</Giz>
      <Giz t={T.existe + 0.2} x={X} y={320} tam={112}>O Claude guarda</Giz>
      <Giz t={T.guarda + 0.5} x={X} y={450} tam={112}>o seu jeito de fazer</Giz>
      <Risco t={T.guarda} dur={0.6} x={220} y={650} w={640} h={250} d={caixa(640, 250)} larg={10} />
      <Giz t={T.jeito - 0.5} x={220} y={712} w={640} tam={112} cor={GIZ.amarelo} alinhar="center">do seu jeito</Giz>
      <Giz t={T.skill - 0.1} x={X} y={980} tam={200} cor={GIZ.amarelo}>skill</Giz>
      <Giz t={T.skill + 0.5} x={470} y={1050} tam={120}>=</Giz>
      <Giz t={T.habilidade} x={560} y={1062} tam={104}>habilidade</Giz>
      <Giz t={T.mostro} x={X} y={1280} tam={88} cor={GIZ.azul} mao>em 3 passos:</Giz>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Risco t={T.tres - 0.25 + i * 0.14} dur={0.3} x={560 + i * 150} y={1260} w={130} h={130} d={oval(130, 130)} cor={GIZ.azul} larg={8} />
          <Giz t={T.tres - 0.2 + i * 0.14} x={560 + i * 150} y={1266} w={130} tam={104} cor={GIZ.azul} alinhar="center">{String(i + 1)}</Giz>
        </React.Fragment>
      ))}
    </CenaQuadro>

    {/* 4 · passo 1 */}
    <CenaQuadro ini={T.p1 - 0.08} fim={T.p2 - 0.08}>
      <Passo n="1" t={T.p1 - 0.05} />
      <Giz t={T.config - 0.2} x={X} y={540} tam={136}>Configurações</Giz>
      <Risco t={T.config + 0.3} x={X} y={700} w={760} h={26} d={sublinha(760)} larg={9} />
      <Risco t={T.liga - 0.35} dur={0.35} x={X} y={850} w={270} h={136} d={caixa(270, 136, 66)} cor={GIZ.verde} larg={10} />
      <Risco t={T.liga} dur={0.3} x={X + 140} y={866} w={104} h={104} d={oval(104, 104)} cor={GIZ.verde} larg={22} />
      <Giz t={T.liga + 0.2} x={430} y={830} w={560} tam={92} mao>Criar e editar arquivos</Giz>
      <Risco t={T.sem + 0.35} dur={0.55} x={80} y={1150} w={920} h={290} d={caixa(920, 290)} cor={GIZ.rosa} larg={9} />
      <Giz t={T.sem} x={130} y={1190} w={820} tam={96} cor={GIZ.rosa} mao>sem isso, a skill não funciona!</Giz>
    </CenaQuadro>

    {/* 5 · passo 2 */}
    <CenaQuadro ini={T.p2 - 0.08} fim={T.p3 - 0.08}>
      <Passo n="2" t={T.p2 - 0.05} />
      <Risco t={T.personalizar - 0.25} dur={0.4} x={X} y={600} w={640} h={190} d={caixa(640, 190)} larg={10} />
      <Giz t={T.personalizar - 0.05} x={X} y={636} w={640} tam={112} alinhar="center">Personalizar</Giz>
      <Risco t={T.personalizar + 0.35} dur={0.3} x={390} y={820} w={80} h={180} d={setaBaixo(80, 180)} larg={10} />
      <Risco t={T.skills - 0.2} dur={0.4} x={X} y={1030} w={640} h={190} d={caixa(640, 190)} cor={GIZ.amarelo} larg={10} />
      <Giz t={T.skills} x={X} y={1066} w={640} tam={112} cor={GIZ.amarelo} alinhar="center">Skills</Giz>
    </CenaQuadro>

    {/* 6 · passo 3 */}
    <CenaQuadro ini={T.p3 - 0.08} fim={T.esse - 0.05}>
      <Passo n="3" t={T.p3 - 0.05} />
      <Risco t={T.mais - 0.2} dur={0.3} x={X} y={560} w={170} h={170} d={oval(170, 170)} larg={10} />
      <Giz t={T.mais} x={X} y={548} w={170} tam={170} alinhar="center">+</Giz>
      <Risco t={T.criar - 0.3} dur={0.25} x={310} y={605} w={130} h={80} d={setaDir(130, 80)} larg={10} />
      <Risco t={T.criar - 0.1} dur={0.4} x={470} y={555} w={500} h={180} d={caixa(500, 180)} cor={GIZ.amarelo} larg={10} />
      <Giz t={T.criar} x={470} y={590} w={500} tam={104} cor={GIZ.amarelo} alinhar="center">Criar skill</Giz>
      <Risco t={T.envia - 0.3} dur={0.25} x={680} y={760} w={80} h={150} d={setaBaixo(80, 150)} larg={10} />
      <Risco t={T.envia - 0.1} dur={0.4} x={300} y={935} w={670} h={180} d={caixa(670, 180)} larg={10} />
      <Giz t={T.envia} x={300} y={972} w={670} tam={100} alinhar="center">Enviar uma skill</Giz>
      <Risco t={T.sobe - 0.3} dur={0.2} x={150} y={1200} w={90} h={220} d={setaCima(90, 220)} cor={GIZ.verde} larg={12} />
      <Giz t={T.sobe - 0.15} dur={0.2} x={290} y={1260} tam={108} cor={GIZ.verde} mao>sobe o arquivo</Giz>
    </CenaQuadro>

    {/* 7 · o que tem no arquivo */}
    <CenaQuadro ini={T.esse - 0.05} fim={T.nao - 0.08}>
      <Giz t={T.esse} x={X} y={210} tam={66} cor={GIZ.amarelo} mao>o arquivo</Giz>
      <Risco t={T.esse + 0.2} dur={0.6} x={X} y={330} w={300} h={204} d={pasta} cor={GIZ.amarelo} larg={10} />
      <Giz t={T.pasta + 0.2} x={X + 70} y={400} tam={96} cor={GIZ.amarelo}>.zip</Giz>
      <Giz t={T.pasta} x={460} y={330} w={530} tam={84} mao>pasta compactada com o texto de instruções</Giz>
      <Giz t={T.instr + 0.5} x={X} y={700} tam={88} cor={GIZ.azul} mao>dentro dela:</Giz>
      {[
        {t: T.nome, y: 850, txt: 'nome'},
        {t: T.quando, y: 1010, txt: 'quando usar'},
        {t: T.pap, y: 1170, txt: 'passo a passo'},
      ].map((it) => (
        <React.Fragment key={it.txt}>
          <Risco t={it.t + 0.15} dur={0.25} x={X + 6} y={it.y + 26} w={84} h={76} d={certo(84, 76)} cor={GIZ.verde} larg={12} />
          <Giz t={it.t - 0.1} x={X + 130} y={it.y} tam={118}>{it.txt}</Giz>
        </React.Fragment>
      ))}
    </CenaQuadro>

    {/* 8 · pede pro Claude */}
    <CenaQuadro ini={T.nao - 0.08} fim={T.viu - 0.08}>
      <Giz t={T.nao} x={X} y={230} tam={128}>Não sabe montar?</Giz>
      <Giz t={T.pede} x={X} y={420} tam={128} cor={GIZ.amarelo}>Pede pro Claude.</Giz>
      <Risco t={T.pede + 0.5} x={X} y={575} w={760} h={26} d={sublinha(760)} cor={GIZ.amarelo} larg={9} />
      <Giz t={T.monta - 0.5} x={X} y={700} tam={70} cor={GIZ.azul} mao>seu pedido:</Giz>
      <Risco t={T.monta - 0.4} dur={0.7} x={80} y={800} w={920} h={600} d={caixa(920, 600, 46)} cor={GIZ.azul} larg={9} />
      <Giz t={T.monta} dur={T.pronto - T.monta - 0.1} x={140} y={850} w={800} tam={88} mao>Monta uma skill de proposta comercial com o meu jeito de escrever e me entrega o arquivo pronto.</Giz>
    </CenaQuadro>

    {/* 9 · pronto */}
    <CenaQuadro ini={T.viu - 0.08} fim={T.agora - 0.08}>
      <Risco t={T.viu} dur={0.35} x={X} y={250} w={250} h={210} d={certo(250, 210)} cor={GIZ.verde} larg={20} />
      <Giz t={T.taPronto - 0.1} x={410} y={270} tam={168} cor={GIZ.verde}>Tá pronto!</Giz>
      <Giz t={T.proxima} x={X} y={650} tam={88} cor={GIZ.azul} mao>na próxima vez:</Giz>
      <Giz t={T.reconhece - 0.2} x={X} y={790} w={860} tam={110}>ele reconhece o pedido sozinho</Giz>
      <Risco t={T.ja - 0.3} dur={0.25} x={180} y={1070} w={80} h={150} d={setaBaixo(80, 150)} larg={10} />
      <Giz t={T.ja - 0.05} dur={0.35} x={X} y={1250} tam={128} cor={GIZ.amarelo}>e já faz do seu jeito</Giz>
    </CenaQuadro>

    {/* 10 · chamada */}
    <CenaQuadro ini={T.agora - 0.08} fim={FIM} ultima>
      <Giz t={T.agora} x={X} y={250} tam={88} cor={GIZ.amarelo} mao>agora me conta:</Giz>
      <Giz t={T.qual} dur={2.2} x={X} y={390} w={880} tam={140}>Qual tarefa sua viraria uma skill?</Giz>
      <Giz t={T.deixa} x={X} y={1060} tam={120} cor={GIZ.rosa}>comenta aqui</Giz>
      <Risco t={T.deixa + 0.25} dur={0.35} x={760} y={1040} w={100} h={280} d={setaBaixo(100, 280)} cor={GIZ.rosa} larg={12} />
      <Giz t={T.deixa + 0.6} x={X} y={1380} tam={72} mao>@carlosguilherrme</Giz>
    </CenaQuadro>

    <Som pasta={PASTA} sons={[]} duracao={DURACAO} total={TOTAL} />
  </AbsoluteFill>
);
