import type { Illustration } from '../types/story'

/**
 * Quiet background sound per scene, made in the browser with the Web Audio API, so no audio
 * files are needed. These are placeholders until real recordings are available.
 */
export type Soundscape = 'bos' | 'water' | 'wind' | 'avond' | 'stil'

const scapes: Partial<Record<Illustration, Soundscape>> = {
  stream: 'water',
  swamp: 'water',
  bridge: 'water',
  stones: 'water',
  wetShoe: 'water',
  mill: 'wind',
  slope: 'wind',
  night: 'avond',
  home: 'stil',
}

/** The soundscape for a scene. When it is getting dark in the forest, the crickets start. */
export function soundscapeFor(illustration: Illustration, dusk: number): Soundscape {
  const scape = scapes[illustration] ?? 'bos'
  return scape === 'bos' && dusk >= 0.8 ? 'avond' : scape
}

type Layer = { output: GainNode; stop: () => void }

const FADE = 1.5
const VOLUME = 0.6

class Ambience {
  private context?: AudioContext
  private master?: GainNode
  private noise?: AudioBuffer
  private current?: { scape: Soundscape; layer: Layer }

  play(scape: Soundscape) {
    const context = this.ensureContext()
    if (!context) return
    void context.resume()
    if (this.current?.scape === scape) return
    this.fadeOutCurrent()
    const layer = this.build(scape, context)
    layer.output.gain.setValueAtTime(0, context.currentTime)
    layer.output.gain.linearRampToValueAtTime(1, context.currentTime + FADE)
    this.current = { scape, layer }
  }

  stop() {
    this.fadeOutCurrent()
    this.current = undefined
  }

  private fadeOutCurrent() {
    if (!this.current || !this.context) return
    const { layer } = this.current
    const now = this.context.currentTime
    layer.output.gain.cancelScheduledValues(now)
    layer.output.gain.setValueAtTime(layer.output.gain.value, now)
    layer.output.gain.linearRampToValueAtTime(0, now + FADE)
    window.setTimeout(layer.stop, FADE * 1000 + 100)
  }

  private ensureContext(): AudioContext | undefined {
    if (this.context) return this.context
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) return undefined
    this.context = new AudioContextClass()
    this.master = this.context.createGain()
    this.master.gain.value = VOLUME
    this.master.connect(this.context.destination)
    this.noise = brownNoise(this.context)
    return this.context
  }

  private build(scape: Soundscape, context: AudioContext): Layer {
    const output = context.createGain()
    output.connect(this.master!)
    const stops: (() => void)[] = [() => output.disconnect()]

    const noise = (type: BiquadFilterType, frequency: number, volume: number, wobble = 0) => {
      const source = context.createBufferSource()
      source.buffer = this.noise!
      source.loop = true
      const filter = context.createBiquadFilter()
      filter.type = type
      filter.frequency.value = frequency
      const gain = context.createGain()
      gain.gain.value = volume
      source.connect(filter).connect(gain).connect(output)
      if (wobble > 0) {
        // A slow swell, like gusts of wind or rushing water.
        const lfo = context.createOscillator()
        const depth = context.createGain()
        lfo.frequency.value = wobble
        depth.gain.value = volume * 0.6
        lfo.connect(depth).connect(gain.gain)
        lfo.start()
        stops.push(() => lfo.stop())
      }
      source.start()
      stops.push(() => source.stop())
    }

    const repeat = (play: () => void, minMs: number, maxMs: number) => {
      let timer = 0
      const next = () => {
        timer = window.setTimeout(() => {
          play()
          next()
        }, minMs + Math.random() * (maxMs - minMs))
      }
      next()
      stops.push(() => window.clearTimeout(timer))
    }

    if (scape === 'bos') {
      noise('lowpass', 500, 0.35, 0.08)
      repeat(() => birdCall(context, output), 2500, 7000)
    } else if (scape === 'water') {
      noise('bandpass', 900, 0.5, 0.25)
      noise('highpass', 3000, 0.06, 0.4)
    } else if (scape === 'wind') {
      noise('lowpass', 350, 0.55, 0.06)
    } else if (scape === 'avond') {
      noise('lowpass', 300, 0.15)
      repeat(() => cricket(context, output), 700, 1600)
    }

    return { output, stop: () => stops.forEach(stop => stop()) }
  }
}

/** Two seconds of soft, rumbling noise to loop: the base for wind and water. */
function brownNoise(context: AudioContext): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

/** A short bird call: two or three quick rising whistles. */
function birdCall(context: AudioContext, output: AudioNode) {
  const notes = 2 + Math.floor(Math.random() * 2)
  const base = 2600 + Math.random() * 900
  for (let n = 0; n < notes; n++) {
    const start = context.currentTime + n * 0.16
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(base, start)
    osc.frequency.exponentialRampToValueAtTime(base * 1.4, start + 0.09)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.025, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12)
    osc.connect(gain).connect(output)
    osc.start(start)
    osc.stop(start + 0.14)
  }
}

/** A cricket chirp: a few very short high pulses. */
function cricket(context: AudioContext, output: AudioNode) {
  for (let n = 0; n < 3; n++) {
    const start = context.currentTime + n * 0.05
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.frequency.value = 4400
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.012, start + 0.01)
    gain.gain.linearRampToValueAtTime(0, start + 0.035)
    osc.connect(gain).connect(output)
    osc.start(start)
    osc.stop(start + 0.04)
  }
}

export const ambience = new Ambience()
