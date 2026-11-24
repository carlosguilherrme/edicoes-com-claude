import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ARCADE, Barra, CaixaPixel, Ceu, Chao, CHEFE, COR_CHEFE, COR_ESTRELA, COR_HEROI, COR_ROBO, Digita, ESTRELA, HEROI_A, HEROI_B, HEROI_PULO, PIXEL, PX, ROBO, Sprite, trava} from '../../_shared/pixel';

// 030. jogo-ia — "IA na empresa: o jogo", 1080x1920, sem narração, trilha e efeitos 8 bits gerados localmente.
// Vídeo novo para sáb 21/11, estilo pixel art do catálogo. Um joguinho de plataforma: quatro fases (os quatro assuntos
// que ele já ensinou nos outros vídeos) e um chefão. Sem fato novo: pedido com contexto, skill, conector da agenda,
// delegar, e a regra dele "o robô prepara, uma pessoa aprova".

export const FPS = 30;
const PASTA = 'pixel-art';
const q = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FASES = [
  {nome: 'PEDIDO COM CONTEXTO', cor: PX.amarelo, fala: 'Diga quem, quanto, que tom e dê um exemplo. A resposta sai bem mais perto do que você precisa.'},
  {nome: 'SKILL', cor: PX.ciano, fala: 'Ensine uma vez o seu jeito de fazer. Ele repete igual toda vez.'},
  {nome: 'CONECTOR', cor: PX.verde, fala: 'Ligue a sua agenda. Ele passa a enxergar a sua semana de verdade.'},
  {nome: 'DELEGAR', cor: PX.rosa, fala: 'Pergunte o que dá pra tirar da sua mesa. Sobra tempo pro que importa.'},
];
const INI = 3.2; // fim da tela de título
const DUR = 4.8; // cada fase
const ANDA = 0.9; // tempo andando entre uma tela e outra
const S = (i: number) => INI + i * DUR; // começo da fase i
const CHEFAO = S(4); // 22,4
const GOLPE1 = CHEFAO + 2.7;
const GOLPE2 = CHEFAO + 3.6;
const SOME = CHEFAO + 4.3;
const FIM_JOGO = CHEFAO + 6.4; // 28,8
export const TOTAL = q(FIM_JOGO + 5.2);
const CHAO = 1240;
const U = 16; // tamanho do pixel do herói

// quanto o mundo já andou (em telas), no quadro f
const mundo = (f: number) => {
  let n = 0;
  for (let k = 0; k < 5; k++) n += interpolate(f, [q(S(k)), q(S(k) + ANDA)], [0, 1], clamp);
  return n;
};
const andando = (f: number) => [0, 1, 2, 3, 4].some((k) => f >= q(S(k)) && f < q(S(k) + ANDA));

const Heroi: React.FC = () => {
  const f = useCurrentFrame();
  const ft = trava(f);
  let pulo = 0;
  for (let i = 0; i < 4; i++) {
    const p = interpolate(ft, [q(S(i) + 0.95), q(S(i) + 1.55)], [0, 1], clamp);
    if (p > 0 && p < 1) pulo = Math.sin(Math.PI * p) * 232;
  }
  // no chefão ele recua para a esquerda
  const x = interpolate(ft, [q(CHEFAO), q(CHEFAO + ANDA)], [444, 130], clamp);
  const golpe = [GOLPE1, GOLPE2].some((t) => f >= q(t) - 4 && f < q(t) + 6);
  const mapa = pulo > 0 ? HEROI_PULO : andando(f) && Math.floor(f / 4) % 2 === 0 ? HEROI_B : HEROI_A;
  const boia = Math.round(Math.sin(ft / 7) * 2) * 6;
  return (
    <>
      <Sprite mapa={ROBO} cores={COR_ROBO} u={12} x={x - 150} y={CHAO - 330 + boia - pulo * 0.5} />
      <Sprite mapa={mapa} cores={COR_HEROI} u={U} x={x + (golpe ? 18 : 0)} y={CHAO - 16 * U + U - pulo} />
    </>
  );
};

