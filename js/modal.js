// const modal = document.getElementById("modal");
// const hamburger = document.getElementById("hamburger");
// const closeModal = document.getElementById("closeModal");

// hamburger.addEventListener("click", () => {
//   modal.classList.add("active");
//   document.body.classList.add("modal-open");
// });

// closeModal.addEventListener("click", () => {
//   modal.classList.remove("active");
//   document.body.classList.remove("modal-open");
// });

const modal = document.getElementById("modal");
const hamburger = document.getElementById("hamburger");
const closeModal = document.getElementById("closeModal");

hamburger.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.classList.add("modal-open"); // блокируем скролл фона
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open"); // разблокируем скролл
});

// Дополнительно — закрытие по нажатию на ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
});

// Дополнительно — закрытие по клику вне содержимого
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
});
