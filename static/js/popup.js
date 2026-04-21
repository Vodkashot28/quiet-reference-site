(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1]);
