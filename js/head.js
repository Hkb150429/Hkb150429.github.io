"use strict";
(() => {
  // ns-hugo-params:C:\Users\13929\blog\themes\FixIt\assets\js\head\color-scheme.ts
  var color_scheme_default = { defaultTheme: "auto" };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\head\color-scheme.ts
  function initColorScheme() {
    const localStorage = window.localStorage;
    const storedMode = localStorage?.getItem("theme-mode");
    const themeMode = storedMode || (color_scheme_default.defaultTheme === "light" || color_scheme_default.defaultTheme === "dark" ? color_scheme_default.defaultTheme : "auto");
    document.documentElement.dataset.themeMode = themeMode;
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\head\platform.ts
  function initPlatform() {
    if (/mac/i.test(navigator.platform)) {
      document.documentElement.dataset.platform = "mac";
    }
  }

  // <stdin>
  initColorScheme();
  initPlatform();
})();
//# sourceMappingURL=head.js.map
