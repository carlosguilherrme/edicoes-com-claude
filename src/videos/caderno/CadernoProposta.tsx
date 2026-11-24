import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DURACAO, PALAVRAS} from './dados';
import {AMP} from './amp';
import {clamp, criaQ, dentro, FPS, Janela, mola, SANS, SERIF, Som, VERDE} from '../../_shared/conversa';
import {CANETA, certo, Escrita, FiltrosCaderno, Folha, MAO, Marca, MARCA, Pagina, Polaroid, rabisco, roda, seta, sublinha, Traco, VERMELHA, xis} from '../../_shared/caderno';

// 023. caderno-proposta — "Antes e depois do prompt nº 2: proposta comercial", 1080x1920,
// estilo caderno desenhado, narração dele (1,3x). Cada cena é uma página de cor diferente.
// A gravação começa no meio da frase; a abertura escreve "O mesmo pedido, 2 jeitos" para dar o contexto.
// Cliente, serviço, valor e prazo na tela são exemplo.

const PASTA = 'caderno';
const q = criaQ(PALAVRAS);
const segundo = q('segundo');
const olha = q('olha');
const foram = q('foram');
const formula = q('formula');
const quer = q('quer', formula);
const T = {
  vez: q('dessa'), proposta: q('proposta'), primeiro: q('primeiro'), faz: q('faz'), claude: q('claude'), bonito: q('bonito'), vazio: q('vazio'), prezado: q('prezado'),
  semValor: q('sem', 9.7), semPrazo: q('sem', 10.1), semNada: q('sem', 10.5), teria: q('teria'), denovo: q('novo', 12.5),
  segundo, quem: q('quem', segundo), precisa: q('precisa', segundo), conecto: q('conecto'), base: q('base'), servico: q('servico', segundo), valor: q('valor', segundo), prazo: q('prazo', segundo), pagamento: q('pagamento'),
  tom: q('tom', segundo), pagina: q('pagina'), duas: q('duas'), antiga: q('antiga'), exemplo: q('exemplo', segundo),
  olha, problema: q('problema'), escopo: q('escopo'), tabela: q('tabela'), prazo2: q('prazo', olha), passo: q('passo', olha), sexta: q('sexta'), leio: q('leio'), ajusto: q('ajusto'), mando: q('mando', olha),
  foram, dois: q('dois', foram), hora: q('hora', foram),
  formula, fQuem: q('quem', formula), fQuanto: q('quanto', formula), fTom: q('tom', formula), fEx: q('exemplo', formula), fServ: q('servico', formula), fPrazo: q('prazo', formula),
  quer, comenta: q('comenta'), palavra: q('proposta', q('comenta')), direct: q('direct'),
};
export const TOTAL = Math.round((DURACAO + 2.2) * FPS);
const C = {
  ab: [0, T.primeiro - 0.1], j1: [T.primeiro - 0.1, T.segundo - 0.1], j2: [T.segundo - 0.1, T.olha - 0.1], res: [T.olha - 0.1, T.foram - 0.1],
  conta: [T.foram - 0.1, T.formula - 0.16], form: [T.formula - 0.16, T.quer - 0.1], fecho: [T.quer - 0.1, TOTAL / FPS + 1],
} as const;
const FOTO = staticFile('_apresentador/carlos.png');
const PAG = {ab: '#FDFBF4', j1: '#FFF3F0', j2: '#F1FAF1', res: '#FDFBF4', conta: '#FFF9DC', form: '#EFF6FF', fecho: '#FDFBF4'};
const linha = (w: string, cor = 'rgba(11,31,58,.18)') => <span style={{display: 'block', height: 12, borderRadius: 6, width: w, background: cor, marginBottom: 20}} />;
const rotulo: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: 'rgba(11,31,58,.5)'};
const aviao = 'M 8 62 L 150 8 L 104 120 L 78 78 Z M 78 78 L 150 8';

