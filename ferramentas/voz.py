"""Prepara a narração gravada por ele: corta só o miolo das pausas, acelera e nivela. Não mexe no timbre.

    python3 voz.py bruto.m4a narracao.mp3 [--velocidade 1.3] [--cortar 12.4-15.1 30.0-31.2]

--cortar: trechos do bruto (em segundos) para tirar inteiros, como começo falso ou frase repetida.
Ache os tempos transcrevendo o bruto antes (palavras.py bruto.m4a).
Padrão: sem filtro de voz, sem normalização dinâmica; pausa maior que 0,32 s
perde o miolo e fica com 0,11 s de cada lado; ganho fixo até -16 LUFS com limitador.
"""
import argparse
import re
import subprocess

ap = argparse.ArgumentParser()
ap.add_argument("entrada")
ap.add_argument("saida")
ap.add_argument("--velocidade", type=float, default=1.3)
ap.add_argument("--pausa", type=float, default=0.32)
ap.add_argument("--sobra", type=float, default=0.11)
ap.add_argument("--ruido", type=float, default=-33)
ap.add_argument("--alvo", type=float, default=-16)
ap.add_argument("--cortar", nargs="*", default=[])
a = ap.parse_args()


def roda(args):
    return subprocess.run(["ffmpeg", "-hide_banner", *args], capture_output=True, text=True).stderr


dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.entrada], capture_output=True, text=True).stdout)
log = roda(["-i", a.entrada, "-af", f"silencedetect=noise={a.ruido}dB:d={a.pausa}", "-f", "null", "-"])
ini = [float(x) for x in re.findall(r"silence_start: ([-\d.]+)", log)]
fim = [float(x) for x in re.findall(r"silence_end: ([-\d.]+)", log)]
if len(fim) < len(ini):
    fim.append(dur)

fora = []  # trechos que saem
for s, e in zip(ini, fim):
    s = max(s, 0)
    if s <= 0.01:            # silêncio de abertura: deixa só um respiro
        fora.append((0, max(0, e - 0.05)))
    elif e >= dur - 0.01:    # silêncio do fim
        fora.append((s + 0.25, dur))
    elif e - s > 2 * a.sobra:
        fora.append((s + a.sobra, e - a.sobra))
for c in a.cortar:
    x, y = c.split("-")
    fora.append((float(x), float(y)))
fora = sorted((x, y) for x, y in fora if y > x)

fica, t = [], 0.0
for x, y in fora:
    if x > t:
        fica.append((t, x))
    t = max(t, y)
if t < dur:
    fica.append((t, dur))

sel = "+".join(f"between(t,{x:.3f},{y:.3f})" for x, y in fica)
base = f"aselect='{sel}',asetpts=N/SR/TB,atempo={a.velocidade}"
medida = roda(["-i", a.entrada, "-af", base + ",ebur128", "-f", "null", "-"])
lufs = float(re.findall(r"I:\s+([-\d.]+) LUFS", medida)[-1])
ganho = round(a.alvo - lufs, 2)
erro = roda(["-v", "error", "-y", "-i", a.entrada, "-af", f"{base},volume={ganho}dB,alimiter=limit=0.89:level=0", "-ac", "1", "-ar", "48000", "-b:a", "192k", a.saida])
if erro.strip():
    raise SystemExit(erro)
final = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.saida], capture_output=True, text=True).stdout)
print(f"bruto {dur:.1f} s -> {final:.1f} s | {len(fica)} trechos | {a.velocidade}x | {lufs} LUFS + {ganho} dB")
