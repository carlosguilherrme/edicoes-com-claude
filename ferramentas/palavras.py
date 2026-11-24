"""Transcreve o master pronto (tempo de cada palavra) e gera o dados.ts que a composição do Remotion importa.
Serve também para CONFERIR OS CORTES: leia o texto impresso e veja se alguma emenda ficou com palavra cortada ou repetida.

    python3 palavras.py master-vertical.mp4 --ts <projeto remotion>/src/videos/<slug>/dados.ts [--prompt "nomes"] [--trocas trocas.json]

trocas.json (opcional): {"antrópica": "Anthropic", "cloud": "Claude"}  -> corrige a grafia que o whisper erra
(compara sem acento e sem maiúscula; a pontuação da palavra é mantida).
Grava transcricao/palavras.json e o dados.ts (DURACAO, PALAVRAS; mantém o RECORTE que já estiver no arquivo).
"""
import argparse
import json
import re
import subprocess
import tempfile
import unicodedata
from pathlib import Path

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("master")
ap.add_argument("--ts", help="caminho do dados.ts a gerar")
ap.add_argument("--prompt", default="")
ap.add_argument("--trocas")
ap.add_argument("--modelo", default="medium")
ap.add_argument("--idioma", default="pt")
a = ap.parse_args()


def chave(s):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode())


trocas = {chave(k): v for k, v in json.loads(Path(a.trocas).read_text()).items()} if a.trocas else {}
with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.master, "-vn", "-ac", "1", "-ar", "16000", wav.name], check=True)
    segs, _ = WhisperModel(a.modelo, device="cpu", compute_type="int8").transcribe(wav.name, language=a.idioma, word_timestamps=True, initial_prompt=a.prompt or None)
    out = []
    for s in segs:
        for w in s.words:
            t = w.word.strip()
            if chave(t) in trocas:
                t = trocas[chave(t)] + (re.search(r"[.,!?%…]*$", t).group(0))
            # ".2" de "5.2" e "%" vêm separados: junta na palavra anterior
            if out and re.match(r"^[.,]\d|^%", t):
                out[-1]["w"] += t
                out[-1]["e"] = round(float(w.end), 2)
                continue
            out.append({"w": t, "s": round(float(w.start), 2), "e": round(float(w.end), 2)})

Path("transcricao").mkdir(exist_ok=True)
Path("transcricao/palavras.json").write_text(json.dumps(out, ensure_ascii=False))
print(" ".join(f"{x['w']}[{x['s']}]" for x in out))
if a.ts:
    ts = Path(a.ts)
    recorte = "[]"
    if ts.exists():
        m = re.search(r"export const RECORTE: \[number, number\]\[\] = (.*);", ts.read_text())
        recorte = m.group(1) if m else "[]"
    ts.parent.mkdir(parents=True, exist_ok=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.master], capture_output=True, text=True).stdout)
    ts.write_text("// Gerado por palavras.py a partir do master. Não editar à mão.\n"
                  f"export const DURACAO = {dur:.3f}; // segundos do master\n"
                  "export const PALAVRAS: {w: string; s: number; e: number}[] = " + json.dumps(out, ensure_ascii=False) + ";\n"
                  "// reservado: faixas [início, fim] de quadros com recorte da pessoa (não usado pelos exemplos)\n"
                  f"export const RECORTE: [number, number][] = {recorte};\n")
    print(f"\ngravado: {ts}")