const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.ab as Janela)) return null;
  return (
    <Pagina cor={PAG.ab}>
      <Escrita t={0.05} x={150} y={300} tam={120} dur={0.5}>O mesmo pedido,</Escrita>
      <Escrita t={0.55} x={150} y={430} tam={150} dur={0.4}>2 jeitos</Escrita>
      <Traco t={0.9} x={140} y={580} w={430} h={30} d={sublinha(430)} cor={VERMELHA} larg={9} />
      <Marca t={T.proposta - 0.05} x={140} y={730} w={820} h={120} cor={MARCA.amarelo} />
      <Escrita t={T.vez} x={160} y={728} tam={112} dur={0.5}>proposta comercial</Escrita>
      <Polaroid x={330} y={1010} w={420} src={FOTO} amp={AMP} legenda="Carlos" />
    </Pagina>
  );
};

const Jeito1: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.j1 as Janela)) return null;
  const falta = (t: number, y: number, txt: string) => (
    <>
      <Traco t={t} x={690} y={y + 8} w={56} h={56} d={xis(56)} cor={VERMELHA} larg={9} dur={0.2} />
      <Escrita t={t + 0.05} x={764} y={y - 8} tam={68} cor={VERMELHA} giro={-2}>{txt}</Escrita>
    </>
  );
  return (
    <Pagina cor={PAG.j1}>
      <Escrita t={C.j1[0] + 0.05} x={150} y={150} tam={104} dur={0.3}>1º jeito</Escrita>
      <Traco t={C.j1[0] + 0.3} x={120} y={128} w={400} h={170} d={roda(400, 170)} cor={VERMELHA} larg={8} dur={0.4} />
      <Folha t={T.faz - 0.4} x={150} y={370} w={820} h={250} fita={MARCA.rosa} giro={-1.5}><div style={{padding: '34px 40px', ...rotulo}}>MEU PEDIDO</div></Folha>
      <Escrita t={T.faz} x={196} y={470} w={760} tam={84} dur={1.0} giro={-1.5}>faz uma proposta para um cliente</Escrita>
      <Traco t={T.claude - 0.2} x={470} y={640} w={130} h={150} d={seta(130, 150)} larg={8} dur={0.3} />
      <Folha t={T.claude + 0.1} x={150} y={810} w={520} h={470} fita={MARCA.azul} giro={1.5}>
        <div style={{padding: '40px 36px'}}>
          <div style={{...rotulo, marginBottom: 20}}>RESPOSTA</div>
          <div style={{fontFamily: MAO, fontWeight: 700, fontSize: 64, color: CANETA, marginBottom: 20, opacity: f >= T.prezado * FPS ? 1 : 0.15}}>Prezado cliente,</div>
          {linha('92%')}{linha('80%')}{linha('96%')}{linha('64%')}{linha('86%')}
        </div>
      </Folha>
      <Marca t={T.bonito} x={190} y={1304} w={200} h={70} cor={MARCA.verde} />
      <Escrita t={T.bonito} x={200} y={1296} tam={72} dur={0.25}>bonito</Escrita>
      <Marca t={T.vazio} x={476} y={1304} w={180} h={70} cor={MARCA.rosa} />
      <Escrita t={T.vazio - 0.3} x={420} y={1296} tam={72} dur={0.3}>e  vazio</Escrita>
      {falta(T.semValor, 850, 'sem valor')}
      {falta(T.semPrazo, 960, 'sem prazo')}
      {falta(T.semNada, 1070, 'sem o meu')}
      <Escrita t={T.semNada + 0.3} x={764} y={1130} tam={68} cor={VERMELHA} giro={-2}>serviço</Escrita>
      <Traco t={T.teria} x={180} y={900} w={460} h={340} d={rabisco(460, 340)} cor={VERMELHA} larg={10} dur={0.7} />
      <Polaroid x={90} y={1420} w={300} src={FOTO} amp={AMP} legenda="eu" fundo={MARCA.amarelo} fita={MARCA.verde} />
      <Escrita t={T.teria + 0.1} x={440} y={1480} w={560} tam={76} giro={-2} dur={0.9}>eu teria que escrever quase tudo de novo</Escrita>
      <Traco t={T.denovo} x={440} y={1650} w={420} h={30} d={sublinha(420)} cor={VERMELHA} larg={8} />
    </Pagina>
  );
};

