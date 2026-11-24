"""Gera a trilha e os efeitos 8 bits do vídeo em pixel art (onda quadrada, triângulo e ruído). Sem crédito, tudo local.
    python3 som8bit.py   (grava trilha8.wav e sfx/ na pasta onde roda)
"""
import wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def nota(freq, dur, forma="quad", vol=0.3, duty=0.5, decai=6.0):
    t = np.arange(int(SR * dur)) / SR
    if freq <= 0:
        return np.zeros_like(t)
    fase = (t * freq) % 1.0
    if forma == "quad":
        o = np.where(fase < duty, 1.0, -1.0)
    elif forma == "tri":
        o = 4 * np.abs(fase - 0.5) - 1
    else:
        o = rng.uniform(-1, 1, len(t))
    env = np.exp(-decai * t) * np.minimum(1, t / 0.004)
    fim = np.minimum(1, (dur - t) / 0.01)
    return o * env * fim * vol


def grava(nome, sinal):
    sinal = np.clip(sinal, -1, 1)
    with wave.open(nome, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((sinal * 32767).astype(np.int16).tobytes())


N = {"C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.0, "A4": 440.0, "B4": 493.88, "C5": 523.25, "D5": 587.33, "E5": 659.25, "G5": 783.99,
     "C3": 130.81, "F3": 174.61, "G3": 196.0, "A3": 220.0, "E3": 164.81, "-": 0}
BPM = 132
semi = 60 / BPM / 2  # colcheia
# 8 compassos, melodia original em colcheias (arpejos de dó, lá menor, fá e sol)
melodia = ("C5 E5 G5 E5 C5 - G4 - A4 C5 E5 C5 A4 - E4 - "
           "F4 A4 C5 A4 F4 - C5 - G4 B4 D5 B4 G4 - D5 - "
           "E5 - D5 C5 - G4 - - A4 - C5 E5 - D5 - - "
           "C5 - A4 F4 - A4 C5 - D5 - B4 G4 - - - - ").split()
baixo = (("C3 - C3 - C3 - C3 - A3 - A3 - A3 - A3 - F3 - F3 - F3 - F3 - G3 - G3 - G3 - G3 - ") * 2).split()
total = len(melodia) * semi
mus = np.zeros(int(SR * total) + SR)
for i, n in enumerate(melodia):
    s = nota(N[n], semi * 0.95, "quad", 0.16, 0.25, 5)
    p = int(i * semi * SR); mus[p:p + len(s)] += s
for i, n in enumerate(baixo):
    s = nota(N[n], semi * 0.95, "tri", 0.26, decai=3)
    p = int(i * semi * SR); mus[p:p + len(s)] += s
for i in range(len(melodia)):
    s = nota(1, 0.05, "ruido", 0.07 if i % 2 else 0.04, decai=60)
    p = int(i * semi * SR); mus[p:p + len(s)] += s
mus = mus[: int(SR * total)]
laco = np.tile(mus, int(40 / total) + 1)[: SR * 40]
grava("trilha8.wav", laco)

# efeitos
pulo = np.concatenate([nota(f, 0.02, "quad", 0.3, 0.5, 2) for f in np.linspace(300, 900, 9)])
grava("sfx/pulo.wav", pulo)
grava("sfx/moeda.wav", np.concatenate([nota(987.77, 0.07, "quad", 0.28, 0.5, 4), nota(1318.5, 0.28, "quad", 0.28, 0.5, 9)]))
grava("sfx/golpe.wav", np.concatenate([nota(f, 0.025, "quad", 0.32, 0.5, 2) for f in np.linspace(700, 120, 8)] + [nota(1, 0.12, "ruido", 0.25, decai=25)]))
grava("sfx/vitoria.wav", np.concatenate([nota(N[n], d, "quad", 0.28, 0.5, 3) for n, d in [("C5", .11), ("E5", .11), ("G5", .11), ("C5", .11), ("E5", .11), ("G5", .42)]]))
grava("sfx/texto.wav", nota(1200, 0.03, "quad", 0.12, 0.5, 30))
print("trilha", round(total, 2), "s por volta; arquivos ok")
