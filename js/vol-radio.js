const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume');

// Проверка ширины экрана: включаем управление только на ноутах и ПК
if (window.innerWidth >= 768) {
// Установка начальной громкости
    audio.volume = 0.3;
    volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });
}
