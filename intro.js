const INTRO_DURATION = 4800;

const intro = document.getElementById("intro");
const progressBar = document.getElementById("introProgress");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const duration = prefersReducedMotion ? 1200 : INTRO_DURATION;
let hasRedirected = false;

const redirect = () => {
  if (hasRedirected) return;
  hasRedirected = true;

  intro?.classList.add("is-exiting");
  sessionStorage.setItem("introComplete", "1");
  window.setTimeout(() => {
    window.location.href = "main.html";
  }, prefersReducedMotion ? 200 : 650);
};

if (progressBar) {
  progressBar.style.transitionDuration = `${duration}ms`;
  requestAnimationFrame(() => {
    progressBar.style.width = "100%";
  });
}

window.setTimeout(redirect, duration);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    redirect();
  }
});
