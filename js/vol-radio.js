const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume');

// Установка громкости при изменении ползунка
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

