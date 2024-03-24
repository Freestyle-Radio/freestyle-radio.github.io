const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

// trigger the slide in
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// checks to see if a link has been clicked to hide the nav
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);