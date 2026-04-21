document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "stars";
  Object.assign(canvas.style, {
    position: "fixed", top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none", zIndex: -1
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.4,
      speed: Math.random() * 0.03 + 0.01
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const color = isDark ? "255,255,255" : "80,80,120";
    const maxAlpha = isDark ? 0.95 : 0.35;
    const minAlpha = isDark ? 0.3 : 0.08;

    stars.forEach(s => {
      s.a += (Math.random() - 0.5) * s.speed;
      s.a = Math.max(minAlpha, Math.min(maxAlpha, s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${s.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", init);
  init();
  draw();
});
