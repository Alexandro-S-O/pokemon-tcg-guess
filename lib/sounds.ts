// Note frequencies (Hz)
const NOTE = {
  C4: 261.63, E4: 329.63, G4: 392.0,
  C5: 523.25, E5: 659.25, G5: 783.99,
  C6: 1046.5,
}

function makeCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try { return new AudioContext() } catch { return null }
}

function tone(
  ac: AudioContext,
  freq: number,
  startSec: number,
  durationSec: number,
  volume = 0.12,
) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, startSec)
  gain.gain.exponentialRampToValueAtTime(0.001, startSec + durationSec)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(startSec)
  osc.stop(startSec + durationSec)
}

export function playCorrect(streak: number) {
  const ac = makeCtx()
  if (!ac) return
  const t = ac.currentTime
  const step = 0.12
  tone(ac, NOTE.C5, t, step)
  tone(ac, NOTE.E5, t + step, step)
  tone(ac, NOTE.G5, t + step * 2, step)
  if (streak >= 3) {
    // bonus fanfare note for streak milestone
    tone(ac, NOTE.C6, t + step * 3, step * 1.5, 0.1)
  }
}

export function playWrong() {
  const ac = makeCtx()
  if (!ac) return
  const t = ac.currentTime
  tone(ac, NOTE.G4, t, 0.08)
  tone(ac, NOTE.E4, t + 0.09, 0.1)
}

export function playRevealed() {
  const ac = makeCtx()
  if (!ac) return
  const t = ac.currentTime
  const step = 0.2
  tone(ac, NOTE.G4, t, step)
  tone(ac, NOTE.E4, t + step, step)
  tone(ac, NOTE.C4, t + step * 2, step * 1.5)
}