const ITENS: [number, string, string | null][] = [
  [T.quem, 'Cliente: Padaria Central', null], [T.precisa, 'Precisa: organizar as vendas', null], [T.servico, 'Serviço: planilha + treinamento', null],
  [T.valor, 'Valor: R$ 4.800,00', MARCA.amarelo], [T.prazo, 'Prazo: 15 dias', MARCA.verde], [T.pagamento, 'Pagamento: 2x no Pix', null],
  [T.tom, 'Tom: profissional e direto', MARCA.rosa], [T.pagina, 'Tamanho: 1 página', MARCA.azul],
];
const Jeito2: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.j2 as Janela)) return null;
  return (
    <Pagina cor={PAG.j2}>
      <Escrita t={C.j2[0] + 0.05} x={150} y={130} tam={104} dur={0.3}>2º jeito</Escrita>
      <Traco t={C.j2[0] + 0.3} x={120} y={108} w={400} h={170} d={roda(400, 170)} cor={VERDE} larg={8} dur={0.4} />
      <Folha t={C.j2[0] + 0.3} x={140} y={320} w={840} h={880} fita={MARCA.verde} giro={-0.8}><div style={{padding: '34px 40px', ...rotulo}}>MEU PEDIDO · EXEMPLO</div></Folha>
      {ITENS.map(([t, txt, cor], i) => (
        <React.Fragment key={txt}>
          {cor && <Marca t={t + 0.1} x={258} y={434 + i * 92} w={txt.length * 25} h={62} cor={cor} giro={-0.8} />}
          <Traco t={t} x={186} y={432 + i * 92} w={54} h={54} d={certo(54)} cor={VERDE} larg={9} dur={0.18} />
          <Escrita t={t} x={262} y={418 + i * 92} tam={66} giro={-0.8} dur={0.45}>{txt}</Escrita>
        </React.Fragment>
      ))}
      <Escrita t={T.duas - 0.15} x={716} y={1070} tam={52} cor={VERMELHA} giro={-3} dur={0.3}>(máximo 2)</Escrita>
      {/* ou conecta a base de dados */}
      <Folha t={T.conecto - 0.1} x={600} y={148} w={400} h={150} cor={MARCA.azul} fita={MARCA.laranja} giro={3}>
        <div style={{padding: '22px 26px', fontFamily: MAO, fontWeight: 700, fontSize: 50, lineHeight: 1, color: CANETA}}>ou conecto a base de dados dele</div>
      </Folha>
      {/* a proposta antiga, presa com clipe */}
      <Folha t={T.antiga - 0.2} x={470} y={1230} w={520} h={300} fita={MARCA.rosa} giro={2}>
        <div style={{padding: '34px 34px'}}><div style={{...rotulo, marginBottom: 18}}>PROPOSTA ANTIGA MINHA</div>{linha('90%')}{linha('76%')}{linha('94%')}{linha('58%')}</div>
      </Folha>
      <Escrita t={T.exemplo - 0.3} x={520} y={1540} tam={72} cor={VERMELHA} giro={-2} dur={0.35}>de exemplo</Escrita>
      <Traco t={T.exemplo} x={520} y={1622} w={300} h={30} d={sublinha(300)} cor={VERMELHA} larg={8} />
      <Polaroid x={90} y={1420} w={300} src={FOTO} amp={AMP} legenda="eu" fundo={MARCA.verde} fita={MARCA.amarelo} />
    </Pagina>
  );
};

