"use strict";
(() => {
  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\clipboard.ts
  function createCopyText() {
    if (navigator.clipboard) {
      return (text) => navigator.clipboard.writeText(text);
    }
    return (text) => new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      if (document.execCommand("copy")) {
        document.body.removeChild(input);
        resolve();
      } else {
        reject(new Error("Copy failed"));
      }
    });
  }

  // <stdin>
  var copyText = createCopyText();
  function initLinkGuard() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("target");
    const $target = document.querySelector(".target");
    const $copy = document.querySelector(".copy-icon-btn");
    const $confirm = document.querySelector(".confirm-btn");
    if (!target) {
      $target.textContent = "Invalid target URL";
      return;
    }
    $target.textContent = target;
    $copy.disabled = false;
    $confirm.disabled = false;
    $copy.addEventListener("click", () => {
      copyText(target).then(() => {
        $copy.toggleAttribute("data-copied", true);
        window.setTimeout(() => {
          $copy.toggleAttribute("data-copied", false);
        }, 2e3);
      }, () => {
        console.error("Clipboard write failed!", "Your browser does not support clipboard API!");
      });
    });
    $confirm.addEventListener("click", () => {
      window.location.href = target;
    });
  }
  document.addEventListener("DOMContentLoaded", initLinkGuard, false);
})();
//# sourceMappingURL=link.js.map
