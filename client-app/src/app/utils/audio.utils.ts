const createAudioContext = (): AudioContext | null => {
  try {
    return new AudioContext();
  } catch (err) {
    console.error('can`t create audio context', err);
    return null;
  }
}

const connectAudioToContext = (audio: HTMLAudioElement, context: AudioContext): MediaElementAudioSourceNode => {
  const source = context.createMediaElementSource(audio);
  source.connect(context.destination);
  return source;
}

const createAnalyser = (context: AudioContext, source: MediaElementAudioSourceNode): AnalyserNode => {
  const analyser = context.createAnalyser();
  source.connect(analyser);
  analyser.connect(context.destination);
  return analyser;
}

const visualiseWaves = (analyser: AnalyserNode, canvas: HTMLCanvasElement, color = '#ffffff'): void => {
  const fbc_array = new Uint8Array(analyser.frequencyBinCount);
  const bar_count = canvas.width / 2;

  analyser.getByteFrequencyData(fbc_array);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;

  for (let i = 0; i < bar_count; i++) {
    const bar_pos = i * 4, bar_width = 2, bar_height = -(fbc_array[i] / 2);
    ctx.fillRect(bar_pos, canvas.height, bar_width, bar_height);
  }
}

const createFilters = (
  context: AudioContext,
  type: BiquadFilterType = 'peaking',
  frequencies: number[]
): BiquadFilterNode[] => {
  const filters = frequencies.map(x => {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = x;
    filter.Q.value = 1;
    filter.gain.value = 0;
    return filter;
  });
  filters.reduce((x1, x2) => {
    x1.connect(x2);
    return x2;
  });
  return filters;
}

const connectFilters = (
  filters: BiquadFilterNode[],
  context: AudioContext,
  source: MediaElementAudioSourceNode
): AudioNode[] => {
  const first = filters[0];
  const last = filters[filters.length - 1];
  const n1 = source.connect(first);
  const n2 = last.connect(context.destination);
  return [n1, n2];
}

const AudioUtils = {
  createAudioContext,
  connectAudioToContext,
  createFilters,
  connectFilters,
  createAnalyser,
  visualiseWaves
}

export default AudioUtils;
