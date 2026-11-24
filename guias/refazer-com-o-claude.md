# Refazer um estilo com o seu roteiro e a sua voz

O mesmo fluxo vale para todos os estilos (o pixel art não usa narração, veja o passo a passo dele). Cada passo pode ser feito pedindo ao Claude; os comandos estão aqui para você entender o que acontece.

## O que instalar

- Node.js 20 ou mais novo.
- ffmpeg (`brew install ffmpeg` no Mac). Serve para preparar a voz e medir o som.
- Python 3 com `faster-whisper` (`pip install faster-whisper`). Transcreve a sua voz com o tempo de cada palavra, no seu computador.

## 1. Roteiro

Escreva de 3 a 6 frases curtas. Cada frase vira uma cena e precisa ter uma imagem possível: um objeto, um gesto, uma comparação. Frase abstrata rende cena vazia. Peça ao Claude: "transforme este texto em roteiro de 40 segundos, uma frase por cena, e diga que imagem cada frase tem".

## 2. Sua voz

Grave no celular, em lugar silencioso, com o aparelho perto da boca. Fale como falaria com um amigo. Não precisa acertar de primeira: erros e pausas são cortados no passo seguinte.

## 3. Preparar a voz

```bash
python3 ferramentas/voz.py gravacao.m4a public/meu-video/audio/narracao.mp3
```

Corta o miolo das pausas longas, acelera 1,3x e nivela o volume sem filtro, para a voz continuar sendo a sua. Use `--velocidade 1.0` para manter o ritmo original e `--cortar 12.4-15.1` para tirar um trecho errado.

## 4. Tempo de cada palavra

```bash
python3 ferramentas/palavras.py public/meu-video/audio/narracao.mp3 --ts src/videos/meu-video/dados.ts
```

Gera o `dados.ts` com cada palavra e o segundo em que ela começa. Leia o texto impresso: se o Whisper errou um nome, crie um `trocas.json` como `{"cloud": "Claude"}` e passe `--trocas trocas.json`.

## 5. Volume por quadro (só papel recortado e caderno)

```bash
python3 ferramentas/amp.py public/meu-video/audio/narracao.mp3 src/videos/meu-video/amp.ts
```

O apresentador balança a cabeça de acordo com a força da voz.

## 6. As cenas

Copie a pasta do exemplo do estilo para `src/videos/meu-video/` e registre a composição em `src/Root.tsx`. Em cada cena, prenda cada objeto a uma palavra com `q('palavra')`: o objeto entra exatamente quando a palavra é dita. Palavra repetida pede o segundo de partida, `q('mito', 15)`.

## 7. Conferir antes de renderizar

```bash
npx remotion still src/index.ts MeuVideo quadro.jpg --frame=300 --scale=0.5
```

Olhe quadros dos momentos de troca de cena. Defeitos comuns: texto cortado na borda, um objeto cobrindo outro, cena vazia no primeiro segundo (o quadro 0 vira a miniatura).

## 8. Renderizar e ajustar o volume

```bash
npx remotion render src/index.ts MeuVideo out/meu-video.mp4 --crf=18
bash ferramentas/finalizar.sh out/meu-video.mp4 out/meu-video-final.mp4 -14
```

O último comando leva o som a -14 LUFS, o nível usado por Instagram, TikTok e YouTube Shorts, sem recomprimir a imagem.

## Foto do apresentador

Os exemplos de papel recortado, quadrinhos e caderno usam a foto do autor em `public/_apresentador/carlos.png`. Para usar a sua, tire uma foto de rosto e ombros com fundo simples e, no Mac, recorte com `swift ferramentas/recorte.swift foto.jpg public/_apresentador/eu.png`. Só use foto de quem autorizou.
