const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume');

// Установка начальной громкости
audio.volume = 0.3;

// Установка громкости при изменении ползунка
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

