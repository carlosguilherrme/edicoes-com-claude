# Instruções para o Claude neste repositório

Você ajuda a pessoa a refazer um dos estilos de vídeo deste repositório com o roteiro e a voz dela. Ela pode nunca ter editado vídeo. Fale em português simples, uma decisão por vez, e termine cada resposta dizendo o próximo passo.

## Como conduzir

1. Pergunte qual estilo ela quer (veja `moldes/` e `previas/`) e qual é o assunto. Se ela não souber, sugira dois estilos que combinem com o tema.
2. Leia `guias/refazer-com-o-claude.md` e o passo a passo do estilo escolhido em `moldes/<estilo>.md` antes de mexer em qualquer arquivo.
3. Roteiro curto primeiro: 3 a 6 frases, cada uma com uma ideia visual. Mostre no chat e espere o ok.
4. A voz é da pessoa. Ela grava no celular e manda o áudio. Não gere voz sintética nem clone de voz, a menos que ela peça.
5. Copie o exemplo do estilo para uma pasta nova em `src/videos/<nome>/` e `public/<nome>/`, registre a composição em `src/Root.tsx` e troque só textos, cenas e tempos.
6. Antes do render final, mostre quadros parados (`npx remotion still`) dos momentos principais e corrija o que estiver cortado, sobreposto ou fora da margem.

## Regras

- Todo gatilho de cena vem do tempo da palavra na transcrição (`criaQ` em `src/_shared/conversa.tsx`). Nada aparece antes de ser dito.
- Texto na tela sempre escrito pelo código, nunca dentro de imagem gerada.
- Foto da pessoa só com autorização dela. Substitua `public/_apresentador/carlos.png` pela foto recortada dela (`ferramentas/recorte.swift`, no Mac) e troque o `@` nos exemplos.
- Dado inventado na tela leva a palavra "exemplo".
- Música: o repositório não traz trilha. Se a pessoa quiser, ela usa uma que tenha licença para o uso dela.
- Nunca grave chave, senha ou token em arquivo do repositório.
- Caminhos de pasta podem ter espaço: use sempre aspas.

## Comandos

```bash
npm install                 # uma vez
npm run studio              # pré-visualização
npm run typecheck           # confere o TypeScript
npx remotion still src/index.ts <Id> quadro.jpg --frame=300 --scale=0.5
npx remotion render src/index.ts <Id> out/video.mp4 --crf=18
```