// bloco "?" que o herói acerta, e o item que sai dele
const Fase: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const ft = trava(f);
  const t = S(i);
  const bate = q(t + 1.25);
  const quica = ft >= bate && ft < bate + 6 ? -24 : 0;
  const sobe = interpolate(ft, [bate, bate + 10], [0, 1], clamp);
  const batido = f >= bate;
  return (
    <>
      <div style={{position: 'absolute', left: 444, top: 560 + quica, width: 192, height: 192, background: batido ? '#B9772D' : PX.amarelo, boxShadow: `inset 0 0 0 12px ${PX.preto}, inset 12px 12px 0 12px ${batido ? '#D99A4E' : '#FFE98A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ARCADE, fontSize: 96, color: PX.preto}}>{batido ? '' : '?'}</div>
      {sobe > 0 ? (
        <CaixaPixel x={540 - 440} y={560 - sobe * 190} w={880} h={120} cor={FASES[i].cor} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, sobe * 3)}}>
          <span style={{fontFamily: ARCADE, fontSize: FASES[i].nome.length > 12 ? 40 : 58, color: PX.preto}}>{FASES[i].nome}</span>
        </CaixaPixel>
      ) : null}
    </>
  );
};

const Chefao: React.FC = () => {
  const f = useCurrentFrame();
  const ft = trava(f);
  if (f < q(CHEFAO)) return null;
  const vida = f < q(GOLPE1) + 12 ? 6 : f < q(GOLPE2) + 12 ? 3 : 0;
  const atingido = [GOLPE1, GOLPE2].some((t) => f >= q(t) + 12 && f < q(t) + 20);
  const sumindo = f >= q(SOME) - 14 && f < q(SOME);
  const visivel = f < q(SOME) && (!sumindo || Math.floor(f / 3) % 2 === 0);
  const treme = atingido ? (Math.floor(f / 2) % 2 ? 14 : -14) : 0;
  return (
    <>
      {visivel ? <Sprite mapa={CHEFE} cores={COR_CHEFE} u={26} x={600 + treme} y={CHAO - 12 * 26 + Math.round(Math.sin(ft / 6)) * 8} branco={atingido && Math.floor(f / 2) % 2 === 0} /> : null}
      {f < q(SOME) ? (
        <>
          <div style={{position: 'absolute', left: 600, top: 800, fontFamily: ARCADE, fontSize: 30, color: '#fff'}}>A PRESSA</div>
          <Barra x={606} y={850} gomos={6} cheios={vida} cor={PX.vermelho} larg={52} alt={30} />
        </>
      ) : null}
      {[GOLPE1, GOLPE2].map((t, k) => {
        const p = interpolate(ft, [q(t), q(t) + 12], [0, 1], clamp);
        return (
          <React.Fragment key={k}>
            {p > 0 && p < 1 ? <Sprite mapa={ESTRELA} cores={COR_ESTRELA} u={20} x={330 + p * 360} y={CHAO - 220} /> : null}
            {f >= q(t) - 6 && f < Math.min(q(t) + 26, q(SOME)) ? <div style={{position: 'absolute', left: 60, top: 590, fontFamily: ARCADE, fontSize: 76, color: PX.amarelo, textShadow: `8px 8px 0 ${PX.preto}`}}>{k === 0 ? 'REVISAR!' : 'APROVAR!'}</div> : null}
          </React.Fragment>
        );
      })}
      {f >= q(SOME) && f < q(FIM_JOGO) ? <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: ARCADE, fontSize: 104, color: PX.amarelo, textShadow: `10px 10px 0 ${PX.preto}`, opacity: Math.floor(f / 6) % 4 === 3 ? 0.4 : 1}}>VITÓRIA!</div> : null}
    </>
  );
};

// barra de cima: nome da fase e experiência
const Painel: React.FC = () => {
  const f = useCurrentFrame();
  const fase = f < q(INI) ? -1 : f >= q(CHEFAO) ? 4 : Math.min(3, Math.floor((f - q(INI)) / q(DUR)));
  const xp = [0, 1, 2, 3].filter((i) => f >= q(S(i) + 1.25)).length;
  if (fase < 0 || f >= q(FIM_JOGO)) return null;
  return (
    <>
      <div style={{position: 'absolute', left: 64, top: 170, fontFamily: ARCADE, fontSize: 44, color: '#fff', textShadow: `6px 6px 0 ${PX.preto}`}}>{fase === 4 ? 'CHEFÃO' : `FASE ${fase + 1}/4`}</div>
      <div style={{position: 'absolute', left: 64, top: 250, fontFamily: ARCADE, fontSize: 24, color: PX.amarelo}}>IA NA EMPRESA</div>
      <div style={{position: 'absolute', left: 724, top: 172, fontFamily: ARCADE, fontSize: 26, color: '#fff'}}>XP</div>
      <Barra x={800} y={160} gomos={4} cheios={xp} cor={PX.verde} larg={44} alt={36} />
    </>
  );
};

// caixa de diálogo de RPG, embaixo
const Dialogo: React.FC = () => {
  const f = useCurrentFrame();
  let texto = '';
  let q0 = 0;
  FASES.forEach((fa, i) => {
    if (f >= q(S(i) + 1.5) && f < q(S(i + 1))) { texto = fa.fala; q0 = q(S(i) + 1.5); }
  });
  if (f >= q(CHEFAO + 0.7) && f < q(GOLPE1) - 6) { texto = 'CHEFÃO: A PRESSA. Ela quer que você envie sem ler.'; q0 = q(CHEFAO + 0.7); }
  if (f >= q(SOME) && f < q(FIM_JOGO)) { texto = 'O robô prepara. Uma pessoa aprova. Só depois sai.'; q0 = q(SOME); }
  if (!texto) return null;
  return (
    <CaixaPixel x={70} y={1350} w={940} h={250} style={{padding: '26px 34px'}}>
      <Digita q0={q0}>{texto}</Digita>
    </CaixaPixel>
  );
};

const Titulo: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= q(INI) + q(ANDA)) return null;
  const x = -mundo(f) * 1080;
  return (
    <div style={{position: 'absolute', left: x, top: 0, width: 1080, height: 1920}}>
      <CaixaPixel x={110} y={330} w={860} h={420} cor={PX.noite} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
        <span style={{fontFamily: ARCADE, fontSize: 88, color: '#fff', textShadow: `8px 8px 0 ${PX.laranja}`}}>IA NA</span>
        <span style={{fontFamily: ARCADE, fontSize: 88, color: '#fff', textShadow: `8px 8px 0 ${PX.laranja}`}}>EMPRESA</span>
        <span style={{fontFamily: ARCADE, fontSize: 52, color: PX.amarelo}}>O JOGO</span>
      </CaixaPixel>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', fontFamily: PIXEL, fontWeight: 700, fontSize: 54, color: '#fff'}}>4 fases e um chefão</div>
      {Math.floor(f / 12) % 2 === 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: ARCADE, fontSize: 44, color: PX.amarelo, textShadow: `6px 6px 0 ${PX.preto}`}}>PRESS START</div> : null}
    </div>
  );
};

const Final: React.FC = () => {
  const f = useCurrentFrame();
  if (f < q(FIM_JOGO)) return null;
  const t = FIM_JOGO;
  const linha = (i: number) => f >= q(t + 0.9 + i * 0.3);
  return (
    <AbsoluteFill style={{background: 'rgba(11,11,20,.86)'}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 250, textAlign: 'center', fontFamily: ARCADE, fontSize: 62, lineHeight: 1.5, color: '#fff', textShadow: `8px 8px 0 ${PX.laranja}`}}>E VOCÊ,<br />ESTÁ EM QUE<br />FASE?</div>
      <div style={{position: 'absolute', left: 130, top: 700, display: 'flex', flexDirection: 'column', gap: 34}}>
        {FASES.map((fa, i) => (linha(i) ? (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <span style={{width: 84, height: 84, background: fa.cor, boxShadow: `0 0 0 8px ${PX.preto}, 0 0 0 14px #fff`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ARCADE, fontSize: 44, color: PX.preto}}>{i + 1}</span>
            <span style={{fontFamily: PIXEL, fontWeight: 700, fontSize: 62, color: '#fff'}}>{fa.nome.toLowerCase()}</span>
          </div>
        ) : null))}
      </div>
      {f >= q(t + 2.4) && Math.floor(f / 12) % 2 === 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center', fontFamily: ARCADE, fontSize: 46, color: PX.amarelo, textShadow: `6px 6px 0 ${PX.preto}`}}>COMENTA O NÚMERO</div> : null}
      {f >= q(t + 2.8) ? <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', fontFamily: PIXEL, fontWeight: 500, fontSize: 48, color: '#fff'}}>@carlosguilherrme</div> : null}
    </AbsoluteFill>
  );
};

