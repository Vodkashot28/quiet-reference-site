document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.createElement("canvas");
  canvas.id = "stars";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none", zIndex: -1
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // Three layers: [count, radius, alpha, scrollSpeed, mouseSpeed]
  const LAYERS = [
    { count: 80,  r: 0.6, a: 0.25, scroll: 0.1, mouse: 2  }, // far
    { count: 50,  r: 1.1, a: 0.55, scroll: 0.3, mouse: 5  }, // mid
    { count: 25,  r: 1.8, a: 0.95, scroll: 1.0, mouse: 10 }, // near (foreground, 1:1 scroll)
  ];

  let stars = [];
  let mouse = { x: 0, y: 0 };
  let scrollY = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    stars = LAYERS.flatMap(layer =>
      Array.from({ length: layer.count }, () => ({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      layer.r + Math.random() * 0.4,
        a:      layer.a,
        speed:  Math.random() * 0.02 + 0.008,
        scroll: layer.scroll,
        mouse:  layer.mouse,
      }))
    );
  }

  if (!reduced) {
    window.addEventListener("mousemove", e => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
    }, { passive: true });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark    = document.documentElement.getAttribute("data-theme") === "dark";
    const color     = isDark ? "255,255,255" : "80,80,120";
    const alphaScale = isDark ? 1 : 0.4;

    stars.forEach(s => {
      // twinkle
      s.a += (Math.random() - 0.5) * s.speed;
      s.a = Math.max(0.05, Math.min(0.95, s.a));

      const ox = reduced ? 0 : mouse.x * s.mouse;
      const oy = reduced ? 0 : mouse.y * s.mouse + scrollY * s.scroll;

      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${s.a * alphaScale})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", init);
  init();
  draw();
});
