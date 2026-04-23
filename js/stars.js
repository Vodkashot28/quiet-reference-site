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
    { count: 80,  r: 0.4, a: 0.18, scroll: 0.2, mouse: 2  }, // far (0.2x scroll)
    { count: 50,  r: 0.9, a: 0.55, scroll: 0.5, mouse: 5  }, // mid (0.5x scroll)
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

  function drawNebula(isDark, scrollOffset) {
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.38 + scrollOffset * 0.2;
    const r  = Math.max(canvas.width, canvas.height) * 0.55;
    const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    if (isDark) {
      g.addColorStop(0,   "rgba(60,40,100,0.18)");
      g.addColorStop(0.5, "rgba(30,20,60,0.08)");
      g.addColorStop(1,   "rgba(0,0,0,0)");
    } else {
      g.addColorStop(0,   "rgba(180,160,220,0.10)");
      g.addColorStop(0.5, "rgba(160,140,200,0.04)");
      g.addColorStop(1,   "rgba(0,0,0,0)");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawMesh(isDark) {
    const w = canvas.width, h = canvas.height;
    // Two diagonal linear gradients overlaid to create a colour-mesh feel
    const g1 = ctx.createLinearGradient(0, 0, w, h);
    const g2 = ctx.createLinearGradient(w, 0, 0, h);
    if (isDark) {
      g1.addColorStop(0,   "rgba(20,10,50,0.22)");
      g1.addColorStop(1,   "rgba(10,30,60,0.12)");
      g2.addColorStop(0,   "rgba(50,10,40,0.10)");
      g2.addColorStop(1,   "rgba(10,40,50,0.08)");
    } else {
      g1.addColorStop(0,   "rgba(220,210,240,0.12)");
      g1.addColorStop(1,   "rgba(210,230,245,0.06)");
      g2.addColorStop(0,   "rgba(240,215,230,0.08)");
      g2.addColorStop(1,   "rgba(215,235,240,0.05)");
    }
    ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
  }

  function drawVignette(isDark) {
    const w = canvas.width, h = canvas.height;
    const r = Math.sqrt(w * w + h * h) * 0.5;
    const g = ctx.createRadialGradient(w/2, h/2, r * 0.35, w/2, h/2, r);
    const edge = isDark ? "rgba(0,0,0,0.72)" : "rgba(200,195,215,0.45)";
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, edge);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark    = document.documentElement.getAttribute("data-theme") === "dark";
    drawNebula(isDark, scrollY);
    drawMesh(isDark);
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

    drawVignette(isDark);
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", init);
  init();
  draw();
});