const Resultado: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.res as Janela)) return null;
  const ve = (t: number) => interpolate(f, [t * FPS, t * FPS + 8], [0.12, 1], clamp);
  const nota = (t: number, y: number, txt: string) => (
    <>
      <Traco t={t + 0.1} x={760} y={y + 6} w={50} h={50} d={certo(50)} cor={VERDE} larg={9} dur={0.18} />
      <Escrita t={t + 0.1} x={822} y={y - 10} tam={58} cor={VERDE} giro={-2} dur={0.3}>{txt}</Escrita>
    </>
  );
  const enviado = interpolate(f, [T.mando * FPS, T.mando * FPS + 7], [0, 1], {...clamp, easing: mola});
  const voa = interpolate(f, [T.mando * FPS, T.mando * FPS + 22], [0, 1], clamp);
  return (
    <Pagina cor={PAG.res}>
      <Escrita t={C.res[0] + 0.05} x={150} y={120} tam={104} dur={0.35}>olha o resultado</Escrita>
      <Traco t={C.res[0] + 0.4} x={150} y={236} w={560} h={30} d={sublinha(560)} cor={VERDE} larg={9} />
      <Folha t={C.res[0] + 0.25} x={130} y={320} w={610} h={800} fita={MARCA.amarelo} giro={-0.6}>
        <div style={{padding: '40px 40px'}}>
          <div style={{...rotulo, marginBottom: 10}}>PROPOSTA · EXEMPLO</div>
          <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 56, color: CANETA, letterSpacing: -1.2, marginBottom: 26}}>Padaria Central</div>
          <div style={{opacity: ve(T.problema - 0.1)}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: CANETA, marginBottom: 14}}>O problema</div>{linha('94%')}{linha('70%')}</div>
          <div style={{opacity: ve(T.escopo - 0.1), marginTop: 14}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: CANETA, marginBottom: 14}}>Escopo</div>
            {['80%', '66%', '74%'].map((w) => <div key={w} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18}}><span style={{width: 14, height: 14, borderRadius: 7, background: CANETA}} /><span style={{height: 12, borderRadius: 6, width: w, background: 'rgba(11,31,58,.18)'}} /></div>)}</div>
          <div style={{opacity: ve(T.tabela - 0.2), marginTop: 14, border: `3px solid ${CANETA}`, borderRadius: 10, overflow: 'hidden', fontFamily: SANS, fontWeight: 700, fontSize: 32, color: CANETA}}>
            <div style={{display: 'flex', borderBottom: `3px solid ${CANETA}`}}><span style={{flex: 1, padding: '12px 16px'}}>Valor</span><span style={{padding: '12px 16px', borderLeft: `3px solid ${CANETA}`}}>R$ 4.800,00</span></div>
            <div style={{display: 'flex', opacity: ve(T.prazo2 - 0.1)}}><span style={{flex: 1, padding: '12px 16px'}}>Prazo</span><span style={{padding: '12px 16px', borderLeft: `3px solid ${CANETA}`}}>15 dias</span></div>
          </div>
          <div style={{opacity: ve(T.passo - 0.2), marginTop: 28, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: CANETA}}>Próximo passo: <span style={{fontWeight: 500}}>aprovar até sexta</span></div>
        </div>
      </Folha>
      {nota(T.problema, 510, 'abertura')}
      {nota(T.escopo, 690, 'tópicos')}
      {nota(T.tabela, 800, 'tabela')}
      {nota(T.prazo2, 890, 'prazo')}
      {nota(T.passo, 990, 'próximo')}
      <Polaroid x={90} y={1420} w={300} src={FOTO} amp={AMP} legenda="eu" fundo={MARCA.azul} fita={MARCA.rosa} />
      <Escrita t={T.leio - 0.1} x={440} y={1440} tam={74} giro={-2} dur={0.3}>só leio,</Escrita>
      <Escrita t={T.ajusto} x={440} y={1530} tam={74} giro={-2} dur={0.5}>ajusto uma palavra</Escrita>
      <div style={{position: 'absolute', left: 440, top: 1640, opacity: Math.min(1, enviado * 2), transform: `rotate(-5deg) scale(${1.8 - 0.8 * enviado})`, transformOrigin: '0 50%', fontFamily: MAO, fontWeight: 700, fontSize: 104, color: VERDE}}>e mando ✓</div>
      {f >= T.mando * FPS && <svg width={160} height={130} viewBox="0 0 160 130" style={{position: 'absolute', left: 760 + voa * 360, top: 1560 - voa * 420, overflow: 'visible', filter: 'url(#mao)'}}><path d={aviao} fill="#fff" stroke={CANETA} strokeWidth={7} strokeLinejoin="round" /></svg>}
    </Pagina>
  );
};