const Som8: React.FC = () => {
  const toca = (t: number, arq: string, vol: number, i: number) => (
    <Sequence key={`${arq}-${i}`} from={q(t)} durationInFrames={45} layout="none"><Audio src={staticFile(`${PASTA}/sfx/${arq}.wav`)} volume={vol} /></Sequence>
  );
  return (
    <>
      <Audio src={staticFile(`${PASTA}/trilha8.wav`)} volume={(f) => interpolate(f, [0, 15, q(CHEFAO), q(CHEFAO) + 20, q(SOME), q(SOME) + 20, TOTAL - 40, TOTAL - 2], [0, 0.5, 0.5, 0.3, 0.3, 0.5, 0.5, 0], clamp)} />
      {[0, 1, 2, 3].flatMap((i) => [toca(S(i) + 0.95, 'pulo', 0.5, i), toca(S(i) + 1.25, 'moeda', 0.55, i)])}
      {[GOLPE1, GOLPE2].map((t, i) => toca(t + 0.35, 'golpe', 0.6, i))}
      {toca(SOME, 'vitoria', 0.6, 0)}
    </>
  );
};

export const JogoIa: React.FC = () => {
  const f = useCurrentFrame();
  const m = mundo(trava(f));
  const desloca = m * 1080;
  return (
    <AbsoluteFill style={{background: PX.noite}}>
      <Ceu desloca={desloca} />
      <Chao y={CHAO} desloca={desloca} />
      <Titulo />
      {/* cada fase é uma tela do mundo: entra da direita quando o herói anda */}
      {[0, 1, 2, 3].map((i) => {
        const x = (i + 1 - m) * 1080;
        return x > -1080 && x < 1080 ? <div key={i} style={{position: 'absolute', left: x, top: 0, width: 1080, height: 1920}}><Fase i={i} /></div> : null;
      })}
      {(5 - m) * 1080 < 1080 ? <div style={{position: 'absolute', left: (5 - m) * 1080, top: 0, width: 1080, height: 1920}}><Chefao /></div> : null}
      {f < q(FIM_JOGO) ? <Heroi /> : null}
      <Painel />
      <Dialogo />
      <Final />
      <Som8 />
    </AbsoluteFill>
  );
};
