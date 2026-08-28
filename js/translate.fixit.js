"use strict";
(() => {
  // ns-hugo-params:<stdin>
  var detectLocalLanguage = false;
  var enterprise = false;
  var ignoreClass = [];
  var ignoreId = [];
  var ignoreSelector = [];
  var ignoreTag = [];
  var ignoreText = [];
  var languages = ["en", "chinese_simplified", "chinese_traditional", "japanese", "korean"];
  var service = "client.edge";
  var supportLanguages = [{ id: "mepeti", name: "Sepeti", serviceId: "nso" }, { id: "corsican", name: "hinaassicurasol", serviceId: "co" }, { id: "guarani", name: "ondoho", serviceId: "gn" }, { id: "kinyarwanda", name: "Kinyarwanda", serviceId: "rw" }, { id: "hausa", name: "dictionary variant", serviceId: "ha" }, { id: "norwegian", name: "Norge", serviceId: "no" }, { id: "dutch", name: "nederlands", serviceId: "nl" }, { id: "yoruba", name: "Yoruba", serviceId: "yo" }, { id: "english", name: "English", serviceId: "en" }, { id: "gongen", name: "\u0917\u094B\u0902\u0917\u0947\u0928 \u0939\u0947\u0902 \u0928\u093E\u0902\u0935", serviceId: "gom" }, { id: "latin", name: "Latina", serviceId: "la" }, { id: "nepali", name: "\u0928\u0947\u092A\u093E\u0932\u0940Name", serviceId: "ne" }, { id: "french", name: "Fran\xE7ais", serviceId: "fr" }, { id: "czech", name: "\u010Desk\xFD", serviceId: "cs" }, { id: "hawaiian", name: "paneke\u02BBhaka", serviceId: "haw" }, { id: "georgian", name: "\u10EF\u10DD\u10E0\u10EF\u10D8\u10D0\u10DC\u10D8Name", serviceId: "ka" }, { id: "russian", name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u044F\u0437\u044B\u043A", serviceId: "ru" }, { id: "serbian", name: "\u0421\u0440\u043F\u0441\u043A\u0438", serviceId: "sr" }, { id: "chinese_simplified", name: "\u7B80\u4F53\u4E2D\u6587", serviceId: "zh-CN" }, { id: "persian", name: "Persian", serviceId: "fa" }, { id: "bhojpuri", name: "\u0939\u092E\u093E\u0930 \u0915\u092A\u093E\u0930 \u0926\u0930\u094D\u0926 \u0915\u0930\u0924\u093E\u0964", serviceId: "bho" }, { id: "javanese", name: "basa jawa", serviceId: "jw" }, { id: "hindi", name: "\u0939\u093F\u0928\u094D\u0926\u0940", serviceId: "hi" }, { id: "belarusian", name: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044FName", serviceId: "be" }, { id: "esperanto", name: "Esperanto", serviceId: "eo" }, { id: "kazakh", name: "\u049B\u0430\u0437\u0430\u049B", serviceId: "kk" }, { id: "swahili", name: "Kiswahili", serviceId: "sw" }, { id: "oriya", name: "\u0B13\u0B21\u0B3F\u0B06", serviceId: "or" }, { id: "icelandic", name: "\xCDslandName", serviceId: "is" }, { id: "yiddish", name: "\u05D9\u05D9\u05B7\u05D3\u05D9\u05E9", serviceId: "yi" }, { id: "twi", name: "Ma fr\u025B", serviceId: "ak" }, { id: "irish", name: "\xCDris", serviceId: "ga" }, { id: "gujarati", name: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0", serviceId: "gu" }, { id: "khmer", name: "\u1797\u17B6\u179F\u17B6\u200B\u1781\u17D2\u1798\u17C2\u179AName", serviceId: "km" }, { id: "slovak", name: "Slovensk\xE1", serviceId: "sk" }, { id: "hebrew", name: "\u05D4\u05D9\u05D1\u05E8\u05D9\u05EA", serviceId: "iw" }, { id: "kannada", name: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1\u0CCDName", serviceId: "kn" }, { id: "hungarian", name: "magyar", serviceId: "hu" }, { id: "ilocano", name: "Ilocano", serviceId: "ilo" }, { id: "sundanese", name: "basa Sunda", serviceId: "su" }, { id: "tamil", name: "\u0BA4\u0BBE\u0BAE\u0BBF\u0BB2\u0BCD", serviceId: "ta" }, { id: "arabic", name: "\u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629", serviceId: "ar" }, { id: "bengali", name: "\u09AC\u09C7\u0999\u09CD\u0997\u09BE\u09B2\u09C0", serviceId: "bn" }, { id: "azerbaijani", name: "azerbaijani", serviceId: "az" }, { id: "samoan", name: "lifiava", serviceId: "sm" }, { id: "afrikaans", name: "afrikaans", serviceId: "af" }, { id: "indonesian", name: "IndonesiaName", serviceId: "id" }, { id: "danish", name: "dansk", serviceId: "da" }, { id: "uyghur", name: "\u0626\u06C7\u064A\u063A\u06C7\u0631", serviceId: "ug" }, { id: "afrikaans_xhosa", name: "Afrikaans isiXhosa", serviceId: "xh" }, { id: "meitei", name: "\uABC3\uABE6\uABCF\uABC7\uABE6\uABCF\uABEB", serviceId: "mni-Mtei" }, { id: "shona", name: "Shona", serviceId: "sn" }, { id: "bambara", name: "Bamanankan", serviceId: "bm" }, { id: "lithuanian", name: "Lietuva", serviceId: "lt" }, { id: "uzbek", name: "o'zbek", serviceId: "uz" }, { id: "vietnamese", name: "Ti\u1EBFng Vi\u1EC7t", serviceId: "vi" }, { id: "lingala", name: "Lingala", serviceId: "ln" }, { id: "maltese", name: "Malti", serviceId: "mt" }, { id: "turkmen", name: "T\xFCrkmen\xE7e", serviceId: "tk" }, { id: "assamese", name: "assamese", serviceId: "as" }, { id: "catalan", name: "catal\xE0", serviceId: "ca" }, { id: "singapore", name: "\u0DC3\u0DD2\u0D82\u0D9C\u0DCF\u0DB4\u0DD4\u0DBB\u0DCA", serviceId: "si" }, { id: "cebuano", name: "cebuano", serviceId: "ceb" }, { id: "sanskrit", name: "Sanskrit", serviceId: "sa" }, { id: "polish", name: "Polski", serviceId: "pl" }, { id: "galician", name: "galico", serviceId: "gl" }, { id: "latvian", name: "latvie\u0161u", serviceId: "lv" }, { id: "ukrainian", name: "\u0423\u043A\u0440\u0430\u0457\u043D\u0430", serviceId: "uk" }, { id: "tatar", name: "\u0422\u0430\u0442\u0430\u0440", serviceId: "tt" }, { id: "scottish_gaelic", name: "G\xE0idhlig na h-Alba", serviceId: "gd" }, { id: "welsh", name: "Iaith Weleg", serviceId: "cy" }, { id: "japanese", name: "\u65E5\u672C\u8A9E", serviceId: "ja" }, { id: "filipino", name: "Pilipino", serviceId: "tl" }, { id: "aymara", name: "aymara.", serviceId: "ay" }, { id: "lao", name: "\u0E81\u0EB0\u0EA3\u0EB8\u0E99\u0EB2", serviceId: "lo" }, { id: "mongolian", name: "\u041C\u043E\u043D\u0433\u043E\u043B", serviceId: "mn" }, { id: "telugu", name: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41Name", serviceId: "te" }, { id: "romanian", name: "Rom\xE2n\u0103", serviceId: "ro" }, { id: "haitian_creole", name: "Krey\xF2l ayisyen", serviceId: "ht" }, { id: "dogrid", name: "\u0915\u0941\u0915\u0941\u0930\u092E\u0941\u0924\u094D\u0924\u093E", serviceId: "doi" }, { id: "swedish", name: "Svenska", serviceId: "sv" }, { id: "maithili", name: "\u092E\u0930\u093E\u0924\u093F\u0932\u0940Name", serviceId: "mai" }, { id: "malagasy", name: "Malagasy", serviceId: "mg" }, { id: "thai", name: "\u0E04\u0E19\u0E44\u0E17\u0E22", serviceId: "th" }, { id: "armenian", name: "\u0531\u0580\u0574\u0565\u0576\u0575\u0561\u0576", serviceId: "hy" }, { id: "burmese", name: "\u1017\u102C\u101B\u1019\u103A", serviceId: "my" }, { id: "pashto", name: "\u067E\u069A\u062A\u0648Name", serviceId: "ps" }, { id: "hmong", name: "hmong", serviceId: "hmn" }, { id: "dhivehi", name: "\u078B\u07A8\u0788\u07A7\u0783\u07A9\u0788\u07B0", serviceId: "dv" }, { id: "chinese_traditional", name: "\u7E41\u9AD4\u4E2D\u6587", serviceId: "zh-TW" }, { id: "luxembourgish", name: "L\xEBtzebuergeschName", serviceId: "lb" }, { id: "sindhi", name: "\u0633\u0646\u068C\u064A", serviceId: "sd" }, { id: "kurdish", name: "Kurd\xEE", serviceId: "ku" }, { id: "turkish", name: "T\xFCrk\xE7e", serviceId: "tr" }, { id: "macedonian", name: "\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438", serviceId: "mk" }, { id: "bulgarian", name: "\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438", serviceId: "bg" }, { id: "malay", name: "Malay", serviceId: "ms" }, { id: "sesotho", name: "sesotho", serviceId: "st" }, { id: "luganda", name: "luganda", serviceId: "lg" }, { id: "south_african_zulu", name: "IsiZulu saseNingizimu Afrika", serviceId: "zu" }, { id: "marathi", name: "\u092E\u0930\u093E\u0920\u0940Name", serviceId: "mr" }, { id: "estonian", name: "eesti keel", serviceId: "et" }, { id: "malayalam", name: "\u0D2E\u0D32\u0D2E\u0D3E\u0D32\u0D02", serviceId: "ml" }, { id: "deutsch", name: "Deutsch", serviceId: "de" }, { id: "slovene", name: "sloven\u0161\u010Dina", serviceId: "sl" }, { id: "urdu", name: "\u0627\u0648\u0631\u062F\u0648", serviceId: "ur" }, { id: "portuguese", name: "portugu\xEAs", serviceId: "pt" }, { id: "igbo", name: "igbo", serviceId: "ig" }, { id: "tigri", name: "\u1275\u130D\u122D\u129B", serviceId: "ti" }, { id: "kurdish_sorani", name: "\u06A9\u0648\u0631\u062F\u06CC \u0633\u06C6\u0631\u0627\u0646\u06CC", serviceId: "ckb" }, { id: "oromo", name: "adeta", serviceId: "om" }, { id: "greek", name: "\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", serviceId: "el" }, { id: "spanish", name: "Espa\xF1ol", serviceId: "es" }, { id: "frisian", name: "frysk", serviceId: "fy" }, { id: "somali", name: "Soomaali", serviceId: "so" }, { id: "mizo", name: "Mizo tawng", serviceId: "lus" }, { id: "amharic", name: "amharic", serviceId: "am" }, { id: "nyanja", name: "potakuyan", serviceId: "ny" }, { id: "punjabi", name: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40Name", serviceId: "pa" }, { id: "basque", name: "baskoa", serviceId: "eu" }, { id: "italian", name: "italiano", serviceId: "it" }, { id: "albanian", name: "albanian", serviceId: "sq" }, { id: "korean", name: "\uD55C\uAD6D\uC5B4", serviceId: "ko" }, { id: "tajik", name: "\u0422\u0430jik\u04E3Name", serviceId: "tg" }, { id: "finnish", name: "suomi", serviceId: "fi" }, { id: "kyrgyz", name: "\u041A\u044B\u0440\u0433\u044B\u0437 \u0442\u0438\u043B\u0438", serviceId: "ky" }, { id: "ewe", name: "E\u028Begbe", serviceId: "ee" }, { id: "croatian", name: "hrvatski", serviceId: "hr" }, { id: "zongjia", name: "zongjia", serviceId: "ts" }, { id: "creole", name: "a n:n", serviceId: "kri" }, { id: "quechua", name: "Quechua", serviceId: "qu" }, { id: "bosnian", name: "bosnian", serviceId: "bs" }, { id: "maori", name: "Maori", serviceId: "mi" }];

  // ns-hugo-imp:C:\Users\13929\blog\themes\cmpt-translate\assets\js\translate.config.ts
  var IGNORE_FIXIT = [
    "fi-at-ignore",
    "header-title",
    "language-switch",
    "post-author",
    "powered",
    "author",
    "typeit",
    "katex",
    "katex-display",
    "message-content",
    "cell-watermark"
  ];
  var IGNORE_CMPTS = [
    // hugo-fixit/component-projects
    "repo-url",
    "repo-visibility",
    "repo-lang",
    // hugo-fixit/shortcode-mmt-netease
    "netease-music",
    "comment-163"
  ];
  var IGNORE_SELECTOR = [
    // hugo-fixit/component-projects
    '[data-adapters="projects"] .single-subtitle'
  ];
  var IGNORE_TAG = [
    "cipher-text",
    "noscript"
  ];
  var IGNORE_TEXT = [
    "Hugo",
    "FixIt",
    "hugo-fixit",
    "Lruihao",
    "shortcode",
    "CC BY-NC-SA",
    "RSS"
  ];

  // ns-hugo-imp:C:\Users\13929\blog\themes\FixIt\assets\js\utils\media.ts
  function isMobile() {
    return window.matchMedia("only screen and (max-width: 680px)").matches;
  }

  // <stdin>
  var {
    hugoLangCodes,
    hugoLangMap,
    fromLanguages,
    onlyLocalLang,
    nomenclature
  } = window.ATConfig;
  var fixit = window.fixit;
  var translate = window.translate;
  var AutoTranslate = class {
    // Get params from Hugo project config
    service = service ?? "client.edge";
    languages = languages;
    ignoreClass = [
      ...IGNORE_FIXIT,
      ...IGNORE_CMPTS,
      ...ignoreClass
    ];
    ignoreId = ignoreId;
    ignoreTag = [
      ...IGNORE_TAG,
      ...ignoreTag
    ];
    ignoreSelector = [
      ...IGNORE_SELECTOR,
      ...ignoreSelector
    ];
    ignoreText = [
      ...IGNORE_TEXT,
      ...ignoreText
    ];
    detectLocalLanguage = detectLocalLanguage ?? false;
    enterprise = enterprise ?? false;
    isMobile = isMobile();
    afterExecuteEvents = /* @__PURE__ */ new Set();
    lang = { ...this.getTypesLang() };
    supportLanguages = {
      "client.edge": translate.service.edge.language.json,
      "translate.service": supportLanguages
    };
    hugoLangCodes = hugoLangCodes;
    hugoLangMap = hugoLangMap;
    fromLanguages = fromLanguages || [];
    onlyLocalLang = onlyLocalLang;
    nomenclature = nomenclature;
    dom = {};
    constructor() {
    }
    /**
     * Get language name by language id from translate.js service
     * @param {string} id The language id, e.g. 'chinese_simplified'
     * @returns {string} The language name, e.g. '简体中文'
     */
    getLangNameById(id) {
      return this.supportLanguages[this.service]?.find((lang) => lang.id === id)?.name;
    }
    /**
     * Get browser language code by language id from translate.js service
     * @param {string} id The language id, e.g. 'chinese_simplified'
     * @returns {Array<string>} The language code, e.g. ['zh', 'zh-CN']
     */
    getLangCodeById(id) {
      return Object.keys(translate.util.browserLanguage).filter((code) => translate.util.browserLanguage[code] === id);
    }
    /**
     * Get language id by browser language code
     * @param {string} code The language code, e.g. 'zh-CN'
     * @returns {string} The language id, e.g. 'chinese_simplified'
     */
    getLangIdByCode(code) {
      return translate.util.browserLanguage[code];
    }
    /**
     * Get language types
     * @returns {object} The language types
     */
    getTypesLang() {
      return {
        current: translate.language.getCurrent(),
        local: window.ATConfig.local || translate.language.getLocal(),
        query: window.location.search.split("lang=")[1],
        browser: this.lang?.browser || ""
      };
    }
    /**
     * Toggle element visibility
     * @param {HTMLElement} el
     * @param {boolean} visibility
     */
    toggleVisibility(el, visibility) {
      el.classList.toggle("hidden", !visibility);
      el.setAttribute("aria-hidden", `${!visibility}`);
    }
    /**
     * Toggle active class for language switch menu
     * @param {HTMLElement} el
     */
    toggleMenuActive(el) {
      Array.from(this.dom.switchMenu.childNodes).filter((node) => node.classList.contains("active")).forEach((item) => {
        item.classList.remove("active");
      });
      el.classList.add("active");
    }
    /**
     * Handle desktop language switch
     */
    handleDesktop() {
      this.dom.switchDesktop = document.querySelector("#header-desktop .language-switch.auto");
      if (!this.dom.switchDesktop) {
        return;
      }
      this.dom.switchMenu = this.dom.switchDesktop.querySelector(".sub-menu");
      this.dom.localItems && this.dom.switchMenu.append(...this.dom.localItems);
      this.handleArtificialItems();
      this.handleMachineItems();
      const originSwitchDesktop = this.dom.switchDesktop.previousElementSibling;
      if (originSwitchDesktop.classList.contains("language-switch")) {
        this.toggleVisibility(originSwitchDesktop, false);
      }
      this.toggleVisibility(this.dom.switchDesktop, true);
      this.afterExecuteEvents.add(() => {
        this.lang = { ...this.getTypesLang() };
        const { current, local, query } = this.getTypesLang();
        this.lang = { ...this.lang, current, query };
        if (current !== local || query) {
          const menuLink = document.querySelector(`.menu-link[data-lang="${current}"]`);
          if (menuLink && menuLink.parentElement) {
            this.toggleMenuActive(menuLink.parentElement);
          }
        }
      });
    }
    /**
     * Handle Hugo project artificial language items for desktop
     */
    handleArtificialItems() {
      const artificialItems = Array.from(this.dom.switchMenu.childNodes).filter((node) => node.dataset.type === "artificial");
      artificialItems.forEach((item) => {
        if (item.classList.contains("active") && !item.children[0].getAttribute("title")) {
          const langName = this.getLangNameById(this.lang.local);
          if (langName) {
            item.children[0].setAttribute("title", langName);
            item.children[0].insertAdjacentText("beforeend", langName);
          }
        }
        item.addEventListener("click", () => {
          translate.language.clearCacheLanguage();
        });
      });
    }
    /**
     * Handle translate.js machine language items for desktop
     */
    handleMachineItems() {
      const machineItems = Array.from(this.dom.switchMenu.childNodes).filter((node) => node.dataset.type === "machine");
      machineItems.forEach((item) => {
        const langId = item.children[0].dataset.lang;
        const langName = this.getLangNameById(langId);
        const langCodes = this.getLangCodeById(langId);
        if (this.service === "client.edge") {
          if (!langName) {
            this.toggleVisibility(item, false);
            return;
          }
        }
        if (langCodes.some((code) => this.hugoLangCodes.includes(code)) || langId === this.lang.local) {
          this.toggleVisibility(item, false);
          return;
        }
        item.addEventListener("click", () => {
          window.history.pushState({}, "", `?lang=${langId}`);
          this.toggleMenuActive(item);
          translate.changeLanguage(langId);
        });
      });
    }
    /**
     * Handle mobile language switch
     */
    handleMobile() {
      this.dom.switchMobile = document.querySelector("#header-mobile .language-switch.auto");
      if (!this.dom.switchMobile) {
        return;
      }
      this.selectOnChangeMobile();
      this.afterExecuteEvents.add(() => {
        new Promise((resolve) => {
          const timer = setInterval(() => {
            this.dom.selectEl = this.dom.switchMobile.querySelector("select");
            if (this.dom.selectEl) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        }).then(() => {
          this.dom.selectEl.classList.add("language-select");
          this.handleMachineOptions();
          this.handleArtificialOptions();
          const { current, local, query } = this.getTypesLang();
          this.lang = { ...this.lang, current, query };
          if (current !== local || query) {
            this.dom.selectEl.value = current;
          }
          this.toggleVisibility(this.dom.switchMobile, true);
          this.dom.switchMobile.removeAttribute("id");
          this.dom.selectEl.id = "auto-language-select";
          translate.selectLanguageTag.show = false;
        });
      });
    }
    selectOnChangeMobile() {
      translate.selectLanguageTag.selectOnChange = (e) => {
        const target = e.target;
        const lang = target.value;
        if (target.options[target.selectedIndex].dataset.type === "artificial") {
          translate.language.clearCacheLanguage();
          window.location.href = lang;
        } else {
          window.history.pushState({}, "", `?lang=${lang}`);
          translate.changeLanguage(lang);
          document.getElementById("menu-toggle-mobile")?.click();
        }
      };
    }
    handleMachineOptions() {
      this.dom.selectEl.querySelectorAll("option").forEach((option) => {
        option.dataset.type = "machine";
        option.textContent = `\u{1F916} ${option.textContent}`;
        const langCodes = this.getLangCodeById(option.value);
        if (langCodes.some((code) => this.hugoLangCodes.includes(code)) || option.value === this.lang.local) {
          option.parentElement.removeChild(option);
        }
      });
    }
    handleArtificialOptions() {
      const originSwitchMobile = this.dom.switchMobile.previousElementSibling;
      if (this.hugoLangCodes.length > 1) {
        originSwitchMobile.querySelectorAll("option").forEach((option) => {
          if (!option.getAttribute("value")) {
            return option.parentElement.removeChild(option);
          }
          option.dataset.type = "artificial";
          option.textContent = `\u{1F464} ${option.textContent}`;
          option.disabled && option.removeAttribute("disabled");
        });
        this.dom.selectEl.prepend(...originSwitchMobile.querySelectorAll("option:not([selected])"));
        this.dom.selectEl.prepend(originSwitchMobile.querySelector("option[selected]"));
        this.toggleVisibility(originSwitchMobile, false);
        return;
      }
      const selectBtn = this.dom.switchMobile.querySelector('[role="button"]');
      const langName = this.getLangNameById(this.lang.local);
      if (!selectBtn.dataset.current) {
        selectBtn.dataset.current = langName;
        selectBtn.insertAdjacentText("afterbegin", langName);
      }
      const currentItem = document.createElement("option");
      currentItem.selected = true;
      currentItem.dataset.type = "artificial";
      currentItem.value = window.location.pathname;
      currentItem.textContent = `\u{1F464} ${langName}`;
      this.dom.selectEl.prepend(currentItem);
      if (originSwitchMobile?.classList?.contains("language-switch")) {
        this.toggleVisibility(originSwitchMobile, false);
      }
    }
    handle() {
      if (this.isMobile) {
        this.handleMobile();
      } else {
        this.handleDesktop();
      }
      return this;
    }
    setup() {
      if (this.enterprise) {
        translate.enterprise.use();
      } else {
        translate.service.use(this.service);
      }
      document.querySelectorAll(this.ignoreSelector.join(",")).forEach((el) => {
        el.classList.add("fi-at-ignore");
      });
      this.nomenclature?.forEach((item) => {
        translate.nomenclature.append(
          item.from,
          item.to,
          Object.keys(item.properties).map((key) => `${key}=${item.properties[key]}`).join("\n")
        );
      });
      if (this.onlyLocalLang) {
        this.fromLanguages = [this.lang.local];
      }
      translate.language.translateLanguagesRange = this.fromLanguages;
      translate.ignore.id.push(...this.ignoreId);
      translate.ignore.class.data.push(...this.ignoreClass);
      translate.ignore.tag.push(...this.ignoreTag);
      translate.ignore.text.push(...this.ignoreText);
      translate.language.setLocal(this.lang.local);
      translate.language.setUrlParamControl("lang");
      translate.listener.start();
      translate.selectLanguageTag.show = this.isMobile;
      translate.selectLanguageTag.languages = this.languages.join(",");
      return this;
    }
    execute() {
      translate.execute();
      this.afterExecuteEvents.forEach((event) => {
        event();
      });
    }
    /**
     * Translate the AI summary from local to current language
     */
    translateAISummary() {
      const { current, local } = this.getTypesLang();
      if (typeof tianliGPT_postSelector === "undefined" || current === local) {
        return;
      }
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const summary = document.querySelector(".tianliGPT-explanation");
            let cursor;
            if (summary) {
              cursor = summary.querySelector(".blinking-cursor");
              cursor && summary.classList.add("fi-at-ignore");
            }
            if (!summary || cursor) {
              return;
            }
            summary.classList.remove("fi-at-ignore");
          }
        }
      });
      observer.observe(document.getElementById("content"), {
        childList: true,
        subtree: true
      });
    }
    /**
     * Translate text by translate.js service
     * @param {object} param
     * @param {Array<string>} param.texts The texts to be translated
     * @param {string} param.from The original language code
     * @param {string} param.to The target language code
     * @returns {Promise<string>} The translated text
     */
    translateText({ texts, from, to }) {
      return new Promise((resolve) => {
        translate.request.translateText({
          from,
          to,
          texts
        }, (data) => {
          if (data.result === 1) {
            resolve(data.text[0]);
            return;
          }
          console.error("Translate text error:", data.info);
          resolve(data.info);
        });
      });
    }
    /**
     * Get user local language by browser or IP
     * @returns {Promise<string>} The user local language
     */
    async getBrowserLanguage() {
      let lang = translate.util.browserDefaultLanguage();
      let loading = true;
      if (!lang) {
        translate.request.post(translate.request.api.ip, {}, (data) => {
          loading = false;
          if (data.result !== 0) {
            lang = data.language;
            return;
          }
          console.warn("Can not get the language by ip", data.info);
        });
      } else {
        loading = false;
      }
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (!loading) {
            clearInterval(timer);
            resolve(lang);
          }
        }, 100);
      });
    }
    addLangItem(langId) {
      if (!langId) {
        return false;
      }
      const langName = this.getLangNameById(langId);
      const langCodes = this.getLangCodeById(langId);
      if (langName && !langCodes.some((code) => this.hugoLangCodes.includes(code)) && this.languages.length && !this.languages.includes(langId)) {
        this.languages.push(langId);
        const langItem = document.createElement("li");
        langItem.classList.add("menu-item");
        langItem.dataset.type = "machine";
        langItem.innerHTML = `<a data-lang="${langId}" class="menu-link" title="${langName}"><i class="fa-solid fa-robot fa-fw fa-sm" aria-hidden="true"></i> ${langName}</a>`;
        this.dom.localItems = this.dom.localItems ? [...this.dom.localItems, langItem] : [langItem];
        return true;
      }
      return false;
    }
    /**
     * Auto discriminate local language
     */
    autoSelectLocalLanguage() {
      this.addLangItem(this.lang.query || this.lang.current);
      if (!this.detectLocalLanguage) {
        return;
      }
      const AutoDetected = localStorage.getItem("AutoTranslate_detected");
      if (this.addLangItem(this.lang.browser)) {
        if (AutoDetected !== "true" && !this.lang.query) {
          translate.language.setDefaultTo(this.lang.browser);
          localStorage.setItem("AutoTranslate_detected", "true");
        }
        return;
      }
      if (AutoDetected !== "true" && !this.lang.query) {
        const langCodes = this.getLangCodeById(this.lang.browser);
        const langCode = langCodes.find((code) => this.hugoLangCodes.includes(code)) || "";
        if (this.hugoLangCodes.includes(langCode) && !window.location.pathname.includes(this.hugoLangMap[langCode])) {
          window.location.assign(this.hugoLangMap[langCode]);
        }
        localStorage.setItem("AutoTranslate_detected", "true");
      }
    }
    clearCache() {
      localStorage.removeItem("AutoTranslate_detected");
      translate.language.clearCacheLanguage();
    }
    /**
     * Init the AutoTranslate component
     * workflow:
     * 1. Setup the translate.js service
     * 2. Handle the language switch
     * 3. Execute automatic translation
     */
    init() {
      this.getBrowserLanguage().then((lang) => {
        if (!lang) {
          this.detectLocalLanguage = false;
        }
        this.lang.browser = lang;
        this.autoSelectLocalLanguage();
        this.setup();
        this.handle();
        this.execute();
        this.translateAISummary();
      });
    }
  };
  fixit.autoTranslate = new AutoTranslate();
  if (document.readyState !== "loading") {
    fixit.autoTranslate.init();
  } else {
    document.addEventListener("DOMContentLoaded", () => fixit.autoTranslate.init(), false);
  }
})();
//# sourceMappingURL=translate.fixit.js.map
