document.addEventListener("DOMContentLoaded", () => {
  const audioElement = document.getElementById('audio');
  const playToggle = document.querySelector('.audio-controls__play-toggle');
  const visualizerBar = document.querySelector('.visualizer-bar');
  const progressBar = document.querySelector('.audio-controls__current-progress');
  const sliders = document.querySelectorAll('.equalizer-container input[type="range"]');

  const frequencies = [32, 64, 125, 250, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 16000];
  let isPlaying = false;
  let firstPlay = true;

  // Создаём аудиоконтекст один раз
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audioElement);

  // Эквалайзерные фильтры
  const filters = frequencies.map(freq => {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;
    filter.gain.value = 0;
    return filter;
  });

  // Аудио-анализатор
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Соединяем: source → filters → analyser → destination
  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  });
  source.connect(filters[0]);
  filters[filters.length - 1].connect(analyser);
  analyser.connect(audioCtx.destination);

  // Обработка слайдеров
  sliders.forEach((slider, i) => {
    slider.addEventListener("input", (e) => {
      const gain = parseFloat(e.target.value);
      filters[i].gain.value = gain;
    });
  });

  // Обновление прогресса
  audioElement.addEventListener("timeupdate", () => {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    const norm = gsap.utils.normalize(0, 100);
    gsap.to(progressBar, { scaleX: norm(percent), duration: 0.2 });
  });

  // Визуализация
  function renderFrame() {
    if (isPlaying) requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalized = avg / 255;
    gsap.set(visualizerBar, { scaleY: normalized * 0.85 });
  }

  // Переключение воспроизведения
  function toggleAudio() {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      gsap.to('.pause-icon', { opacity: 0, scale: 0.8, duration: 0.2 });
      gsap.to('.play-icon', { opacity: 1, scale: 1, duration: 0.2 });
      gsap.to(visualizerBar, { scaleY: 0, duration: 0.2 });
      return;
    }

    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }

    audioElement.play();
    isPlaying = true;

    gsap.to('.play-icon', { opacity: 0, scale: 0.8, duration: 0.2 });
    gsap.to('.pause-icon', { opacity: 1, scale: 1, duration: 0.2 });

    if (firstPlay) {
      firstPlay = false;
      renderFrame();
    } else {
      renderFrame(); // продолжаем визуализацию
    }
  }

  // Обработчики
  playToggle.addEventListener("click", toggleAudio);
  audioElement.addEventListener("ended", () => {
    isPlaying = false;
    audioElement.currentTime = 0;
    gsap.to('.pause-icon', { opacity: 0, scale: 0.8, duration: 0.2 });
    gsap.to('.play-icon', { opacity: 1, scale: 1, duration: 0.2 });
    gsap.to(visualizerBar, { scaleY: 0, duration: 0.2 });
  });

  // Гарантируем запуск контекста по клику
  document.addEventListener("click", () => {
    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }
  });

  const saveButton = document.getElementById('save-eq-settings');
  const resetButton = document.getElementById('reset-eq-settings');

  // Загрузка сохранённых настроек, если есть
  const savedGains = JSON.parse(localStorage.getItem('equalizerGains'));
  if (savedGains && savedGains.length === sliders.length) {
    sliders.forEach((slider, i) => {
      slider.value = savedGains[i];
      filters[i].gain.value = parseFloat(savedGains[i]);
    });
  }

  // Сохранение текущих значений
  saveButton.addEventListener('click', () => {
    const currentGains = Array.from(sliders).map(slider => slider.value);
    localStorage.setItem('equalizerGains', JSON.stringify(currentGains));
    alert('Настройки эквалайзера сохранены!');
  });

  // Сброс настроек
  resetButton.addEventListener('click', () => {
    sliders.forEach((slider, i) => {
      slider.value = 0;
      filters[i].gain.value = 0;
    });
    localStorage.removeItem('equalizerGains');
    alert('Настройки эквалайзера сброшены по умолчанию.');
  });
});
