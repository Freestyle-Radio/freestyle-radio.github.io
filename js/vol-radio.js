const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume');

// Установка начальной громкости
audio.volume = 0.3;

// Проверка ширины экрана: включаем управление только на ноутах и ПК
if (window.innerWidth >= 768) {
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });
}
