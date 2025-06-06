const modal = document.getElementById("modal");
const hamburger = document.getElementById("hamburger");
const closeModal = document.getElementById("closeModal");

hamburger.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.classList.add("modal-open");
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
});

