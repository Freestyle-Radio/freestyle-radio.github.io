  // Частоты эквалайзера (в Гц)
  const frequencies = [
    32, 64, 125, 250, 500, 630, 800, 1000,
    1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 16000
  ];

  // Инициализация AudioContext
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioElement = document.getElementById('audio');
  const track = audioCtx.createMediaElementSource(audioElement);

  // Создание фильтров
  const filters = frequencies.map(freq => {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;         // ширина полосы
    filter.gain.value = 0;      // усиление по умолчанию
    return filter;
  });

  // Соединение фильтров в цепочку
  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  });

  // Подключение к выходу
  filters[filters.length - 1].connect(audioCtx.destination);
  track.connect(filters[0]);

  // Привязка ползунков к фильтрам
  const sliders = document.querySelectorAll('.equalizer .band input[type="range"]');
  sliders.forEach((slider, index) => {
    slider.addEventListener('input', (e) => {
      const gain = parseFloat(e.target.value);
      filters[index].gain.value = gain;
    });
  });

  // Автоматически запускаем контекст при взаимодействии
  document.addEventListener('click', () => {
    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }
  });
