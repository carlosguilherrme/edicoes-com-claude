#!/bin/bash
# Ajusta o volume do vídeo renderizado para a rede certa, sem recomprimir a imagem.
#   finalizar.sh entrada.mp4 saida.mp4 [alvo]     alvo: -14 (Reels/TikTok, padrão) ou -20 (YouTube longo)
set -e
IN="$1"; OUT="$2"; ALVO="${3:--14}"
L=$(ffmpeg -i "$IN" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G=$(python3 -c "print(round(${ALVO}-(${L}),2))")
# level=0 no limitador: sem isso ele reaplica ganho sozinho e desfaz o ajuste
ffmpeg -v error -y -i "$IN" -c:v copy -af "volume=${G}dB,alimiter=limit=0.89:level=0" -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "antes: ${L} LUFS  ganho: ${G} dB  depois:$(ffmpeg -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1)"