const Conta: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.conta as Janela)) return null;
  return (
    <Pagina cor={PAG.conta}>
      <Escrita t={T.dois - 0.15} x={170} y={380} tam={250} dur={0.35} giro={-2}>+2 min</Escrita>
      <Escrita t={T.dois + 0.25} x={180} y={640} tam={84} dur={0.3} giro={-2}>a mais no pedido</Escrita>
      <Marca t={T.hora} x={160} y={900} w={760} h={230} cor={MARCA.verde} giro={-2} />
      <Escrita t={T.hora - 0.1} x={180} y={880} tam={250} cor={VERDE} dur={0.35} giro={-2}>−1 hora</Escrita>
      <Escrita t={T.hora + 0.3} x={180} y={1150} tam={84} dur={0.3} giro={-2}>a menos no meu dia</Escrita>
      <Polaroid x={370} y={1400} w={340} src={FOTO} amp={AMP} legenda="eu" fundo={MARCA.laranja} fita={MARCA.azul} />
    </Pagina>
  );
};

const PARTES: [number, string, string][] = [[T.fQuem, 'quem', MARCA.amarelo], [T.fQuanto, 'quanto', MARCA.rosa], [T.fTom, 'que tom', MARCA.azul], [T.fEx, 'um exemplo', MARCA.verde]];
const Formula: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.form as Janela)) return null;
  return (
    <Pagina cor={PAG.form}>
      <Escrita t={C.form[0] + 0.05} x={150} y={140} tam={120} dur={0.35}>a fórmula</Escrita>
      <Traco t={C.form[0] + 0.4} x={150} y={272} w={400} h={30} d={sublinha(400)} cor={VERMELHA} larg={9} />
      {PARTES.map(([t, txt, cor], i) => (
        <React.Fragment key={txt}>
          <Marca t={t} x={250} y={420 + i * 150} w={txt.length * 52 + 30} h={104} cor={cor} />
          {i > 0 && <Escrita t={t - 0.05} x={160} y={400 + i * 150} tam={120} cor={VERMELHA} giro={0} dur={0.1}>+</Escrita>}
          <Escrita t={t} x={264} y={400 + i * 150} tam={124} dur={0.3}>{txt}</Escrita>
        </React.Fragment>
      ))}
      <Escrita t={T.fServ - 0.2} x={160} y={1030} tam={104} cor={VERMELHA} giro={-2} dur={0.35}>+ o serviço</Escrita>
      <Escrita t={T.fPrazo - 0.2} x={160} y={1150} tam={104} cor={VERMELHA} giro={-2} dur={0.3}>+ o prazo</Escrita>
      <Traco t={T.fPrazo + 0.1} x={130} y={1010} w={560} h={280} d={roda(560, 280)} cor={VERMELHA} larg={8} dur={0.45} />
      <Polaroid x={640} y={1380} w={320} src={FOTO} amp={AMP} legenda="eu" fundo={MARCA.rosa} fita={MARCA.verde} />
    </Pagina>
  );
};

