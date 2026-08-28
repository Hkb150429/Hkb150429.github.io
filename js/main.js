"use strict";
(() => {
  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\core\banner.ts
  function printBanner(version) {
    const color = "#FF735A";
    console.log(
      `%c FixIt ${version} %c https://github.com/hugo-fixit %c`,
      `background: ${color}; border: 1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border: 1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      "background: transparent;"
    );
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\core\event-bus.ts
  var TypedEventBus = class {
    #target = document;
    on(event, handler) {
      this.#target.addEventListener(event, handler);
    }
    off(event, handler) {
      this.#target.removeEventListener(event, handler);
    }
    emit(event, ...args) {
      const detail = args[0];
      this.#target.dispatchEvent(
        detail !== void 0 ? new CustomEvent(event, { detail }) : new CustomEvent(event)
      );
    }
  };
  var eventBus = new TypedEventBus();

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\animation.ts
  function animateCSS(element, animation, reserved, callback) {
    const animations = Array.isArray(animation) ? animation : [animation];
    element.classList.add("animate__animated", ...animations);
    element.addEventListener("animationend", () => {
      !reserved && element.classList.remove("animate__animated", ...animations);
      typeof callback === "function" && callback();
    }, { once: true });
  }

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

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\dom.ts
  function isRTL() {
    return document.documentElement.dir === "rtl";
  }
  function getScrollTop() {
    return (document.documentElement ?? document.body).scrollTop;
  }
  function scrollIntoView(selector) {
    const element = selector.startsWith("#") ? document.getElementById(selector.slice(1)) : document.querySelector(selector);
    element?.scrollIntoView({
      behavior: "smooth"
    });
  }
  function getStagingDOM() {
    const stagingElement = document.createElement("div");
    stagingElement.style.display = "none";
    stagingElement.dataset.stagingId = Math.random().toString(36).slice(2);
    document.body.appendChild(stagingElement);
    return {
      $el: stagingElement,
      stage(dom) {
        stagingElement.innerHTML = "";
        stagingElement.appendChild(dom);
      },
      contentAsHtml() {
        return stagingElement.innerHTML;
      },
      contentAsText() {
        return stagingElement.textContent ?? "";
      },
      contentAsJson() {
        return JSON.parse(stagingElement.innerHTML);
      },
      destroy() {
        document.body.removeChild(stagingElement);
      }
    };
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\file.ts
  function downloadAsFile(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(/[\\/:*?"<>|\r\n]+/g, "-");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\media.ts
  function isMobile() {
    return window.matchMedia("only screen and (max-width: 680px)").matches;
  }
  function isTocStatic() {
    return document.getElementById("toc-static")?.dataset?.kept === "true" || window.matchMedia("only screen and (max-width: 960px)").matches;
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\string.ts
  function applyHighlightToText(text, indices, highlightTag) {
    let offset = 0;
    for (let i = 0; i < indices.length; i++) {
      const substr = text.substring(indices[i][0] + offset, indices[i][1] + 1 + offset);
      const tag = `<${highlightTag}>${substr}</${highlightTag}>`;
      text = text.substring(0, indices[i][0] + offset) + tag + text.substring(indices[i][1] + 1 + offset, text.length);
      offset += highlightTag.length * 2 + 5;
    }
    return text;
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\theme.ts
  function getThemeMode() {
    return document.documentElement.dataset.themeMode || "auto";
  }
  function isDarkMode() {
    const themeMode = getThemeMode();
    return themeMode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches : themeMode === "dark";
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\tooltip.ts
  function flashTooltip(el, message, duration = 3e3) {
    const CellTooltip3 = window.CellTooltip;
    const originalTitle = el.dataset.ctTitle;
    el.dataset.ctTitle = message;
    const instance = CellTooltip3.getOrCreateInstance(el);
    instance.refresh();
    instance.show();
    setTimeout(() => {
      el.dataset.ctTitle = originalTitle ?? "";
      instance.hide();
    }, duration);
  }
  function flashCopiedTooltip(btn, duration = 2e3) {
    btn.toggleAttribute("data-copied", true);
    flashTooltip(btn, btn.dataset.copiedText ?? "", duration);
    setTimeout(() => btn.toggleAttribute("data-copied", false), duration);
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\validate.ts
  function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\code.ts
  var CellTooltip = window.CellTooltip;
  var copyText = createCopyText();
  var CodeModule = class {
    #fullscreenAbort;
    constructor() {
    }
    /**
     * Attach copy-to-clipboard behaviour to a code block.
     * @param codeBlock - The `.code-block` container element.
     * @param codePreEl - The `<pre>` element containing the code text.
     */
    initCopyCode(codeBlock, codePreEl) {
      const copyBtn = codeBlock.dataset.mode === "classic" ? codeBlock.querySelector(".code-header .copy-btn") : codeBlock.querySelector(".copy-icon-btn");
      if (codeBlock.dataset.copyable !== "true" || !copyBtn)
        return;
      copyBtn.addEventListener("click", () => {
        const iswWrap = codeBlock.classList.contains("line-wrapping");
        const highlightLines = codeBlock.querySelectorAll(".hl");
        iswWrap && codeBlock.classList.toggle("line-wrapping");
        highlightLines.forEach(($hl) => {
          $hl.classList.toggle("hl");
        });
        copyText(codePreEl.textContent.trim()).then(() => {
          animateCSS(codePreEl, "animate__flash");
          iswWrap && codeBlock.classList.toggle("line-wrapping");
          highlightLines.forEach(($hl) => {
            $hl.classList.toggle("hl");
          });
          flashCopiedTooltip(copyBtn);
        }, () => {
          console.error("Clipboard write failed!", "Your browser does not support clipboard API!");
        });
      }, false);
    }
    /**
     * Attach toggle behaviour to the code expand/collapse button.
     * @param codeBlock - The `.code-block` container element.
     */
    initCodeExpandBtn(codeBlock) {
      codeBlock.querySelector(".code-expand-btn")?.addEventListener("click", () => {
        codeBlock.classList.toggle("is-expanded");
      }, false);
    }
    /**
     * Attach download behaviour to a code block's download button.
     * @param codeBlock - The `.code-block` container element.
     * @param codePreEl - The `<pre>` element containing the code text.
     */
    initDownloadCode(codeBlock, codePreEl) {
      const downloadBtn = codeBlock.querySelector(".code-header .download-btn");
      if (!downloadBtn)
        return;
      downloadBtn.addEventListener("click", () => {
        const $codeHeader = codeBlock.querySelector(".code-header");
        const name = codeBlock.dataset.name?.trim();
        const language = Array.from($codeHeader?.classList || []).find((className) => className.startsWith("language-"))?.replace("language-", "");
        const ext = language && language !== "fallback" ? language : "txt";
        const fallbackName = name ? name.includes(".") ? name : `${name}.${ext}` : `code.${ext}`;
        const fileName = codeBlock.getAttribute("filename")?.trim();
        downloadAsFile(codePreEl.textContent, fileName || fallbackName);
        downloadBtn.toggleAttribute("data-downloaded", true);
        downloadBtn.classList.toggle("fa-spin", true);
        setTimeout(() => {
          downloadBtn.toggleAttribute("data-downloaded", false);
          downloadBtn.classList.toggle("fa-spin", false);
        }, 300);
      }, false);
    }
    /**
     * Get the fullscreen target element (parent `.code-tabs` or the block itself).
     * @param codeBlock - The `.code-block` element.
     * @returns The element to apply fullscreen to.
     */
    #getCodeFullscreenTarget(codeBlock) {
      return codeBlock.closest(".code-tabs") || codeBlock;
    }
    /**
     * Toggle fullscreen state and update button tooltips.
     * @param codeBlock - The `.code-block` element.
     * @param show - `true` to enter fullscreen, `false` to exit.
     */
    #setCodeFullscreenState(codeBlock, show) {
      const target = this.#getCodeFullscreenTarget(codeBlock);
      const expandBtn = codeBlock.querySelector(".code-expand-btn");
      if (show && expandBtn) {
        codeBlock.dataset.fullscreenExpanded = codeBlock.classList.contains("is-expanded") ? "true" : "false";
        codeBlock.classList.add("is-expanded");
      }
      if (!show && target.classList.contains("is-fullscreen")) {
        target.classList.add("instant-height");
        window.requestAnimationFrame(() => target.classList.remove("instant-height"));
        if (expandBtn && codeBlock.dataset.fullscreenExpanded === "false") {
          codeBlock.classList.remove("is-expanded");
        }
        delete codeBlock.dataset.fullscreenExpanded;
      }
      target.classList.toggle("is-fullscreen", show);
      const btn = target.querySelector(".tabs-actions .fullscreen-btn") || codeBlock.querySelector(".code-header .fullscreen-btn");
      if (!btn)
        return;
      const exitTitle = btn.dataset.exitTitle || btn.getAttribute("data-exit-title") || btn.title;
      const originalTitle = btn.dataset.ctOriginalTitle || btn.dataset.ctTitle || btn.title;
      btn.dataset.ctOriginalTitle = originalTitle;
      btn.dataset.ctTitle = show ? exitTitle : originalTitle;
      const instance = CellTooltip.getOrCreateInstance(btn);
      instance.hide();
    }
    /** Exit fullscreen on the currently active code block. */
    closeCodeFullscreen() {
      const $activeTabs = document.querySelector(".code-tabs.is-fullscreen");
      if ($activeTabs) {
        const $activeBlock2 = $activeTabs.querySelector(".code-block.active") || $activeTabs.querySelector(".code-block");
        if ($activeBlock2)
          this.#setCodeFullscreenState($activeBlock2, false);
        return;
      }
      const $activeBlock = document.querySelector(".code-block.highlight.is-fullscreen");
      if ($activeBlock)
        this.#setCodeFullscreenState($activeBlock, false);
    }
    /**
     * Attach fullscreen toggle and Escape-key handler to a code block.
     * @param codeBlock - The `.code-block` container element.
     */
    initFullscreenCode(codeBlock) {
      const fullscreenBtn = codeBlock.querySelector(".code-header .fullscreen-btn");
      if (!fullscreenBtn)
        return;
      fullscreenBtn.addEventListener("click", () => {
        const target = this.#getCodeFullscreenTarget(codeBlock);
        const show = !target.classList.contains("is-fullscreen");
        if (show) {
          this.closeCodeFullscreen();
          codeBlock.classList.remove("is-collapsed");
        }
        this.#setCodeFullscreenState(codeBlock, show);
      }, false);
      if (!this.#fullscreenAbort) {
        this.#fullscreenAbort = new AbortController();
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape")
            this.closeCodeFullscreen();
        }, { signal: this.#fullscreenAbort.signal });
      }
    }
    /** Initialize all un-initialized code blocks on the page. */
    initCodeWrapper() {
      const $codeBlocks = document.querySelectorAll(".code-block.highlight:not([data-init])");
      $codeBlocks.forEach(($codeBlock) => {
        const $preElements = $codeBlock.querySelectorAll("pre.chroma");
        if (!$preElements.length)
          return;
        const $codePreEl = $preElements[$preElements.length - 1];
        $codeBlock.dataset.init = "true";
        this.initCopyCode($codeBlock, $codePreEl);
        this.initCodeExpandBtn($codeBlock);
        if ($codeBlock.dataset.mode === "classic") {
          const $codeHeader = $codeBlock.querySelector(".code-header");
          if (!$codeHeader)
            return;
          this.initDownloadCode($codeBlock, $codePreEl);
          this.initFullscreenCode($codeBlock);
          $codeHeader.querySelector(".code-title").addEventListener("click", () => {
            if ($codeBlock.classList.contains("is-fullscreen"))
              return;
            $codeBlock.classList.toggle("is-collapsed");
          }, false);
          $codeHeader.querySelector(".ellipses-btn").addEventListener("click", () => {
            $codeBlock.classList.remove("is-collapsed");
          }, false);
          $codeHeader.querySelector(".line-nos-btn")?.addEventListener("click", () => {
            $codeBlock.classList.toggle("line-nos-hidden");
          }, false);
          $codeHeader.querySelector(".line-wrap-btn")?.addEventListener("click", () => {
            if ($codeBlock.querySelector('[contenteditable="true"]'))
              return;
            $codeBlock.classList.toggle("line-wrapping");
          }, false);
          if ($codeBlock.dataset.editable === "true") {
            $codeHeader.querySelector(".edit-btn")?.addEventListener("click", () => {
              const isEditable = $codePreEl.getAttribute("contenteditable") === "true";
              if (isEditable) {
                $codePreEl.setAttribute("contenteditable", "false");
                $codePreEl.blur();
              } else {
                $codeBlock.querySelectorAll(".hl").forEach(($hl) => {
                  $hl.classList.remove("hl");
                });
                $codeBlock.classList.add("is-expanded");
                $codeBlock.classList.remove("line-wrapping");
                $codePreEl.setAttribute("contenteditable", "true");
                $codePreEl.focus();
              }
            }, false);
          }
        }
      });
    }
    /** Group consecutive code blocks into tabbed containers with language sync. */
    initCodeTabs() {
      const $codeBlocks = document.querySelectorAll(".code-block[group]:not([data-tab-init])");
      const processed = /* @__PURE__ */ new Set();
      const normalizeTabTitle = (title = "") => title.toLowerCase();
      $codeBlocks.forEach(($block) => {
        if (processed.has($block))
          return;
        const groupName = $block.getAttribute("group");
        const $tabs = [];
        let $curr = $block;
        while ($curr && $curr.classList?.contains("code-block") && $curr.getAttribute("group") === groupName) {
          $tabs.push($curr);
          processed.add($curr);
          $curr = $curr.nextElementSibling;
        }
        if ($tabs.length < 2)
          return;
        const $container = document.createElement("div");
        $container.className = "code-tabs";
        const $header = document.createElement("div");
        $header.className = "tabs-header";
        const $items = document.createElement("div");
        $items.className = "tabs-items";
        const $actions = document.createElement("div");
        $actions.className = "tabs-actions";
        $header.appendChild($items);
        $header.appendChild($actions);
        const $content = document.createElement("div");
        $content.className = "tabs-content";
        const $firstBlock = $tabs[0];
        $firstBlock.parentNode.insertBefore($container, $firstBlock);
        const activeTabIndex = $tabs.findIndex((tab) => tab.classList.contains("active"));
        const langPref = window.localStorage.getItem("config_lang_perf");
        const hasCodeToggle = $tabs.some((tab) => tab.dataset.codeToggle === "true");
        const langPrefIndex = langPref && hasCodeToggle ? $tabs.findIndex((tab) => tab.dataset.tabTitle.toLowerCase() === langPref) : -1;
        const resolvedIndex = langPrefIndex !== -1 ? langPrefIndex : activeTabIndex;
        const beforeTabs = $tabs[0]?.getAttribute("before_tabs");
        if (beforeTabs) {
          const $before = document.createElement("span");
          $before.className = "before-tabs";
          $before.textContent = beforeTabs;
          $items.appendChild($before);
        }
        const tabButtons = [];
        const toggleLangToIndex = /* @__PURE__ */ new Map();
        const switchToTab = (index) => {
          const $nextTab = $tabs[index];
          const $nextBtn = tabButtons[index];
          if (!$nextTab || !$nextBtn)
            return;
          const $activeTab = $tabs.find((t) => t.classList.contains("active"));
          if ($activeTab) {
            const $activeHeader = $activeTab.querySelector(".code-header");
            if ($activeHeader) {
              Array.from($actions.children).forEach((btn) => $activeHeader.appendChild(btn));
            }
          }
          tabButtons.forEach((b) => b.classList.remove("active"));
          $nextBtn.classList.add("active");
          $tabs.forEach((b) => b.classList.remove("active"));
          $nextTab.classList.add("active");
          const shadowMode = $nextTab?.dataset.shadow;
          if (shadowMode) {
            $container.dataset.shadow = shadowMode;
          } else {
            delete $container.dataset.shadow;
          }
          const $codeHeader = $nextTab.querySelector(".code-header");
          if ($codeHeader) {
            $codeHeader.querySelectorAll(".action-btn").forEach((btn) => $actions.appendChild(btn));
          }
        };
        eventBus.on("fixit:code-tab-sync", ({ detail }) => {
          if (!detail.lang || detail.source === $container)
            return;
          const index = toggleLangToIndex.get(detail.lang);
          index !== void 0 && switchToTab(index);
        });
        $tabs.forEach(($tab, index) => {
          const title = $tab.dataset.tabTitle || "Code";
          const defaultActiveTab = resolvedIndex === -1 && index === 0;
          const $btn = document.createElement("span");
          $btn.className = "tab-item";
          if (defaultActiveTab)
            $btn.classList.add("active");
          $btn.textContent = title;
          $btn.dataset.index = String(index);
          $btn.title = title;
          tabButtons.push($btn);
          const normalizedTitle = normalizeTabTitle(title);
          if (!toggleLangToIndex.has(normalizedTitle)) {
            toggleLangToIndex.set(normalizedTitle, index);
          }
          $btn.addEventListener("click", () => {
            if ($tab.dataset.codeToggle === "true") {
              window.localStorage.setItem("config_lang_perf", normalizedTitle);
              eventBus.emit("fixit:code-tab-sync", { lang: normalizedTitle, source: $container });
            }
            switchToTab(index);
          });
          $items.appendChild($btn);
          $tab.classList.toggle("active", resolvedIndex === index || defaultActiveTab);
          $tab.classList.remove("is-collapsed");
          $tab.classList.remove("hidden");
          $tab.dataset.tabInit = "true";
          $content.appendChild($tab);
        });
        $container.appendChild($header);
        $container.appendChild($content);
        if (resolvedIndex !== -1) {
          switchToTab(resolvedIndex);
        } else {
          switchToTab(0);
        }
      });
    }
    /** Attach copy behaviour to diagram container copy buttons. */
    initDiagramCopyBtn() {
      const stagingDOM = getStagingDOM();
      document.querySelectorAll(".diagram-container > .copy-icon-btn").forEach(($btn) => {
        $btn.addEventListener("click", () => {
          stagingDOM.stage($btn.parentElement.querySelector("template").content.cloneNode(true));
          let code = stagingDOM.contentAsText();
          try {
            code = JSON.stringify(JSON.parse(code), null, 2);
          } catch {
          }
          copyText(code).then(() => {
            flashCopiedTooltip($btn);
          }, () => {
            console.error("Clipboard write failed!", "Your browser does not support clipboard API!");
          });
        }, false);
      });
      stagingDOM.destroy();
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\content.ts
  var CellTooltip2 = window.CellTooltip;
  var copyText2 = createCopyText();
  var ContentModule = class {
    #core;
    #code;
    constructor(core, code) {
      this.#core = core;
      this.#code = code;
    }
    /** Fetch and inline SVG icons referenced by `data-svg-src` attributes. */
    initSVGIcon() {
      document.querySelectorAll("[data-svg-src]").forEach(($icon) => {
        fetch($icon.dataset.svgSrc).then((response) => response.text()).then((svg) => {
          const $temp = document.createElement("div");
          $temp.insertAdjacentHTML("afterbegin", svg);
          const $svg = $temp.firstChild;
          $svg.dataset.svgSrc = $icon.dataset.svgSrc;
          $svg.classList.add("icon");
          const $titleElements = $svg.getElementsByTagName("title");
          $titleElements.length && $svg.removeChild($titleElements[0]);
          $icon.parentElement.replaceChild($svg, $icon);
        }).catch((err) => {
          console.error(err);
        });
      });
    }
    /**
     * Initialize the link-guard dialog and bind click handlers on guarded links.
     * @param target - The root element to search for guarded links.
     */
    initLinkGuardDialog(target = document) {
      const dialog = document.getElementById("link-guard-dialog");
      if (!dialog)
        return;
      const $target = dialog.querySelector(".target");
      const $copy = dialog.querySelector(".copy-icon-btn");
      const $confirm = dialog.querySelector(".confirm-btn");
      const $cancel = dialog.querySelector(".cancel-btn");
      const _closeDialog = () => {
        if (dialog.open)
          dialog.close();
        dialog._target = null;
        if ($target) {
          $target.textContent = "-";
        }
      };
      if (!dialog.dataset.init) {
        dialog.dataset.init = "true";
        $confirm.addEventListener("click", () => {
          if (dialog._target) {
            window.open(dialog._target, "_blank", "noopener,noreferrer");
          }
          _closeDialog();
        });
        $cancel.addEventListener("click", _closeDialog);
        $copy.addEventListener("click", () => {
          const textToCopy = dialog._target || "";
          if (!textToCopy)
            return;
          copyText2(textToCopy).then(() => {
            flashCopiedTooltip($copy);
          });
        });
      }
      target.querySelectorAll('a[target="_blank"][data-guard="modal"]:not([data-init])').forEach(($link) => {
        $link.dataset.init = "true";
        $link.addEventListener("click", (e) => {
          e.preventDefault();
          let targetUrl = $link.href;
          try {
            const guardUrl = new URL($link.href);
            targetUrl = guardUrl.searchParams.get("target") || targetUrl;
          } catch {
          }
          ;
          dialog._target = targetUrl;
          if ($target) {
            $target.textContent = targetUrl;
          }
          dialog.showModal();
          document.activeElement?.blur();
        }, false);
      });
    }
    /**
     * Attach toggle behaviour to `.details` elements.
     * @param target - The root element to search within.
     */
    initDetails(target = document) {
      target.querySelectorAll(".details:not(.disabled)").forEach(($details) => {
        const $summary = $details.querySelector(".details-summary");
        $summary?.addEventListener("click", () => {
          $details.classList.toggle("open");
        }, false);
      });
    }
    /** Convert footnote refs into tooltip-enabled elements. */
    #initFootnotes() {
      const $footnoteRefs = document.querySelectorAll('#content sup[id^="fnref:"]');
      const $footnotes = document.querySelector('.footnotes[role="doc-endnotes"]');
      if (!$footnoteRefs.length || !$footnotes)
        return;
      const footnoteMap = /* @__PURE__ */ new Map();
      $footnoteRefs.forEach(($ref) => {
        if (this.#core.config.tooltip) {
          const $link = $ref.querySelector("a.footnote-ref");
          if ($link) {
            $link.addEventListener("click", (e) => {
              e.preventDefault();
            }, false);
          }
        }
        const id = $ref.id.replace("fnref:", "");
        const $footnoteContent = $footnotes.querySelector(`[id="fn:${id}"]`);
        if ($footnoteContent) {
          const $clonedContent = $footnoteContent.cloneNode(true);
          const $backref = $clonedContent.querySelector(".footnote-backref");
          if ($backref)
            $backref.remove();
          footnoteMap.set($ref, $clonedContent);
        }
      });
      footnoteMap.forEach(($content, $ref) => {
        if ($ref.hasAttribute("title"))
          return;
        $ref.setAttribute("title", $content.textContent.trim());
        if (this.#core.config.tooltip) {
          CellTooltip2.getOrCreateInstance($ref);
        }
      });
    }
    /** Initialize CellTooltip on action buttons, copy buttons, and footnotes. */
    initTooltip() {
      if (!this.#core.config.tooltip)
        return;
      const inlineEnd = this.#core.isRTL ? "left" : "right";
      CellTooltip2.initAll("li[data-task] > span[title]", { placement: inlineEnd });
      CellTooltip2.initAll(".action-btn[title]", { placement: "bottom" });
      CellTooltip2.initAll(".copy-icon-btn[title]", { placement: "top" });
      CellTooltip2.initAll(".fixit-encryptor-btn[title]");
      this.#initFootnotes();
    }
    /**
     * Re-initialize content components within a target element.
     * Useful after AJAX/pjax loads or dynamic content injection.
     * @param target - The root element to initialize components within.
     */
    initContent(target = document) {
      this.initDetails(target);
      this.#code.initCodeWrapper();
      this.#code.initCodeTabs();
      this.#code.initDiagramCopyBtn();
      this.initTooltip();
      this.initLinkGuardDialog(target);
    }
    setup() {
      this.initContent();
      this.initSVGIcon();
      eventBus.on("fixit:content-decrypted", ({ detail }) => {
        this.initContent(detail.target);
      });
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\core.ts
  var CoreModule = class {
    config;
    version;
    isRTL;
    themeMode;
    isDark;
    #activeMaskOverlay = null;
    #maskOverlays = /* @__PURE__ */ new Map();
    constructor() {
      this.config = window.config;
      this.version = this.config.version;
      this.isRTL = isRTL();
      this.themeMode = getThemeMode();
      this.isDark = isDarkMode();
      window.objectFitImages?.();
    }
    /** Register a named mask overlay with open/close/isActive handlers. */
    registerMaskOverlay(name, handlers) {
      this.#maskOverlays.set(name, handlers);
    }
    /** Toggle the mask element's blur class based on active overlay state. */
    syncMaskState() {
      document.getElementById("mask")?.classList.toggle("is-blur", Boolean(this.#activeMaskOverlay));
    }
    /** Open a named mask overlay, closing any previously active one. */
    openMaskOverlay(name) {
      const overlay = this.#maskOverlays.get(name);
      if (!overlay)
        return;
      if (this.#activeMaskOverlay && this.#activeMaskOverlay !== name) {
        this.closeMaskOverlay(this.#activeMaskOverlay, true);
      }
      overlay.onOpen?.();
      this.#activeMaskOverlay = name;
      this.syncMaskState();
    }
    /** Close a named mask overlay and optionally skip mask state sync. */
    closeMaskOverlay(name, skipSync = false) {
      const overlay = this.#maskOverlays.get(name);
      if (!overlay)
        return;
      overlay.onClose?.();
      if (this.#activeMaskOverlay === name) {
        this.#activeMaskOverlay = null;
      }
      !skipSync && this.syncMaskState();
    }
    /** Toggle a named mask overlay open/closed. */
    toggleMaskOverlay(name) {
      const overlay = this.#maskOverlays.get(name);
      if (!overlay)
        return;
      const isActive = overlay.isActive?.() ?? this.#activeMaskOverlay === name;
      if (this.#activeMaskOverlay === name && isActive) {
        this.closeMaskOverlay(name);
        return;
      }
      this.openMaskOverlay(name);
    }
    /** Close whichever mask overlay is currently active. */
    closeActiveMaskOverlay() {
      if (!this.#activeMaskOverlay) {
        this.syncMaskState();
        return;
      }
      this.closeMaskOverlay(this.#activeMaskOverlay);
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\encryption.ts
  var EncryptionModule = class {
    #core;
    constructor(core) {
      this.#core = core;
    }
    /** Initialize FixItDecryptor with encryption config. */
    setup() {
      if (!this.#core.config.encryption || !window.FixItDecryptor)
        return;
      const decryptor = new window.FixItDecryptor();
      decryptor.init(this.#core.config.encryption);
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\events.ts
  var EventsModule = class {
    #resizeTimeout = null;
    #newScrollTop = 0;
    #oldScrollTop = 0;
    #core;
    #code;
    constructor(core, code) {
      this.#core = core;
      this.#code = code;
    }
    /** Bind scroll listener: auto-hide headers, reading progress, back-to-top, and TOC sync. */
    onScroll() {
      const ACCURACY = 50;
      const $autoHeaders = [];
      const $backToTop = document.querySelector(".back-to-top");
      const $readingProgressBar = document.querySelector(".reading-progress-bar");
      if (document.body.dataset.headerDesktop === "auto") {
        $autoHeaders.push(document.getElementById("header-desktop"));
      }
      if (document.body.dataset.headerMobile === "auto") {
        $autoHeaders.push(document.getElementById("header-mobile"));
      }
      $backToTop?.addEventListener("click", () => {
        scrollIntoView("body");
      });
      window.addEventListener("scroll", () => {
        this.#newScrollTop = getScrollTop();
        const scroll = this.#newScrollTop - this.#oldScrollTop;
        if (Math.abs(scroll) > ACCURACY) {
          this.#core.closeActiveMaskOverlay();
          const isScrollingDown = scroll > 0;
          $autoHeaders.forEach(($header) => {
            if (isScrollingDown) {
              $header.classList.remove("header__fadeInDown");
              animateCSS($header, ["header__fadeOutUp"], true);
            } else {
              $header.classList.remove("header__fadeOutUp");
              animateCSS($header, ["header__fadeInDown"], true);
            }
          });
        } else if (this.#newScrollTop <= 0) {
          $autoHeaders.forEach(($header) => {
            $header.classList.remove("header__fadeOutUp");
            animateCSS($header, ["header__fadeInDown"], true);
          });
        }
        const contentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.max(Math.min(100 * Math.max(this.#newScrollTop, 0) / contentHeight, 100), 0);
        if ($readingProgressBar) {
          $readingProgressBar.style.setProperty("--fi-progress", `${scrollPercent.toFixed(2)}%`);
        }
        if ($backToTop) {
          if (scrollPercent > 1) {
            $backToTop.classList.remove("hidden", "animate__fadeOut");
            animateCSS($backToTop, ["animate__fadeIn"], true);
          } else {
            $backToTop.classList.remove("animate__fadeIn");
            animateCSS($backToTop, ["animate__fadeOut"], true, () => {
              $backToTop.classList.contains("animate__fadeOut") && $backToTop.classList.add("hidden");
            });
          }
          $backToTop.style.setProperty("--fi-b2t-progress", scrollPercent.toFixed(2));
          if (navigator.userAgent.toLowerCase().includes("firefox")) {
            const dashoffset = 2 * Math.PI * 50 * (1 - scrollPercent / 100);
            $backToTop.querySelector("circle.progress").style.strokeDashoffset = String(dashoffset.toFixed(2));
          }
        }
        eventBus.emit("fixit:scroll");
        this.#oldScrollTop = this.#newScrollTop;
      }, false);
    }
    /** Bind resize listener with debounce: re-init TOC, search, and sync state. */
    onResize() {
      let resizeBefore = isMobile();
      window.addEventListener("resize", () => {
        if (!this.#resizeTimeout) {
          this.#resizeTimeout = window.setTimeout(() => {
            this.#resizeTimeout = null;
            eventBus.emit("fixit:resize");
            const _isMobile = isMobile();
            if (_isMobile !== resizeBefore) {
              this.#core.closeActiveMaskOverlay();
              resizeBefore = _isMobile;
            }
          }, 100);
        }
      }, false);
    }
    /** Bind mask click to close the active overlay. */
    onClickMask() {
      document.getElementById("mask").addEventListener("click", (e) => {
        if (!e.target.classList.contains("is-blur"))
          return;
        this.#core.closeActiveMaskOverlay();
      }, false);
    }
    /** Bind beforeprint/afterprint to expand admonitions, code blocks, details, and file trees. */
    initPrint() {
      window.addEventListener("beforeprint", () => {
        const $content = document.getElementById("content");
        const printConfig = this.#core.config.print || {};
        if (printConfig.expandAdmonition) {
          $content.querySelectorAll(".admonition").forEach(($el) => $el.classList.add("open"));
        }
        if (printConfig.expandCode) {
          $content.querySelectorAll(".code-tabs").forEach(($codeTabs) => {
            if ($codeTabs.dataset.diagram)
              return;
            const $actions = $codeTabs.querySelector(".tabs-actions");
            const $activeBlock = $codeTabs.querySelector(".code-block.active");
            if ($actions && $activeBlock) {
              const $codeHeader = $activeBlock.querySelector(".code-header");
              if ($codeHeader) {
                Array.from($actions.children).forEach((btn) => $codeHeader.appendChild(btn));
              }
            }
            const $codeBlocks = $codeTabs.querySelectorAll(".code-block");
            $codeBlocks.forEach(($codeBlock) => {
              delete $codeBlock.dataset.tabInit;
              $codeTabs.parentElement.insertBefore($codeBlock, $codeTabs);
            });
            $codeTabs.parentElement.removeChild($codeTabs);
          });
          $content.querySelectorAll(".code-block").forEach(($el) => {
            $el.classList.add("line-wrapping");
            $el.classList.remove("is-collapsed");
            if ($el.querySelector(".code-expand-btn")) {
              $el.classList.add("is-expanded");
            }
          });
        }
        if (printConfig.expandDetails) {
          $content.querySelectorAll("details").forEach(($el) => $el.setAttribute("open", ""));
        }
      }, false);
      window.addEventListener("afterprint", () => {
        this.#code.initCodeTabs();
      }, false);
    }
    /** Initialize all event listeners. */
    setup() {
      this.onScroll();
      this.onResize();
      this.onClickMask();
      this.initPrint();
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\menu.ts
  var MenuModule = class {
    #core;
    constructor(core) {
      this.#core = core;
    }
    /** Set min-width on desktop sub-menus to match parent item width. */
    initDesktop() {
      document.querySelectorAll(".has-children").forEach(($item) => {
        $item.querySelector(".sub-menu").style.minWidth = `${$item.offsetWidth - 8}px`;
      });
    }
    /** Initialize mobile drawer menu with mask overlay and nested toggles. */
    initMobile() {
      const $menuToggleMobile = document.getElementById("menu-toggle-mobile");
      const $menuMobile = document.getElementById("menu-mobile");
      if (!$menuToggleMobile || !$menuMobile)
        return;
      this.#core.registerMaskOverlay("menu-mobile", {
        isActive: () => $menuMobile.classList.contains("active"),
        onOpen: () => {
          $menuToggleMobile.classList.add("active");
          $menuMobile.classList.add("active");
          $menuToggleMobile.setAttribute("aria-expanded", "true");
        },
        onClose: () => {
          $menuToggleMobile.classList.remove("active");
          $menuMobile.classList.remove("active");
          $menuToggleMobile.setAttribute("aria-expanded", "false");
        }
      });
      $menuToggleMobile.addEventListener("click", () => {
        this.#core.toggleMaskOverlay("menu-mobile");
      }, false);
      document.querySelectorAll(".menu-item>.nested-item").forEach(($nestedItem) => {
        $nestedItem.addEventListener("click", function() {
          this.parentNode.querySelector(".sub-menu").classList.toggle("open");
          this.querySelector(".dropdown-icon").classList.toggle("open");
        });
      });
    }
    /** Initialize both desktop and mobile menus. */
    setup() {
      this.initDesktop();
      this.initMobile();
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\misc.ts
  var MiscModule = class {
    #siteTime;
    #core;
    constructor(core) {
      this.#core = core;
    }
    /** Calculate and display the elapsed time since site launch. */
    getSiteTime() {
      const now = /* @__PURE__ */ new Date();
      const run = new Date(this.#core.config.siteTime);
      const $runTimes = document.querySelector(".run-times");
      if (!isValidDate(run) || !$runTimes) {
        clearInterval(this.#siteTime);
        $runTimes && $runTimes.parentNode.removeChild($runTimes);
        return;
      }
      const totalSeconds = Math.floor((now.getTime() - run.getTime()) / 1e3);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds % 86400 / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      $runTimes.innerHTML = `${days}, ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      document.querySelector(".site-time .hidden")?.classList.remove("hidden");
    }
    /** Start the site-time counter with visibility-change pausing. */
    initSiteTime() {
      if (this.#core.config.siteTime) {
        this.#siteTime = setInterval(() => this.getSiteTime(), 500);
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            return clearInterval(this.#siteTime);
          }
          this.#siteTime = setInterval(() => this.getSiteTime(), 500);
        }, false);
      }
    }
    /** Save and restore scroll position as an automatic bookmark. */
    initAutoMark() {
      if (!this.#core.config.autoBookmark)
        return;
      window.addEventListener("beforeunload", () => {
        window.sessionStorage?.setItem(`fixit-bookmark/#${location.pathname}`, String(getScrollTop()));
      });
      const scrollTop = Number(window.sessionStorage?.getItem(`fixit-bookmark/#${location.pathname}`));
      if (scrollTop && location.hash === "") {
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }
    /** Initialize reward/donation button exclusive-toggle behaviour. */
    initReward() {
      const $rewards = document.querySelectorAll('.post-reward [data-mode="fixed"]');
      if (!$rewards.length)
        return;
      if (isMobile()) {
        $rewards.forEach(($reward) => $reward.removeAttribute("data-mode"));
        return;
      }
      const _closeRewardExclude = (id) => {
        $rewards.forEach(($reward) => {
          const $rewardInput = $reward.parentElement.querySelector(".reward-input");
          if ($rewardInput && $rewardInput.id !== id) {
            $rewardInput.checked = false;
          }
        });
      };
      $rewards.forEach(($reward) => {
        $reward.previousElementSibling.addEventListener("click", function() {
          _closeRewardExclude(this.getAttribute("for"));
        }, false);
      });
      eventBus.on("fixit:scroll", () => _closeRewardExclude());
    }
    /** Initialize the comment section UI. */
    initComment() {
      if (!this.#core.config.comment?.enable)
        return;
      if (document.querySelector("#comments")) {
        const $viewCommentsBtn = document.querySelector(".view-comments");
        $viewCommentsBtn.classList.remove("hidden");
        $viewCommentsBtn.addEventListener("click", () => {
          scrollIntoView("#comments");
        }, false);
      }
      if (this.#core.config.comment.expired)
        document.querySelector("#comments").remove();
    }
    /**
     * Initialize PostChat and postSummary for HongMoAI
     */
    initPostChat() {
      const initThemeCompatibility = () => {
        if (this.#core.config.postChat) {
          document.body.classList.toggle("dark", this.#core.isDark);
          eventBus.on("fixit:switch-theme", ({ detail }) => {
            if (!detail.isChanged)
              return;
            document.body.classList.toggle("dark", detail.isDark);
          });
        }
      };
      const initPostChatUser = () => {
        if (!window.postChatUser || !window.postChatConfig || window.postChatConfig.userMode === "magic")
          return;
        window.postChat_theme = this.#core.isDark ? "dark" : "light";
        eventBus.on("fixit:switch-theme", ({ detail }) => {
          if (!detail.isChanged)
            return;
          const targetFrame = document.getElementById("postChat_iframeContainer");
          if (targetFrame) {
            window.postChatUser.setPostChatTheme(detail.isDark ? "dark" : "light");
          } else {
            window.postChat_theme = detail.isDark ? "dark" : "light";
          }
        });
      };
      initThemeCompatibility();
      initPostChatUser();
    }
    /** Initialize all miscellaneous features. */
    setup() {
      this.initSiteTime();
      this.initAutoMark();
      this.initReward();
      this.initComment();
      this.initPostChat();
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\pwa.ts
  var PWAModule = class {
    #core;
    constructor(core) {
      this.#core = core;
    }
    /** Register the service worker with update detection and notification binding. */
    async setup() {
      const pwa = this.#core.config.PWA;
      if (!pwa?.enable || !("serviceWorker" in navigator))
        return;
      const registration = await navigator.serviceWorker.register(pwa.serviceWorkerURL).catch((error) => {
        console.error("Service Worker registration failed:", error);
        return null;
      });
      if (!registration)
        return;
      setInterval(() => registration.update(), 36e5);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker)
          return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            eventBus.emit("fixit:sw-update");
          }
        });
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
      this.#bindUpdateNotification(registration);
    }
    /**
     * Bind the template-rendered update notification toast.
     * Shows the toast on `fixit:sw-update` and wires the refresh button to skip waiting.
     */
    #bindUpdateNotification(registration) {
      const toast = document.querySelector(".sw-update-notification");
      if (!toast)
        return;
      eventBus.on("fixit:sw-update", () => {
        toast.querySelector(".sw-update-btn").addEventListener("click", () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          toast.classList.remove("visible");
        }, { once: true });
        requestAnimationFrame(() => toast.classList.add("visible"));
      });
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\search\engines\algolia.ts
  function createAlgoliaEngine(searchConfig) {
    if (!searchConfig.algoliaAppID || !searchConfig.algoliaSearchKey || !searchConfig.algoliaIndex) {
      console.warn("[FixIt] Algolia is not configured. Please set `search.algolia.appID`, `search.algolia.searchKey`, and `search.algolia.index` in your site config.");
      return {
        async search() {
          return [{
            uri: "",
            title: "Algolia is not configured",
            date: "",
            context: "Please set <code>search.algolia.appID</code>, <code>search.algolia.searchKey</code>, and <code>search.algolia.index</code> in your site config."
          }];
        }
      };
    }
    let algoliaIndex = null;
    function ensureClient() {
      if (algoliaIndex)
        return true;
      const liteClient = window["algoliasearch/lite"]?.liteClient;
      if (!liteClient) {
        console.error("Algolia client is not available on window");
        return false;
      }
      const client = liteClient(searchConfig.algoliaAppID, searchConfig.algoliaSearchKey);
      algoliaIndex = {
        search: (queryText, params = {}) => {
          const { offset, length, ...rest } = params;
          const request = {
            indexName: searchConfig.algoliaIndex,
            query: queryText,
            ...rest
          };
          if (typeof length === "number")
            request.hitsPerPage = length;
          if (typeof offset === "number" && typeof length === "number" && length > 0)
            request.page = Math.floor(offset / length);
          return client.search({ requests: [request] }).then((response) => ({ hits: response.results?.[0]?.hits ?? [] }));
        }
      };
      return true;
    }
    return {
      async search(query, maxResultLength) {
        if (!ensureClient())
          return [];
        const snippetLength = searchConfig.snippetLength ?? 50;
        const highlightTag = searchConfig.highlightTag ?? "em";
        try {
          const { hits } = await algoliaIndex.search(query, {
            offset: 0,
            length: maxResultLength * 8,
            attributesToHighlight: ["title", "heading"],
            attributesToRetrieve: ["*"],
            attributesToSnippet: [`content:${snippetLength}`],
            highlightPreTag: `<${highlightTag}>`,
            highlightPostTag: `</${highlightTag}>`
          });
          const results = {};
          hits.forEach(({ uri, date, heading, tags, categories, collections, _highlightResult, _snippetResult: { content } }) => {
            if (results[uri] && results[uri].context.length > content.value.length)
              return;
            results[uri] = {
              uri,
              title: _highlightResult.title.value,
              date,
              context: content.value,
              heading: _highlightResult.heading?.value || heading || void 0,
              tags,
              categories,
              collections
            };
          });
          return Object.values(results).slice(0, maxResultLength);
        } catch (err) {
          console.error(err);
          return [];
        }
      }
    };
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\search\engines\cse.ts
  function createCSEEngine(cseConfig) {
    return {
      async search(query) {
        if (cseConfig?.engine === "google" && cseConfig.cx) {
          return [{
            uri: `${cseConfig.resultsPage}#gsc.tab=0&gsc.q=${encodeURIComponent(query)}`,
            title: cseConfig.searchIn || "",
            date: "",
            context: cseConfig.gotoResultsPage || "",
            icon: '<i class="fa-brands fa-google" aria-hidden="true"></i>'
          }];
        }
        if (cseConfig?.engine === "bing" && cseConfig.cx) {
          return [{
            uri: `${cseConfig.resultsPage}?q=${encodeURIComponent(query)}`,
            title: cseConfig.searchIn || "",
            date: "",
            context: cseConfig.gotoResultsPage || "",
            icon: '<i class="fa-brands fa-microsoft" aria-hidden="true"></i>'
          }];
        }
        console.warn("CSE is not properly configured. Please set cse.engine and provide a cx value in your site config.");
        return [{
          uri: "",
          title: "CSE is not configured",
          date: "",
          context: "Please set <code>cse.engine</code> and the corresponding <code>cx</code> value in your site config."
        }];
      }
    };
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\search\engines\fuse.ts
  function createFuseEngine(searchConfig) {
    return {
      async search(query, maxResultLength) {
        const highlightTag = searchConfig.highlightTag ?? "em";
        function doSearch() {
          const results = {};
          window._fuseIndex.search(query).forEach(({ item, matches }) => {
            let title = item.title;
            let content = item.content;
            let heading = item.heading || "";
            matches.forEach(({ indices, key }) => {
              if (key === "content") {
                content = applyHighlightToText(content, indices, highlightTag);
              } else if (key === "title") {
                title = applyHighlightToText(title, indices, highlightTag);
              } else if (key === "heading") {
                heading = applyHighlightToText(heading, indices, highlightTag);
              }
            });
            results[item.uri] = {
              uri: item.uri,
              title,
              date: item.date,
              context: content,
              heading: item.heading ? heading : void 0,
              tags: item.tags,
              categories: item.categories,
              collections: item.collections
            };
          });
          return Object.values(results).slice(0, maxResultLength);
        }
        if (!window._fuseIndex) {
          try {
            const response = await fetch(searchConfig.fuseIndexURL);
            const data = await response.json();
            window._fuseIndex = new window.Fuse(data, {
              isCaseSensitive: searchConfig.isCaseSensitive ?? false,
              findAllMatches: searchConfig.findAllMatches ?? false,
              minMatchCharLength: searchConfig.minMatchCharLength ?? 1,
              location: searchConfig.location ?? 0,
              threshold: searchConfig.threshold ?? 0.3,
              distance: searchConfig.distance ?? 100,
              ignoreLocation: searchConfig.ignoreLocation ?? false,
              useExtendedSearch: searchConfig.useExtendedSearch ?? false,
              ignoreFieldNorm: searchConfig.ignoreFieldNorm ?? false,
              includeScore: false,
              shouldSort: true,
              includeMatches: true,
              keys: ["content", "title", "heading"]
            });
            return doSearch();
          } catch (err) {
            console.error(err);
            return [];
          }
        }
        return doSearch();
      }
    };
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\search\engines\pagefind.ts
  function replaceExcerptHighlightTag(excerpt, highlightTag) {
    if (!excerpt || !highlightTag || highlightTag === "mark") {
      return excerpt || "";
    }
    return excerpt.replaceAll("<mark>", `<${highlightTag}>`).replaceAll("</mark>", `</${highlightTag}>`);
  }
  function createPagefindEngine(searchConfig, pagefindConfig) {
    const bundlePath = pagefindConfig.bundlePath || "pagefind/";
    const rawDebounceTimeout = Number(pagefindConfig.debounceTimeoutMs ?? 300);
    const debounceTimeout = Number.isFinite(rawDebounceTimeout) ? Math.max(0, rawDebounceTimeout) : 300;
    const builtInFiltersEnabled = pagefindConfig.useBuiltInFilters !== false;
    const sortBy = pagefindConfig.sortBy;
    const sortOrder = pagefindConfig.sortOrder ?? "desc";
    const highlightTag = searchConfig.highlightTag ?? "em";
    const excerptLength = Number(searchConfig.snippetLength ?? 30);
    const state = {
      loading: null,
      initialized: false,
      availableFilters: null
    };
    const ensurePagefind = async () => {
      if (!state.loading) {
        state.loading = import(`${bundlePath}pagefind.js`).then(async (mod) => {
          if (!state.initialized) {
            const options = {};
            if (Number.isFinite(excerptLength) && excerptLength >= 0) {
              options.excerptLength = excerptLength;
            }
            if (Object.keys(options).length && typeof mod.options === "function") {
              await mod.options(options);
            }
            await mod.init();
            state.initialized = true;
          }
          return mod;
        }).catch((error) => {
          state.loading = null;
          throw error;
        });
      }
      return state.loading;
    };
    const getAvailableFilters = async () => {
      if (state.availableFilters)
        return state.availableFilters;
      const pagefind = await ensurePagefind();
      if (typeof pagefind.filters !== "function") {
        state.availableFilters = {};
        return state.availableFilters;
      }
      try {
        state.availableFilters = await pagefind.filters() ?? {};
      } catch (error) {
        console.warn("[FixIt] failed to read Pagefind filters:", error);
        state.availableFilters = {};
      }
      return state.availableFilters;
    };
    return {
      preload() {
        return ensurePagefind();
      },
      async search(query, maxResultLength) {
        if (!query || !query.trim())
          return [];
        const pagefind = await ensurePagefind();
        const searchOptions = {};
        if (builtInFiltersEnabled) {
          const availableFilters = await getAvailableFilters();
          const filters = {};
          if (Object.hasOwn(availableFilters, "hidden")) {
            filters.hidden = "false";
          }
          if (Object.hasOwn(availableFilters, "encrypted")) {
            filters.encrypted = "false";
          }
          if (Object.keys(filters).length) {
            searchOptions.filters = filters;
          }
        }
        if (sortBy) {
          searchOptions.sort = { [sortBy]: sortOrder };
        }
        const resultLimit = Math.max(0, Math.floor(maxResultLength));
        const searched = debounceTimeout > 0 && typeof pagefind.debouncedSearch === "function" ? await pagefind.debouncedSearch(query, searchOptions, debounceTimeout) : await pagefind.search(query, searchOptions);
        if (searched === null)
          return [];
        const records = await Promise.all(
          (searched.results || []).slice(0, resultLimit).map((entry) => entry.data())
        );
        return records.map((item) => {
          const url = item.url || "#";
          const hashIndex = url.indexOf("#");
          let heading;
          if (hashIndex > 0 && item.sub_results?.length) {
            const subResult = item.sub_results.find((sr) => sr.url === url);
            heading = subResult?.title || void 0;
          }
          return {
            uri: url,
            title: item.meta?.title || item.url || "",
            date: item.meta?.date || "",
            context: replaceExcerptHighlightTag(item.excerpt || "", highlightTag),
            heading,
            tags: item.meta?.tags ? item.meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : void 0,
            categories: item.meta?.categories ? item.meta.categories.split(",").map((t) => t.trim()).filter(Boolean) : void 0,
            collections: item.meta?.collections ? item.meta.collections.split(",").map((t) => t.trim()).filter(Boolean) : void 0
          };
        });
      }
    };
  }

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\search\index.ts
  var SearchModule = class {
    #engine;
    #autocompleteInstance;
    #openDialog;
    #closeDialog;
    #initialized = false;
    #core;
    constructor(core) {
      this.#core = core;
    }
    /** Create the appropriate search engine based on type. */
    #createEngine(type, searchConfig) {
      switch (type) {
        case "algolia":
          return createAlgoliaEngine(searchConfig);
        case "fuse":
          return createFuseEngine(searchConfig);
        case "cse":
          return createCSEEngine(this.#core.config.cse);
        case "pagefind":
          return createPagefindEngine(searchConfig, this.#core.config.pagefind);
        default:
          console.warn(`[FixIt] Unknown search type: "${type}". Supported types: algolia, fuse, cse, pagefind.`);
          return {
            async search() {
              return [];
            }
          };
      }
    }
    /** Initialize @algolia/autocomplete-js instance. */
    #initAutosearch() {
      const searchConfig = this.#core.config.search;
      if (!searchConfig || !this.#engine)
        return;
      searchConfig.placeholder = searchConfig.placeholder || "Search...";
      searchConfig.clearText = searchConfig.clearText || "Clear";
      const autocompleteLib = window["@algolia/autocomplete-js"];
      if (!autocompleteLib?.autocomplete) {
        console.error("[FixIt] @algolia/autocomplete-js is not available on window");
        return;
      }
      const { autocomplete } = autocompleteLib;
      const { maxResultLength = 10 } = searchConfig;
      const engine = this.#engine;
      const panelContainer = document.querySelector("#search-dialog .search-modal");
      let submitBtn = null;
      this.#autocompleteInstance = autocomplete({
        container: ".search-modal-header",
        panelContainer: panelContainer || void 0,
        placeholder: searchConfig.placeholder,
        defaultActiveItemId: 0,
        detachedMediaQuery: "none",
        translations: {
          clearButtonTitle: searchConfig.clearText
        },
        classNames: {
          root: "search-autocomplete",
          form: "search-form",
          input: "search-input",
          inputWrapper: "search-input-wrapper",
          inputWrapperPrefix: "search-input-prefix",
          inputWrapperSuffix: "search-input-suffix",
          submitButton: "search-submit-btn",
          clearButton: "search-clear-btn",
          loadingIndicator: "search-loading",
          label: "search-label",
          list: "search-list",
          item: "search-item",
          panel: "search-panel",
          panelLayout: "search-panel-layout",
          source: "search-source",
          sourceFooter: "search-source-footer",
          sourceHeader: "search-source-header",
          sourceNoResults: "search-source-no-results"
        },
        getSources: ({ query }) => {
          if (!query.trim())
            return [];
          return [{
            sourceId: "search",
            async getItems() {
              return engine.search(query, maxResultLength);
            },
            getItemUrl({ item }) {
              return item.uri;
            },
            templates: {
              item({ item, html: h }) {
                const title = h`<span class="suggestion-title" dangerouslySetInnerHTML=${{ __html: item.title }}></span>`;
                const icon = item.icon ? h`<span class="suggestion-icon" dangerouslySetInnerHTML=${{ __html: item.icon }}></span>` : "";
                const date = item.date ? h`<span class="suggestion-date">${item.date}</span>` : "";
                const heading = item.heading ? h`<span class="suggestion-heading"><span class="suggestion-heading-mark">#</span> <span dangerouslySetInnerHTML=${{ __html: item.heading }}></span></span>` : "";
                const context = h`<div class="suggestion-context" dangerouslySetInnerHTML=${{ __html: item.context }}></div>`;
                const cats = item.categories?.length ? h`<span class="suggestion-category"><i class="fa-regular fa-folder" aria-hidden="true"></i> ${item.categories.join(", ")}</span>` : "";
                const cols = item.collections?.length ? h`<span class="suggestion-collection"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> ${item.collections.join(", ")}</span>` : "";
                const tags = item.tags?.length ? h`<span class="suggestion-tag"><i class="fa-solid fa-tags" aria-hidden="true"></i> ${item.tags.join(", ")}</span>` : "";
                const hasMeta = cats || cols || tags;
                const meta = hasMeta ? h`<div class="suggestion-meta">${cats}${cols}${tags}</div>` : "";
                return h`<div class="search-item-wrapper"><div><a href="${item.uri}">${title}</a>${icon}${heading}${date}</div>${context}${meta}</div>`;
              },
              noResults({ html: h }) {
                return h`<div class="search-empty"><i class="fa-solid fa-magnifying-glass search-empty-icon" aria-hidden="true"></i><p>${searchConfig.noResultsFound}: <span class="search-query">"${query}"</span></p></div>`;
              }
            },
            onSelect: ({ item }) => {
              if (item.uri) {
                this.#closeDialog?.();
                window.location.assign(item.uri);
              }
            }
          }];
        },
        onSubmit: ({ state }) => {
          const { activeItemId, collections } = state;
          if (activeItemId === null || !collections.length)
            return;
          const items = collections[0].items;
          const item = items[activeItemId];
          if (item?.uri) {
            this.#closeDialog?.();
            window.location.assign(item.uri);
          }
        },
        onStateChange: ({ state }) => {
          if (!submitBtn)
            return;
          const hasResults = state.collections.some((collection) => collection.items.length > 0);
          submitBtn.disabled = !state.query.trim() || !hasResults;
        }
      });
      submitBtn = document.querySelector(".search-submit-btn");
      const clearBtn = document.querySelector(".search-autocomplete .search-clear-btn");
      if (clearBtn) {
        clearBtn.textContent = searchConfig.clearText;
      }
      document.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      document.querySelector(".search-close-btn")?.addEventListener("click", () => this.#closeDialog?.());
      if (searchConfig.type === "pagefind" && this.#engine.preload) {
        const container = document.querySelector(".search-autocomplete");
        container?.addEventListener("focusin", () => {
          this.#engine.preload().catch((error) => {
            console.error(error);
          });
        }, { once: true });
      }
    }
    /** Initialize the search dialog open/close lifecycle using native <dialog>. */
    #initDialog() {
      const dialog = document.getElementById("search-dialog");
      if (!dialog)
        return;
      const focusInput = () => {
        requestAnimationFrame(() => {
          const input = dialog.querySelector("input");
          input?.focus();
        });
      };
      const open = () => {
        dialog.showModal();
        focusInput();
      };
      const close = () => {
        if (dialog.open)
          dialog.close();
      };
      const resetAutocomplete = () => {
        if (this.#autocompleteInstance) {
          this.#autocompleteInstance.setQuery("");
          this.#autocompleteInstance.setIsOpen(false);
        }
      };
      this.#openDialog = open;
      this.#closeDialog = close;
      document.querySelector(".search-trigger.desktop")?.addEventListener("click", open);
      document.querySelector(".search-trigger.mobile")?.addEventListener("click", () => {
        this.#core.closeMaskOverlay("menu-mobile");
        open();
      });
      dialog.addEventListener("close", resetAutocomplete);
      dialog.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dialog.open) {
          e.preventDefault();
          close();
        }
      });
    }
    /** Initialize keyboard shortcuts. */
    #initKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          this.#openDialog?.();
        }
      });
    }
    /** Initialize the search overlay, autocomplete, and engine-specific logic. */
    setup() {
      const searchConfig = this.#core.config.search;
      if (!searchConfig || !searchConfig.type)
        return;
      if (!this.#engine) {
        this.#engine = this.#createEngine(searchConfig.type, searchConfig);
      }
      if (!this.#initialized) {
        this.#initialized = true;
        this.#initAutosearch();
        this.#initDialog();
        this.#initKeyboardShortcuts();
      }
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\theme.ts
  var ThemeModule = class {
    #mql = window.matchMedia("(prefers-color-scheme: dark)");
    #core;
    constructor(core) {
      this.#core = core;
    }
    /**
     * Apply a theme mode and emit the `fixit:switch-theme` event.
     * @param mode - `'auto'`, `'light'`, or `'dark'`.
     * @param persist - Whether to save the choice to localStorage (default: `true`).
     */
    setThemeMode(mode, persist = true) {
      const prevIsDark = this.#core.isDark;
      this.#core.themeMode = mode;
      document.documentElement.dataset.themeMode = mode;
      this.#core.isDark = mode === "auto" ? this.#mql.matches : mode === "dark";
      if (persist) {
        window.localStorage?.setItem("theme-mode", mode);
      }
      eventBus.emit("fixit:switch-theme", {
        isDark: this.#core.isDark,
        mode,
        isChanged: prevIsDark !== this.#core.isDark
      });
    }
    /** Sync the `<meta name="theme-color">` tag with the current color scheme. */
    initThemeColor() {
      const $meta = document.querySelector('[name="theme-color"]');
      if (!$meta)
        return;
      const applyThemeColor = (isDark) => {
        $meta.content = isDark ? $meta.dataset.dark : $meta.dataset.light;
      };
      eventBus.on("fixit:switch-theme", ({ detail }) => {
        if (!detail.isChanged)
          return;
        applyThemeColor(detail.isDark);
      });
      applyThemeColor(this.#core.isDark);
    }
    /** Initialize the theme switch button cycle and system preference listener. */
    initSwitchTheme() {
      const modes = ["auto", "light", "dark"];
      document.querySelectorAll(".theme-switch").forEach(($themeSwitch) => {
        $themeSwitch.addEventListener("click", () => {
          const currentIndex = modes.indexOf(this.#core.themeMode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          this.setThemeMode(nextMode);
        }, false);
      });
      this.#mql.addEventListener("change", (e) => {
        if (this.#core.themeMode !== "auto")
          return;
        const prevIsDark = this.#core.isDark;
        this.#core.isDark = e.matches;
        eventBus.emit("fixit:switch-theme", {
          isDark: this.#core.isDark,
          mode: "auto",
          isChanged: prevIsDark !== this.#core.isDark
        });
      });
    }
    /** Initialize theme color and switch handler. */
    setup() {
      this.initThemeColor();
      this.initSwitchTheme();
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\modules\toc.ts
  var TOC_CONTAINER_IDS = ["toc-content-auto", "toc-content-static", "toc-content-drawer"];
  var TocModule = class {
    #activeTocId = null;
    /** Get all TOC content containers (auto, static, and drawer). */
    #getTocContainers() {
      return TOC_CONTAINER_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    }
    /**
     * Determine which heading is currently active based on scroll position.
     * @returns The active heading element, or `null` if none found.
     */
    #getActiveTocHeading() {
      const $headingElements = Array.from(document.querySelectorAll(".heading-element[id]"));
      if (!$headingElements.length)
        return null;
      const headerOffset = (() => {
        const headerId = isMobile() ? "header-mobile" : "header-desktop";
        const $header = document.getElementById(headerId);
        const headerMode = document.body.getAttribute(`data-${headerId}`);
        if (!$header || window.getComputedStyle($header).display === "none")
          return 0;
        const shouldApplyOffset = headerMode === "sticky" || headerMode === "auto" && !$header.classList.contains("header__fadeOutUp");
        return shouldApplyOffset ? $header.offsetHeight : 0;
      })();
      const breadcrumbOffset = document.querySelector(".breadcrumb-container")?.offsetHeight || 0;
      const indexOffset = 20 + headerOffset + breadcrumbOffset;
      const threshold = window.scrollY + indexOffset + 1;
      let $activeHeading = $headingElements[0];
      for (const $heading of $headingElements) {
        const headingTop = window.scrollY + $heading.getBoundingClientRect().top;
        if (headingTop <= threshold) {
          $activeHeading = $heading;
        } else {
          break;
        }
      }
      return $activeHeading;
    }
    /**
     * Find the TOC link that points to the given heading id.
     * @param $tocRoot - The TOC root container element.
     * @param id - The heading id (without `#`).
     * @returns The matching anchor element, or `null`.
     */
    #getTocLinkById($tocRoot, id) {
      if (!$tocRoot || !id)
        return null;
      const targetHash = `#${id}`;
      return Array.from($tocRoot.querySelectorAll('a[href^="#"]')).find(($link) => $link.getAttribute("href") === targetHash) || null;
    }
    /**
     * Highlight the active TOC item and its parent chain.
     * @param $tocRoot - The TOC root container element.
     * @param activeId - The id of the currently active heading.
     */
    #applyTocActiveState($tocRoot, activeId) {
      if (!$tocRoot)
        return;
      $tocRoot.querySelectorAll('a[href^="#"]').forEach(($tocLink) => {
        $tocLink.classList.remove("active");
      });
      $tocRoot.querySelectorAll("li").forEach(($tocLi) => {
        $tocLi.classList.remove("has-active");
      });
      const $activeLink = this.#getTocLinkById($tocRoot, activeId);
      if (!$activeLink)
        return;
      $activeLink.classList.add("active");
      let $parent = $activeLink.closest("li");
      while ($parent) {
        $parent.classList.add("has-active");
        $parent = $parent.parentElement?.closest("li") || null;
      }
    }
    /**
     * Scroll the active TOC link into the visible area of its container.
     * @param $tocRoot - The TOC root container element.
     * @param activeId - The id of the currently active heading.
     * @param $scrollContainer - The scrollable container (defaults to `$tocRoot`).
     */
    #scrollActiveTocLinkIntoView($tocRoot, activeId, $scrollContainer = $tocRoot) {
      const $activeLink = this.#getTocLinkById($tocRoot, activeId);
      if (!$activeLink || !$scrollContainer)
        return;
      const containerRect = $scrollContainer.getBoundingClientRect();
      const linkRect = $activeLink.getBoundingClientRect();
      const offsetTop = linkRect.top - containerRect.top;
      const offsetBottom = linkRect.bottom - containerRect.bottom;
      if (offsetTop < 0) {
        $scrollContainer.scrollTop += offsetTop;
      } else if (offsetBottom > 0) {
        $scrollContainer.scrollTop += offsetBottom;
      }
    }
    /** Update the TOC container's max-height CSS variable to fit the viewport. */
    syncTocHeight() {
      const $toc = document.getElementById("toc-auto");
      const $tocContentAuto = document.getElementById("toc-content-auto");
      if ($toc && $tocContentAuto) {
        const maxHeight = Math.max(window.innerHeight - $tocContentAuto.getBoundingClientRect().top - 16);
        $tocContentAuto.style.setProperty("--fi-toc-content-max-height", `${Math.floor(maxHeight)}px`);
      }
    }
    /** Sync the active heading highlight across all TOC containers. */
    syncTocActiveState() {
      const $activeHeading = this.#getActiveTocHeading();
      if (!$activeHeading?.id)
        return;
      const activeId = $activeHeading.id;
      const $tocRoots = this.#getTocContainers().map(($container) => $container.querySelector("nav")).filter(Boolean);
      $tocRoots.forEach(($tocRoot) => {
        this.#applyTocActiveState($tocRoot, activeId);
      });
      if (this.#activeTocId !== activeId) {
        this.#activeTocId = activeId;
        if (!isTocStatic()) {
          const $autoTocRoot = document.querySelector("#toc-content-auto > nav");
          const $autoTocContainer = document.getElementById("toc-content-auto");
          if ($autoTocRoot && $autoTocContainer) {
            this.#scrollActiveTocLinkIntoView($autoTocRoot, activeId, $autoTocContainer);
          }
        }
        if (document.getElementById("nav-dialog")?.open) {
          const $dialogTocRoot = document.querySelector("#toc-content-drawer > nav");
          this.#scrollActiveTocLinkIntoView($dialogTocRoot, activeId, $dialogTocRoot);
        }
      }
    }
    /** Sync TOC layout state: drawer button visibility, height, and active heading. */
    #syncTocLayout() {
      document.querySelector("#nav-drawer-button")?.classList.toggle("hidden", !isTocStatic());
      this.#activeTocId = null;
      this.syncTocHeight();
      this.syncTocActiveState();
    }
    /** Render TOC from `<template data-toc>` into static/auto/drawer containers. */
    renderToc() {
      const $tocTemplate = document.querySelector("template[data-toc]");
      if ($tocTemplate?.dataset.password)
        return;
      const $tocCore = $tocTemplate?.content.querySelector("#TableOfContents");
      if (!$tocTemplate || !$tocCore)
        return;
      for (const $container of this.#getTocContainers()) {
        $container.textContent = "";
        const $clone = $tocCore.cloneNode(true);
        $clone.removeAttribute("id");
        $container.appendChild($clone);
      }
    }
    /** Bind the `toc-auto` title click handler for show/hide toggle. */
    #initTocToggle() {
      const $toc = document.getElementById("toc-auto");
      const $tocContentAuto = document.getElementById("toc-content-auto");
      document.querySelector("#toc-auto>.toc-title")?.addEventListener("click", () => {
        const animation = ["animate__faster"];
        const tocHidden = $toc.classList.contains("toc-hidden");
        animation.push(tocHidden ? "animate__fadeIn" : "animate__fadeOut");
        if (tocHidden) {
          $tocContentAuto.classList.remove("hidden", "animate__fadeOut");
        } else {
          $tocContentAuto.classList.remove("animate__fadeIn");
        }
        animateCSS($tocContentAuto, animation, true, () => {
          $tocContentAuto.classList.contains("animate__fadeOut") && $tocContentAuto.classList.add("hidden");
        });
        $toc.classList.toggle("toc-hidden");
      }, false);
    }
    /** Initialize the mobile TOC drawer dialog and its open/close handlers. */
    #initTocDrawerLinkClose() {
      const dialog = document.querySelector("#nav-dialog");
      if (!dialog)
        return;
      document.querySelectorAll('#toc-content-drawer a[href^="#"]').forEach(($link) => {
        if ($link.dataset.tocDialogCloseBound === "true")
          return;
        $link.addEventListener("click", () => dialog.close());
        $link.dataset.tocDialogCloseBound = "true";
      });
    }
    /** Initialize the mobile TOC drawer dialog and its open/close handlers. */
    #initTocDrawer() {
      const dialog = document.querySelector("#nav-dialog");
      const openButton = document.querySelector("#nav-drawer-button");
      if (!dialog || !openButton)
        return;
      const closeButton = dialog.querySelector(".nav-close-btn");
      closeButton?.addEventListener("click", () => dialog.close());
      openButton.addEventListener("click", () => {
        dialog.showModal();
        openButton.setAttribute("aria-expanded", "true");
        this.syncTocHeight();
        this.syncTocActiveState();
        const $dialogTocRoot = document.querySelector("#toc-content-drawer > nav");
        this.#scrollActiveTocLinkIntoView($dialogTocRoot, this.#activeTocId, $dialogTocRoot);
        document.activeElement?.blur();
      });
      dialog.addEventListener("close", () => {
        openButton.setAttribute("aria-expanded", "false");
      });
    }
    /** Reset heading-mark nodes to fix the APlayer-caused anchor click issue. */
    #resetHeadingClicks() {
      if (typeof window.APlayer === "function") {
        document.querySelectorAll(".heading-mark").forEach(($headingMark) => {
          const $newHeadingMark = $headingMark.cloneNode(true);
          $headingMark.parentElement.replaceChild($newHeadingMark, $headingMark);
        });
      }
    }
    /** Initialize all TOC components and register event listeners. */
    setup() {
      this.renderToc();
      this.#initTocToggle();
      this.#syncTocLayout();
      this.#initTocDrawer();
      this.#initTocDrawerLinkClose();
      this.#resetHeadingClicks();
      eventBus.on("fixit:resize", () => this.#syncTocLayout());
      eventBus.on("fixit:scroll", () => this.syncTocActiveState());
      eventBus.on("fixit:content-decrypted", ({ detail }) => {
        if (detail.isPage) {
          this.#syncTocLayout();
          this.#initTocDrawerLinkClose();
        }
      });
      eventBus.on("fixit:re-encrypt", () => {
        this.#syncTocLayout();
      });
    }
  };

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\core\public-api.ts
  var PublicAPI = class {
    core;
    theme;
    code;
    toc;
    menu;
    search;
    enc;
    pwa;
    misc;
    content;
    events;
    eventBus = eventBus;
    constructor() {
      this.core = new CoreModule();
      this.theme = new ThemeModule(this.core);
      this.code = new CodeModule();
      this.toc = new TocModule();
      this.menu = new MenuModule(this.core);
      this.search = new SearchModule(this.core);
      this.enc = new EncryptionModule(this.core);
      this.pwa = new PWAModule(this.core);
      this.misc = new MiscModule(this.core);
      this.content = new ContentModule(this.core, this.code);
      this.events = new EventsModule(this.core, this.code);
    }
    get config() {
      return this.core.config;
    }
    get version() {
      return this.core.version;
    }
    get themeMode() {
      return this.core.themeMode;
    }
    get isDark() {
      return this.core.isDark;
    }
    get isRTL() {
      return this.core.isRTL;
    }
    setThemeMode(mode, persist) {
      this.theme.setThemeMode(mode, persist);
    }
  };

  // <stdin>
  function bootstrap() {
    window.fixit = new PublicAPI();
    function init() {
      try {
        window.fixit.menu.setup();
        window.fixit.theme.setup();
        window.fixit.toc.setup();
        window.fixit.search.setup();
        window.fixit.content.setup();
        window.fixit.enc.setup();
        window.fixit.pwa.setup();
        window.fixit.misc.setup();
        window.fixit.events.setup();
      } catch (err) {
        console.error(err);
      }
      printBanner(window.fixit.version);
    }
    document.addEventListener("DOMContentLoaded", init, false);
  }
  bootstrap();
})();
//# sourceMappingURL=main.js.map
