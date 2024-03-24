function init() {
  const audioPlayer = document.querySelector('.audio-player');
  let currentTime = audioPlayer.querySelector('.current-time');
  const totalTime = audioPlayer.querySelector('.total-time');
  const audioPlayerControlPlay = document.querySelector('.audio-controls__play-toggle');
  let firstPlay = true;
  let isPlaying = false;
  
  let context;
  let src;
  let analyser;
  let bufferLength;
  let dataArray;
  
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayerControlPlay.addEventListener('click', event => {
    toggleAudio();
  });
  audioPlayer.addEventListener('progress', updateProgress);
  audioPlayer.addEventListener('ended', audioComplete);
  
  function audioComplete() {
    isPlaying = false;
    audioPlayer.currentTime = 0;
    
    gsap.to('.pause-icon', {opacity: 0, scale: 0.8, duration: 0.2, ease: 'back.out(1.7)'});
    gsap.to('.play-icon', {opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)'});
    gsap.to('.visualizer-bar', {scaleY: 0, duration: 0.2, ease: 'power4.inOut'});
  }
  
  function updateProgress() {
    let current = audioPlayer.currentTime;
    let percent = (current / audioPlayer.duration) * 100;
    let normalize = gsap.utils.normalize(0, 100);
    
    gsap.to('.audio-controls__current-progress', {scaleX: normalize(percent), duration: 0.2})
  }

  function toggleAudio() {
    
    if (isPlaying === true) {
      audioPlayer.pause();
      audioPlayer.classList.remove("playing");

      isPlaying = false;
      gsap.to('.visualizer-bar', {scaleY: 0, duration: 0.2, ease: 'power4.inOut'});
      gsap.to('.pause-icon', {opacity: 0, scale: 0.8, duration: 0.2, ease: 'back.out(1.7)'});
      gsap.to('.play-icon', {opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)'});
      return;
    }
    
    audioPlayer.play();
    audioPlayer.classList.add("playing");
    gsap.to('.pause-icon', {opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)'});
    gsap.to('.play-icon', {opacity: 0, scale: 0.8, duration: 0.2, ease: 'back.out(1.7)'});
    
    isPlaying = true;
    
    if (firstPlay) {
      context = new AudioContext();
      src = context.createMediaElementSource(audioPlayer);
      analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 32;

      bufferLength = analyser.frequencyBinCount;

      dataArray = new Uint8Array(bufferLength);
      
      firstPlay = false;
    }
    
    function renderFrame() {
      if (isPlaying) {
        requestAnimationFrame(renderFrame);
      }

      // Feed Data into Analyser
      analyser.getByteFrequencyData(dataArray);
      
      // Average the soundform data coming in
      const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
      const dataArrayAverage = average( dataArray );
      
      // Normalize Data Between 0-1
      let normalizeData = gsap.utils.normalize(0, 255);
      
      // Bar height is set to average of soundforms
      barHeight = normalizeData(dataArrayAverage) * 0.85;
      gsap.set('.visualizer-bar', {scaleY: barHeight});
    }
    
    renderFrame();
  }
}

init();