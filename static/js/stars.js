(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
  let stars = [], mouse = { x: 0, y: 0 };

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
      speed: Math.random() * 0.03 + 0.01,
      depth: Math.random() * 0.6 + 0.2   // parallax layer 0.2–0.8
    }));
  }

  if (!reduced) {
    window.addEventListener("mousemove", e => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 to 1
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const color    = isDark ? "255,255,255" : "80,80,120";
    const maxAlpha = isDark ? 0.95 : 0.35;
    const minAlpha = isDark ? 0.3  : 0.08;

    stars.forEach(s => {
      // twinkle
      s.a += (Math.random() - 0.5) * s.speed;
      s.a = Math.max(minAlpha, Math.min(maxAlpha, s.a));

      // parallax offset — deeper stars drift less
      const ox = reduced ? 0 : mouse.x * s.depth * 8;
      const oy = reduced ? 0 : mouse.y * s.depth * 8;

      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${s.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", init);
  init();
  draw();
});

},{}]},{},[1]);