const Fecho: React.FC = () => {
  const f = useCurrentFrame();
  if (!dentro(f, C.fecho as Janela)) return null;
  const voa = interpolate(f, [T.direct * FPS - 6, T.direct * FPS + 20], [0, 1], clamp);
  return (
    <Pagina cor={PAG.fecho}>
      <Escrita t={C.fecho[0] + 0.05} x={150} y={150} w={840} tam={112} dur={0.7}>Quer o pedido pronto pra copiar?</Escrita>
      <Escrita t={T.comenta} x={150} y={520} tam={84} dur={0.35}>comenta a palavra</Escrita>
      <Marca t={T.palavra - 0.05} x={150} y={660} w={800} h={190} cor={MARCA.amarelo} giro={-2} />
      <Escrita t={T.palavra - 0.1} x={180} y={640} tam={200} dur={0.35} giro={-2}>PROPOSTA</Escrita>
      <Traco t={T.palavra + 0.3} x={120} y={620} w={860} h={270} d={roda(860, 270)} cor={VERMELHA} larg={9} dur={0.5} />
      <Escrita t={T.direct - 0.55} x={150} y={960} tam={88} dur={0.45}>que eu te mando no direct</Escrita>
      {f >= (T.direct - 0.2) * FPS && <svg width={160} height={130} viewBox="0 0 160 130" style={{position: 'absolute', left: 700 + voa * 180, top: 1110 - voa * 90, overflow: 'visible', filter: 'url(#mao)'}}><path d={aviao} fill="#fff" stroke={CANETA} strokeWidth={7} strokeLinejoin="round" /></svg>}
      <Polaroid x={330} y={1250} w={420} src={FOTO} amp={AMP} legenda="@carlosguilherrme" fundo={MARCA.azul} fita={MARCA.rosa} />
    </Pagina>
  );
};

const SONS: [number, string, number][] = [
  [0.05, 'digitacao-2', 0.07], [T.proposta - 0.05, 'whoosh-3', 0.1],
  [C.j1[0], 'whoosh-2', 0.12], [T.faz, 'digitacao-2', 0.08], [T.claude + 0.1, 'pop-ui-1', 0.14], [T.semValor, 'pop-ui-1', 0.14], [T.semPrazo, 'pop-ui-1', 0.14], [T.semNada, 'pop-ui-1', 0.14], [T.teria, 'whoosh-3', 0.12],
  [C.j2[0], 'whoosh-2', 0.12], ...ITENS.map(([t]): [number, string, number] => [t, 'pop-ui-1', 0.12]), [T.conecto - 0.1, 'mensagem-1', 0.14], [T.antiga - 0.2, 'pop-ui-1', 0.16],
  [C.res[0], 'whoosh-2', 0.12], [T.problema, 'certo-1', 0.12], [T.escopo, 'certo-1', 0.12], [T.tabela, 'certo-1', 0.12], [T.prazo2, 'certo-1', 0.12], [T.passo, 'certo-1', 0.12], [T.mando, 'mensagem-1', 0.2],
  [C.conta[0], 'whoosh-2', 0.12], [T.dois - 0.15, 'pop-ui-1', 0.14], [T.hora - 0.1, 'certo-1', 0.18],
  [C.form[0], 'whoosh-2', 0.12], ...PARTES.map(([t]): [number, string, number] => [t, 'pop-ui-1', 0.14]), [T.fServ - 0.2, 'pop-ui-1', 0.14], [T.fPrazo - 0.2, 'pop-ui-1', 0.14],
  [C.fecho[0], 'whoosh-2', 0.12], [T.palavra - 0.1, 'brilho-1', 0.16], [T.direct - 0.2, 'mensagem-1', 0.18], [DURACAO, 'ding-3', 0.14],
];

export const CadernoProposta: React.FC = () => (
  <AbsoluteFill style={{background: PAG.ab}}>
    <FiltrosCaderno />
    <Abertura />
    <Jeito1 />
    <Jeito2 />
    <Resultado />
    <Conta />
    <Formula />
    <Fecho />
    <Som pasta={PASTA} sons={SONS} duracao={DURACAO} total={TOTAL} />
  </AbsoluteFill>
);
