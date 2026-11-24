import React from 'react';
import {Composition, Folder} from 'remotion';
import {PapelRecortado, TOTAL as TOTAL_PAPEL} from './videos/papel-recortado/PapelRecortado';
import {SkillQuadro, TOTAL as TOTAL_QUADRO} from './videos/quadro-negro/SkillQuadro';
import {SemanaNeon, TOTAL as TOTAL_NEON} from './videos/neon/SemanaNeon';
import {ModelosGibi, TOTAL as TOTAL_GIBI} from './videos/quadrinhos/ModelosGibi';
import {JogoIa, TOTAL as TOTAL_JOGO} from './videos/pixel-art/JogoIa';
import {CadernoProposta, TOTAL as TOTAL_CADERNO} from './videos/caderno/CadernoProposta';

const FPS = 30;

// Todos os exemplos são verticais (1080x1920, 30 fps). O id é o que você passa para o render.
export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Estilos">
      <Composition id="PapelRecortado" component={PapelRecortado} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_PAPEL} />
      <Composition id="QuadroNegro" component={SkillQuadro} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_QUADRO} />
      <Composition id="Neon" component={SemanaNeon} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_NEON} />
      <Composition id="Quadrinhos" component={ModelosGibi} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_GIBI} />
      <Composition id="PixelArt" component={JogoIa} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_JOGO} />
      <Composition id="Caderno" component={CadernoProposta} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_CADERNO} />
    </Folder>
  </>
);
