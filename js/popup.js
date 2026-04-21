document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("article p").forEach(p => {
    p.style.cursor = "pointer";
    p.title = "Click to copy";

    p.addEventListener("click", () => {
      navigator.clipboard.writeText(p.innerText.trim()).then(() => {
        const tip = document.createElement("span");
        tip.textContent = "copied";
        Object.assign(tip.style, {
          position: "fixed", bottom: "1.5rem", right: "1.5rem",
          background: "var(--accent)", color: "#fff",
          padding: "0.3rem 0.8rem", borderRadius: "4px",
          fontSize: "0.8rem", opacity: "1", transition: "opacity 0.5s"
        });
        document.body.appendChild(tip);

        setTimeout(() => { tip.style.opacity = "0"; }, 1200);
        setTimeout(() => tip.remove(), 1800);
      });
    });
  });
});
