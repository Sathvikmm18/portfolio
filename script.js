const header = document.querySelector(".site-header");
const canvas = document.getElementById("spaceCanvas");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const initSpaceScene = () => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frameId = 0;
  let time = 0;

  const stars = [];
  const orbits = [
    { rx: 220, ry: 78, tilt: 0.42, speed: 0.34, hue: 210, bodies: 3 },
    { rx: 320, ry: 112, tilt: -0.28, speed: 0.22, hue: 280, bodies: 4 },
    { rx: 430, ry: 148, tilt: 0.62, speed: 0.16, hue: 350, bodies: 5 },
    { rx: 540, ry: 190, tilt: -0.52, speed: 0.11, hue: 165, bodies: 6 },
    { rx: 660, ry: 230, tilt: 0.18, speed: 0.08, hue: 45, bodies: 4 },
    { rx: 780, ry: 270, tilt: -0.72, speed: 0.06, hue: 320, bodies: 3 },
  ];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.length = 0;
    const starCount = Math.floor((width * height) / 5200);
    for (let i = 0; i < starCount; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.75 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  };

  const drawStars = () => {
    for (const star of stars) {
      const flicker = 0.55 + Math.sin(time * 0.002 + star.twinkle) * 0.45;
      ctx.fillStyle = `rgba(230, 238, 255, ${star.alpha * flicker})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawOrbit = (orbit, index) => {
    const cx = width * 0.52;
    const cy = height * 0.48;
    const scale = Math.min(width, height) / 980;
    const rx = orbit.rx * scale;
    const ry = orbit.ry * scale;
    const rotation = orbit.tilt + time * 0.00008 * (index % 2 === 0 ? 1 : -1);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    ctx.strokeStyle = `hsla(${orbit.hue}, 82%, 68%, 0.22)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `hsla(${orbit.hue}, 90%, 72%, 0.08)`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < orbit.bodies; i += 1) {
      const angle = time * orbit.speed * 0.001 + (Math.PI * 2 * i) / orbit.bodies;
      const x = Math.cos(angle) * rx;
      const y = Math.sin(angle) * ry;
      const depth = (Math.sin(angle) + 1) / 2;
      const radius = 2.4 + depth * 2.8;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
      glow.addColorStop(0, `hsla(${orbit.hue}, 95%, 78%, ${0.35 + depth * 0.45})`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${orbit.hue}, 88%, ${58 + depth * 22}%, ${0.65 + depth * 0.35})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawNebula = () => {
    const cx = width * 0.52;
    const cy = height * 0.48;
    const pulse = 0.85 + Math.sin(time * 0.0007) * 0.15;

    const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.55 * pulse);
    nebula.addColorStop(0, "rgba(71, 163, 255, 0.14)");
    nebula.addColorStop(0.35, "rgba(120, 80, 255, 0.08)");
    nebula.addColorStop(0.65, "rgba(255, 75, 97, 0.05)");
    nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, width, height);
  };

  const render = () => {
    time += prefersReducedMotion ? 0 : 16;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#04050a");
    bg.addColorStop(0.45, "#080b14");
    bg.addColorStop(1, "#030408");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawNebula();
    drawStars();

    orbits.forEach((orbit, index) => {
      drawOrbit(orbit, index);
    });

    if (!prefersReducedMotion) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  resize();
  render();
  window.addEventListener("resize", resize, { passive: true });

  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
  };
};

initSpaceScene();
