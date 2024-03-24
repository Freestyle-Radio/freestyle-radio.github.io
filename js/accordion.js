// Находим кнопку с вопросом
const question = document.querySelector('.question');
// Добавляем слушатель на клик 
question.addEventListener('click', ({ target }) => {
  // Меняем состояние кнопки
  target.classList.toggle('is-active');
});
