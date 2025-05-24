  (function() {
    const audio = document.getElementById("audio");
    let hasStarted = false;
    let retryTimeout = null;

    // Зафиксируем, что пользователь один раз запустил радио
    audio.addEventListener("playing", () => {
      hasStarted = true;
    });

    // Обработка ошибок, зависаний или остановки
    const handleStreamInterruption = () => {
      if (hasStarted) {
        console.warn("Аудио поток прервался. Перезагрузка страницы...");
        // Перезагрузка через 2 секунды (можно настроить)
        retryTimeout = setTimeout(() => {
          location.reload();
        }, 2000);
      }
    };

    // Возможные события потери потока
    audio.addEventListener("stalled", handleStreamInterruption);
    audio.addEventListener("error", handleStreamInterruption);
    audio.addEventListener("ended", handleStreamInterruption);
  })();
