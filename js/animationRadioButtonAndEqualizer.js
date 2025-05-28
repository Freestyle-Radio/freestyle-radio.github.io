// 1. Инициализация
const audioElement = document.getElementById('audio');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const src = audioCtx.createMediaElementSource(audioElement);

// 2. Создание эквалайзерных фильтров
const frequencies = [32, 64, 125, 250, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 16000];
const filters = frequencies.map(freq => {
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'peaking';
  filter.frequency.value = freq;
  filter.Q.value = 1;
  filter.gain.value = 0;
  return filter;
});

// 3. Создание анализатора
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 32;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// 4. Подключение всей цепочки: src → filters → analyser → destination
filters.reduce((prev, curr) => {
  prev.connect(curr);
  return curr;
});
src.connect(filters[0]);
filters[filters.length - 1].connect(analyser);
analyser.connect(audioCtx.destination);

// 5. Обновление визуализации
function renderFrame() {
  requestAnimationFrame(renderFrame);
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
  const normalized = average / 255;
  gsap.set('.visualizer-bar', { scaleY: normalized * 0.85 });
}
renderFrame();

// 6. Привязка эквалайзерных слайдеров
const sliders = document.querySelectorAll('.equalizer .band input[type="range"]');
sliders.forEach((slider, index) => {
  slider.addEventListener('input', (e) => {
    const gain = parseFloat(e.target.value);
    filters[index].gain.value = gain;
  });
});

// 7. Гарантируем запуск контекста
document.addEventListener('click', () => {
  if (audioCtx.state !== 'running') {
    audioCtx.resume();
  }
});
