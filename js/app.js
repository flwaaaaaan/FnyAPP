// 平滑滚动 & 简单导航高亮 & 滚动动画
(function () {
  const links = document.querySelectorAll('a[href^="#"], button[data-scroll-target]');
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav-link");

  function getHeaderOffset() {
    return header ? header.offsetHeight + 12 : 0;
  }

  function smoothScrollTo(target) {
    const el =
      typeof target === "string"
        ? document.querySelector(target)
        : target instanceof HTMLElement
        ? target
        : null;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      const dataTarget = link.getAttribute("data-scroll-target");
      if (hash && hash.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(hash);
      } else if (dataTarget) {
        e.preventDefault();
        smoothScrollTo(dataTarget);
      }
    });
  });

  // 滚动时根据位置高亮导航
  const sections = ["#features", "#experience", "#screens", "#download"]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  function updateNavHighlight() {
    const scrollPos = window.scrollY + getHeaderOffset() + 60;
    let activeId = "";

    for (const section of sections) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeId = "#" + section.id;
        break;
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === activeId) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  // 导航栏滚动样式
  function updateHeaderStyle() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // 滚动动画观察器 - 使用更高效的配置
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      ".feature-card, .glass-card, .screen-mockup, .section-header, .download-copy, .download-qr, .connection-node, .connection-service-item, .connection-center-block"
    );

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // 观察一次后停止观察，减少性能开销
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
      el.classList.add("animate-on-scroll");
      // 为不同元素添加延迟
      if (index % 2 === 1) {
        el.classList.add("animate-delay-1");
      }
      if (index % 3 === 2) {
        el.classList.add("animate-delay-2");
      }
      observer.observe(el);
    });
  }

  // 使用 passive 事件监听器优化滚动性能
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavHighlight();
        updateHeaderStyle();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateNavHighlight();
  updateHeaderStyle();

  // 初始化滚动动画
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // Footer 年份
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// 全球节点卡片生成 - 优化版本
(function () {
  const nodes = [
    { name: "中国香港", code: "hk" },
    { name: "加拿大", code: "ca" },
    { name: "德国", code: "de" },
    { name: "印度", code: "in" },
    { name: "英格兰", code: "gb-eng" },
    { name: "美国", code: "us" },
    { name: "韩国", code: "kr" },
    { name: "朝鲜", code: "kp" },
    { name: "日本", code: "jp" },
    { name: "南极洲", code: "aq" },
    { name: "新加坡", code: "sg" },
    { name: "中国台湾", code: "tw" },
    { name: "泰国", code: "th" },
    { name: "越南", code: "vn" },
    { name: "马来西亚", code: "my" },
    { name: "菲律宾", code: "ph" },
    { name: "印度尼西亚", code: "id" },
    { name: "土耳其", code: "tr" },
    { name: "俄罗斯", code: "ru" },
    { name: "法国", code: "fr" },
    { name: "西班牙", code: "es" },
    { name: "意大利", code: "it" },
    { name: "巴西", code: "br" },
    { name: "墨西哥", code: "mx" },
    { name: "阿根廷", code: "ar" },
    { name: "澳大利亚", code: "au" },
    { name: "新西兰", code: "nz" },
    { name: "南非", code: "za" },
    { name: "埃及", code: "eg" },
    { name: "以色列", code: "il" },
    { name: "阿联酋", code: "ae" },
    { name: "芬兰", code: "fi" },
    { name: "瑞典", code: "se" },
    { name: "丹麦", code: "dk" },
    { name: "荷兰", code: "nl" },
    { name: "比利时", code: "be" }
  ];

  function initNodes() {
    const grid = document.getElementById("node-grid");
    if (!grid) return;
    grid.textContent = "";

    // 使用 DocumentFragment 批量插入，减少重排
    const fragment = document.createDocumentFragment();
    
    nodes.forEach((node) => {
      const card = document.createElement("div");
      card.className = "node-card animate-on-scroll";

      const flag = document.createElement("img");
      flag.src = `img/flags/${node.code}.svg`;
      flag.width = 40;
      flag.height = 28;
      flag.alt = node.name;
      flag.className = "node-flag";
      flag.loading = "lazy";
      flag.decoding = "async";

      const name = document.createElement("span");
      name.className = "node-name";
      name.textContent = node.name;

      card.append(flag, name);
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);

    // 为节点卡片添加滚动动画观察
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const nodeCards = grid.querySelectorAll(".node-card");
    nodeCards.forEach((card, index) => {
      if (index % 3 === 1) card.classList.add("animate-delay-1");
      if (index % 3 === 2) card.classList.add("animate-delay-2");
      observer.observe(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNodes);
  } else {
    initNodes();
  }
})();

// 访问 / 下载链接智能测速
(function () {
  // 登录官网线路：只填“裸域名”（不带 /#/login），下面 login 目标会自动拼上 suffix。
  // 备用线路：在下面加一行裸域名即可自动参与测速，例如 "https://v2.fnyun.us"
  const LOGIN_GATEWAY_DOMAINS = [
    "https://v.fnyun.us",
    // "https://v2.fnyun.us",
  ];

  // iOS 线路：只填“裸域名”（无路径后缀）。
  // 备用线路：在下面加一行裸域名即可自动参与测速，例如 "https://ios2.fnyun.us"
  const IOS_MIRROR_DOMAINS = [
    "https://ios.fnyun.us",
    //"https://qq.com",
  ];

  // ①域名与文件名之间的固定路径。文件就在域名根目录时，留空写 "" 即可。
  //   例："/app/" → 域名/app/文件名 ； "" → 域名/文件名
  const DOWNLOAD_BASE_PATH = "";

  // ②各平台下载线路（安卓/Win/Mac 各自独立）
  //   file    = 安装包文件名（换版本只改这里）
  //   mirrors = 裸域名列表，会自动拼成「域名 + 上面的路径 + 文件名」的直链；加一行 = 多一条测速线路
  //   links   = 完整链接/网盘分享链，原样使用，也参与测速
  //             ⚠️ 网盘多为“落地页”（跳过去还要再点一次，非文件直链），且与自有 CDN 非同一文件，
  //                有可能“测速最快却把用户导去落地页”。仅作备用时按需添加。
  const DOWNLOADS = {
    android: {
      file: "FnCloud-3.2.6-android-arm64-v8a.apk",
      mirrors: ["https://app.fnyun.us"],
      links: ["https://axisnow.gh-proxy.org/https://github.com/FnCloud-APP/APP/releases/download/3.2.7/FnCloud-3.2.7-android-arm64-v8a.apk"],
    },
    windows: {
      file: "FnCloud-3.2.6-windows-amd64-setup.exe",
      mirrors: ["https://app.fnyun.us"],
      links: ["https://axisnow.gh-proxy.org/https://github.com/FnCloud-APP/APP/releases/download/3.2.7/FnCloud-3.2.7-windows-amd64-setup.exe"],
    },
    macosM: {
      file: "FnCloud-3.2.6-macos-arm64.dmg", // Apple 芯片（M 系列，arm64）
      mirrors: ["https://app.fnyun.us"],
      links: ["https://axisnow.gh-proxy.org/https://github.com/FnCloud-APP/APP/releases/download/3.2.7/FnCloud-3.2.7-macos-arm64.dmg"],
    },
    macosIntel: {
      file: "FnCloud-3.2.6-macos-amd64.dmg", // Intel 芯片（amd64）
      mirrors: ["https://app.fnyun.us"],
      links: ["https://axisnow.gh-proxy.org/https://github.com/FnCloud-APP/APP/releases/download/3.2.7/FnCloud-3.2.7-macos-amd64.dmg"],
    },
  };

  // 把「路径 + 文件名」拼成 suffix，自动补斜杠：""/"/app/"/"app"/"/app" 都正确
  function joinFile(file) {
    const mid = String(DOWNLOAD_BASE_PATH).replace(/^\/+|\/+$/g, "");
    return mid ? `/${mid}/${file}` : `/${file}`;
  }

  const DOWNLOAD_TARGETS = {
    login: {
      domains: LOGIN_GATEWAY_DOMAINS,
      suffix: "/#/login",
      preserveParams: true,
    },
    ios: {
      domains: IOS_MIRROR_DOMAINS,
      preserveParams: true,
    },
  };

  // 由上面的 DOWNLOADS 生成四个下载目标（mirrors→拼直链，links→原样）
  Object.keys(DOWNLOADS).forEach((platform) => {
    const cfg = DOWNLOADS[platform];
    DOWNLOAD_TARGETS[platform] = {
      urls: cfg.links || [],
      domains: cfg.mirrors || [],
      suffix: joinFile(cfg.file),
      preserveParams: true,
    };
  });

  const speedCache = new Map();
  const SPEED_TEST_TIMEOUT = 650;
  const STATUS_DELAY = 160;
  let statusTimer = null;
  let statusEl = null;

  function normalizeDomain(domain) {
    return domain.replace(/\/+$/, "");
  }

  function appendCurrentParams(url) {
    if (!window.location.search) return url;

    try {
      const targetUrl = new URL(url, window.location.href);
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        if (!targetUrl.searchParams.has(key)) {
          targetUrl.searchParams.set(key, value);
        }
      });
      return targetUrl.toString();
    } catch (error) {
      return url;
    }
  }

  function buildCandidates(platform) {
    const target = DOWNLOAD_TARGETS[platform];
    if (!target) return [];

    const urls = [];
    if (Array.isArray(target.urls)) {
      urls.push(...target.urls);
    }

    if (Array.isArray(target.domains)) {
      const suffix = target.suffix || "";
      target.domains.forEach((domain) => {
        urls.push(`${normalizeDomain(domain)}${suffix}`);
      });
    }

    const uniqueUrls = [...new Set(urls)];
    return target.preserveParams ? uniqueUrls.map(appendCurrentParams) : uniqueUrls;
  }

  function withProbeCacheBuster(url) {
    try {
      const probeUrl = new URL(url, window.location.href);
      probeUrl.searchParams.set("_speed", Date.now().toString(36));
      return probeUrl.toString();
    } catch (error) {
      return url;
    }
  }

  function probeUrl(url) {
    const cached = speedCache.get(url);
    if (cached && Date.now() - cached.checkedAt < 300000) {
      return Promise.resolve({ url, time: cached.time });
    }

    const start = performance.now();
    const canAbort = typeof AbortController !== "undefined";
    const controller = canAbort ? new AbortController() : null;
    const timer = canAbort ? window.setTimeout(() => controller.abort(), SPEED_TEST_TIMEOUT) : null;

    return fetch(withProbeCacheBuster(url), {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
    })
      .then(() => {
        const time = performance.now() - start;
        speedCache.set(url, { time, checkedAt: Date.now() });
        return { url, time };
      })
      .finally(() => {
        if (timer) window.clearTimeout(timer);
      });
  }

  async function pickFastestUrl(platform) {
    const candidates = buildCandidates(platform);
    if (candidates.length === 0) return "";
    if (candidates.length === 1) return candidates[0];

    const results = [];
    const probes = candidates.map((url) =>
      probeUrl(url)
        .then((result) => {
          results.push(result);
          return result;
        })
        .catch(() => null)
    );

    await Promise.race([
      Promise.all(probes),
      new Promise((resolve) => window.setTimeout(resolve, SPEED_TEST_TIMEOUT)),
    ]);

    if (results.length === 0) return candidates[0];
    results.sort((a, b) => a.time - b.time);
    return results[0].url;
  }

  function getGatewayStatus() {
    if (statusEl) return statusEl;

    statusEl = document.createElement("div");
    statusEl.className = "gateway-status";
    statusEl.innerHTML = `
      <span class="gateway-status-dot"></span>
      <span>正在匹配最优线路...</span>
    `;
    document.body.appendChild(statusEl);
    return statusEl;
  }

  function showGatewayStatus() {
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      getGatewayStatus().classList.add("is-visible");
    }, STATUS_DELAY);
  }

  function hideGatewayStatus() {
    window.clearTimeout(statusTimer);
    if (statusEl) statusEl.classList.remove("is-visible");
  }

  function setTestingState(link, testing) {
    if (!link) return;
    const title = link.querySelector(".store-badge-title");
    if (testing) {
      link.dataset.originalTitle = title ? title.textContent : "";
      link.classList.add("is-testing");
      if (title) title.textContent = "智能测速中...";
    } else {
      link.classList.remove("is-testing");
      if (title && link.dataset.originalTitle) {
        title.textContent = link.dataset.originalTitle;
      }
    }
  }

  async function routeToFastest(e, platform) {
    if (e) e.preventDefault();
    const link = e && e.currentTarget instanceof HTMLElement ? e.currentTarget : null;

    try {
      setTestingState(link, true);
      showGatewayStatus();
      const url = await pickFastestUrl(platform);
      if (url) {
        window.location.href = url;
      }
    } finally {
      hideGatewayStatus();
      setTestingState(link, false);
    }
  }

  window.smartGateway = routeToFastest;
  window.smartDownload = routeToFastest;
  window.getFastestDownloadUrl = pickFastestUrl;
})();

// 下载教程弹窗
(function () {
  const cur = "zh-CN";
  const DL_TEXT = {
    "zh-CN": {
      title: "下载前请注意",
      body: "FnCloud蜂鸟加速 目前在<strong>除中国大陆地区以外</strong>的所有 App Store 均可下载。请确认您使用的是非中国大陆区 Apple ID。",
      cancel: "取消",
      confirm: "前往 App Store",
    },
  };

  const MAC_TEXT = {
    "zh-CN": {
      title: "选择你的 Mac",
      body: "请选择与你的 Mac 芯片匹配的版本。",
      m: "M系列芯片",
      m_sub: "M1 到 M5",
      intel: "Intel 芯片",
      intel_sub: "约 2020 年及更早的 Intel Mac",
      cancel: "取消",
    },
  };

  const WIN_TEXT = {
    "zh-CN": {
      title: "在 Windows 上安装",
      body: "下载安装程序（.exe）并运行。",
      dl: "下载 Windows 版",
      dl_sub: ".exe 安装包 · x64",
      cancel: "取消",
    },
  };

  const MAC_GUIDE = {
    zh: `
<div style="background:#f4f8f6;border:1px solid #e0ede8;border-radius:14px;padding:14px 15px;">
  <strong style="display:block;color:#0d1f17;font-size:.86rem;margin-bottom:6px;">安装与首次打开</strong>
  <p style="font-size:.78rem;color:#5a7a6e;line-height:1.7;margin:0 0 14px;">打开 .dmg 后，按以下三步完成安装并打开：</p>
  <p style="font-size:.78rem;font-weight:700;color:#0d1f17;margin:0 0 8px;">① 把图标拖到「应用程序」文件夹完成安装</p>
  <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;border-radius:8px;border:1px solid #e0ede8">
    <defs><filter id="mgcn_ins"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".15"/></filter><clipPath id="mgcn_clip"><rect x="44" y="34" width="58" height="58" rx="15"/></clipPath></defs>
    <rect width="300" height="150" fill="#eef6f1" rx="8"/>
    <rect x="44" y="34" width="58" height="58" rx="15" fill="#fff" filter="url(#mgcn_ins)"/>
    <image href="img/app-icon.png" x="44" y="34" width="58" height="58" clip-path="url(#mgcn_clip)" preserveAspectRatio="xMidYMid slice"/>
    <text x="73" y="111" text-anchor="middle" font-size="11" fill="#1d1d1f" font-weight="bold">FnCloud</text>
    <text x="73" y="131" text-anchor="middle" font-size="10" fill="#5a7a6e">拖动</text>
    <path d="M118 56 h40 v-9 l22 13.5 -22 13.5 v-9 h-40 Z" fill="#5fc08a"/>
    <path d="M205 52 q0 -6 6 -6 h13 l5 6 Z" fill="#9ccdf5"/>
    <rect x="205" y="50" width="62" height="42" rx="6" fill="#7cc0f2" filter="url(#mgcn_ins)"/>
    <text x="236" y="80" text-anchor="middle" font-size="22" font-style="italic" font-weight="bold" fill="#eaf5ff">A</text>
    <circle cx="210" cy="86" r="9" fill="#fff" stroke="#d8dde3"/>
    <path d="M207 89 L213 83 M213 83 h-4 M213 83 v4" stroke="#333" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="236" y="111" text-anchor="middle" font-size="11" fill="#1d1d1f" font-weight="bold">应用程序</text>
    <text x="236" y="131" text-anchor="middle" font-size="10" fill="#5a7a6e">放到这里</text>
  </svg>
  <p style="font-size:.78rem;font-weight:700;color:#0d1f17;margin:15px 0 8px;">② 从「应用程序」打开，会看到此提示</p>
  <svg viewBox="0 0 300 196" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;border-radius:8px;border:1px solid #e0ede8">
    <defs><filter id="mgcn_s1"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-opacity=".18"/></filter><clipPath id="mgcn_clip2"><rect x="125" y="34" width="50" height="50" rx="12"/></clipPath></defs>
    <rect width="300" height="196" fill="#e9edf0" rx="8"/>
    <rect x="60" y="20" width="180" height="158" rx="14" fill="#fbfbfd" stroke="#d8dde3" stroke-width="1" filter="url(#mgcn_s1)"/>
    <rect x="125" y="34" width="50" height="50" rx="12" fill="#fff"/>
    <image href="img/app-icon.png" x="125" y="34" width="50" height="50" clip-path="url(#mgcn_clip2)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="170" cy="40" r="11" fill="#f5a623" stroke="#fff" stroke-width="2"/>
    <rect x="168.8" y="34" width="2.4" height="7" rx="1" fill="#fff"/><circle cx="170" cy="45" r="1.3" fill="#fff"/>
    <text x="150" y="108" text-anchor="middle" font-size="11.5" fill="#1d1d1f" font-weight="bold">无法打开“FnCloud”</text>
    <text x="150" y="126" text-anchor="middle" font-size="9.5" fill="#666">因为 Apple 无法检查它是否</text>
    <text x="150" y="139" text-anchor="middle" font-size="9.5" fill="#666">包含恶意软件。</text>
    <rect x="92" y="150" width="116" height="22" rx="6" fill="#e6e7ea" stroke="#d4d8dd" stroke-width="1"/>
    <text x="150" y="165" text-anchor="middle" font-size="11" fill="#1d1d1f">好</text>
  </svg>
  <p style="font-size:.78rem;font-weight:700;color:#0d1f17;margin:15px 0 8px;">③ 「系统设置」→「隐私与安全性」→「仍要打开」</p>
  <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;border-radius:8px;border:1px solid #e0ede8">
    <defs><marker id="mgcn_a2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#11B981"/></marker><filter id="mgcn_s2"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-opacity=".18"/></filter></defs>
    <rect width="300" height="150" fill="#e9edf0" rx="8"/>
    <rect x="22" y="16" width="256" height="118" rx="12" fill="#fbfbfd" stroke="#d8dde3" stroke-width="1" filter="url(#mgcn_s2)"/>
    <circle cx="40" cy="36" r="9" fill="#e6f6ee"/><path d="M36 36 l3 3 l6 -7" stroke="#11B981" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="56" y="34" font-size="11.5" fill="#1d1d1f" font-weight="bold">隐私与安全性</text>
    <line x1="22" y1="48" x2="278" y2="48" stroke="#edf0f2" stroke-width="1"/>
    <text x="36" y="74" font-size="10" fill="#555">已阻止使用“FnCloud”，因为</text>
    <text x="36" y="88" font-size="10" fill="#555">来自身份不明的开发者。</text>
    <rect x="188" y="98" width="74" height="24" rx="6" fill="#fff" stroke="#11B981" stroke-width="2"/>
    <text x="225" y="114" text-anchor="middle" font-size="11" fill="#0d1f17" font-weight="bold">仍要打开</text>
    <line x1="150" y1="110" x2="184" y2="110" stroke="#11B981" stroke-width="2.5" marker-end="url(#mgcn_a2)"/>
    <text x="92" y="114" font-size="11" fill="#11B981" font-weight="bold">点这里</text>
  </svg>
  <p style="font-size:.72rem;color:#7a968b;line-height:1.6;margin:11px 0 0;">提示：macOS 12 及更早版本路径为「系统偏好设置 → 安全性与隐私 → 仍要打开」。</p>
</div>`,
  };

  const WIN_GUIDE = {
    zh: `
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:14px 15px;">
  <strong style="display:block;color:#92400e;font-size:.86rem;margin-bottom:6px;">遇到安全提示？</strong>
  <p style="font-size:.78rem;color:#b45309;line-height:1.7;margin:0 0 14px;">如出现“Windows 已保护你的电脑”提示，请点击<strong style="color:#78350f;">「更多信息」</strong>，然后点击<strong style="color:#78350f;">「仍要运行」</strong>即可继续安装。</p>
  <p style="font-size:.78rem;font-weight:700;color:#92400e;margin:0 0 4px;">场景一：浏览器下载拦截</p>
  <p style="font-size:.75rem;color:#b45309;line-height:1.6;margin:0 0 8px;">Edge / Chrome 提示“此文件可能有风险”，点击 <strong>···</strong>，选 <strong>保留</strong>。</p>
  <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;border-radius:8px;border:1px solid #fde68a">
    <defs><marker id="tmcn_a1" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2563eb"/></marker><filter id="tmcn_sh1"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".2"/></filter></defs>
    <rect width="320" height="150" fill="#f0f2f5" rx="8"/>
    <text x="10" y="20" font-size="13" fill="#2563eb" font-weight="bold">① 点击 ··· 按钮</text>
    <rect x="10" y="28" width="300" height="40" rx="5" fill="#dde1e7"/>
    <rect x="16" y="35" width="16" height="19" rx="2" fill="#888"/><polygon points="26,35 32,35 32,42" fill="#bbb"/>
    <text x="36" y="50" font-size="11" fill="#333">FnCloud.exe</text>
    <text x="36" y="62" font-size="10" fill="#c0392b">⚠ 此文件可能会损害你的设备</text>
    <rect x="262" y="35" width="26" height="19" rx="4" fill="#b8c4d4" stroke="#99a" stroke-width="1.2"/>
    <text x="270" y="49" font-size="12" fill="#222" font-weight="bold">···</text>
    <line x1="275" y1="28" x2="275" y2="33" stroke="#2563eb" stroke-width="2.5" marker-end="url(#tmcn_a1)"/>
    <text x="10" y="92" font-size="13" fill="#2563eb" font-weight="bold">② 选择“保留”</text>
    <rect x="170" y="100" width="140" height="44" rx="6" fill="white" stroke="#ccc" stroke-width="1" filter="url(#tmcn_sh1)"/>
    <text x="182" y="117" font-size="11" fill="#888">在文件夹中显示</text>
    <line x1="178" y1="121" x2="302" y2="121" stroke="#eee" stroke-width="1"/>
    <rect x="178" y="124" width="124" height="16" rx="3" fill="#dbeafe"/>
    <text x="184" y="136" font-size="12" fill="#1d4ed8" font-weight="bold">保留</text>
    <line x1="163" y1="129" x2="169" y2="129" stroke="#2563eb" stroke-width="2.5" marker-end="url(#tmcn_a1)"/>
  </svg>
  <p style="font-size:.78rem;font-weight:700;color:#92400e;margin:15px 0 4px;">场景二：SmartScreen 拦截</p>
  <p style="font-size:.75rem;color:#b45309;line-height:1.6;margin:0 0 8px;">双击 .exe 弹出蓝色窗口，先点 <strong>更多信息</strong>，再点 <strong>仍要运行</strong>。</p>
  <svg viewBox="0 0 320 195" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;margin-bottom:8px;border-radius:8px;border:1px solid #fde68a">
    <defs><marker id="tmcn_a2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ff4444"/></marker><filter id="tmcn_sh2"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".3"/></filter></defs>
    <rect width="320" height="195" fill="#d8e4f0" rx="8"/>
    <rect x="20" y="12" width="280" height="172" rx="7" fill="#0546a0" filter="url(#tmcn_sh2)"/>
    <rect x="20" y="12" width="280" height="48" rx="7" fill="#033d8b"/>
    <rect x="20" y="40" width="280" height="20" fill="#033d8b"/>
    <text x="30" y="43" font-size="13" fill="white" font-weight="bold">Windows 已保护你的电脑</text>
    <text x="30" y="78" font-size="11" fill="white">Microsoft Defender SmartScreen</text>
    <text x="30" y="93" font-size="11" fill="white">阻止了一个未知应用的启动。</text>
    <text x="30" y="112" font-size="11" fill="#c8d8f0">发布者：未知</text>
    <text x="30" y="127" font-size="11" fill="#c8d8f0">应用：FnCloud.exe</text>
    <text x="30" y="155" font-size="13" fill="white" text-decoration="underline">→ 更多信息</text>
    <line x1="220" y1="151" x2="126" y2="151" stroke="#ff4444" stroke-width="2.5" marker-end="url(#tmcn_a2)"/>
    <text x="223" y="155" font-size="12" fill="#ffdd44" font-weight="bold">① 点这里</text>
    <rect x="200" y="163" width="70" height="22" rx="5" fill="#0546a0" stroke="#6a9fd4" stroke-width="1.2"/>
    <text x="212" y="178" font-size="12" fill="#c8d8f0">不运行</text>
  </svg>
  <svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif" style="display:block;width:100%;border-radius:8px;border:1px solid #fde68a">
    <defs><marker id="tmcn_a3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#44ddff"/></marker><filter id="tmcn_sh3"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".3"/></filter></defs>
    <rect width="320" height="175" fill="#d8e4f0" rx="8"/>
    <rect x="20" y="12" width="280" height="152" rx="7" fill="#0546a0" filter="url(#tmcn_sh3)"/>
    <rect x="20" y="12" width="280" height="48" rx="7" fill="#033d8b"/>
    <rect x="20" y="40" width="280" height="20" fill="#033d8b"/>
    <text x="30" y="43" font-size="13" fill="white" font-weight="bold">Windows 已保护你的电脑</text>
    <text x="30" y="78" font-size="11" fill="white">Microsoft Defender SmartScreen</text>
    <text x="30" y="93" font-size="11" fill="white">阻止了一个未知应用的启动。</text>
    <text x="30" y="112" font-size="11" fill="#c8d8f0">发布者：未知</text>
    <text x="30" y="127" font-size="11" fill="#c8d8f0">应用：FnCloud.exe</text>
    <rect x="30" y="138" width="90" height="24" rx="5" fill="#1a6dd4" stroke="#4a9fe0" stroke-width="1.2"/>
    <text x="38" y="155" font-size="12" fill="white" font-weight="bold">仍要运行</text>
    <rect x="130" y="138" width="70" height="24" rx="5" fill="#0546a0" stroke="#6a9fd4" stroke-width="1.2"/>
    <text x="142" y="155" font-size="12" fill="#c8d8f0">不运行</text>
    <line x1="255" y1="150" x2="122" y2="150" stroke="#44ddff" stroke-width="2.5" marker-end="url(#tmcn_a3)"/>
    <text x="258" y="154" font-size="12" fill="#44ddff" font-weight="bold">② 点这里</text>
  </svg>
</div>`,
  };

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function guideLang() {
    return cur && cur.indexOf("zh") === 0 ? "zh" : "zh";
  }

  window.showDlModal = function showDlModal(e) {
    if (e) e.preventDefault();
    const t = DL_TEXT[cur] || DL_TEXT["zh-CN"];
    document.getElementById("dlModalTitle").textContent = t.title;
    document.getElementById("dlModalBody").innerHTML = t.body;
    document.getElementById("dlModalCancel").textContent = t.cancel;
    document.getElementById("dlModalConfirm").textContent = t.confirm;
    document.getElementById("dlModal").style.display = "flex";
    lockScroll();
  };

  window.closeDlModal = function closeDlModal() {
    const modal = document.getElementById("dlModal");
    if (modal) modal.style.display = "none";
    unlockScroll();
  };

  window.confirmDl = function confirmDl() {
    window.closeDlModal();
    window.smartDownload(null, "ios");
  };

  window.showMacModal = function showMacModal(e) {
    if (e) e.preventDefault();
    const t = MAC_TEXT[cur] || MAC_TEXT["zh-CN"];
    document.getElementById("macModalTitle").textContent = t.title;
    document.getElementById("macModalBody").textContent = t.body;
    document.getElementById("macBtnMTitle").textContent = t.m;
    document.getElementById("macBtnMSub").textContent = t.m_sub;
    document.getElementById("macBtnIntelTitle").textContent = t.intel;
    document.getElementById("macBtnIntelSub").textContent = t.intel_sub;
    document.getElementById("macBtnCancel").textContent = t.cancel;
    document.getElementById("macGuide").innerHTML = MAC_GUIDE[guideLang()];
    document.getElementById("macModal").style.display = "flex";
    lockScroll();
    document.querySelector("#macModal > div:last-child").scrollTop = 0;
  };

  window.closeMacModal = function closeMacModal() {
    const modal = document.getElementById("macModal");
    if (modal) modal.style.display = "none";
    unlockScroll();
  };

  window.trackMac = function trackMac() {
    // 点击下载后保留弹窗，便于用户继续阅读「未公证如何打开」说明
  };

  window.showWinModal = function showWinModal(e) {
    if (e) e.preventDefault();
    const t = WIN_TEXT[cur] || WIN_TEXT["zh-CN"];
    document.getElementById("winModalTitle").textContent = t.title;
    document.getElementById("winModalBody").textContent = t.body;
    document.getElementById("winBtnDlTitle").textContent = t.dl;
    document.getElementById("winBtnDlSub").textContent = t.dl_sub;
    document.getElementById("winBtnCancel").textContent = t.cancel;
    document.getElementById("winGuide").innerHTML = WIN_GUIDE[guideLang()];
    document.getElementById("winModal").style.display = "flex";
    lockScroll();
    document.querySelector("#winModal > div:last-child").scrollTop = 0;
  };

  window.closeWinModal = function closeWinModal() {
    const modal = document.getElementById("winModal");
    if (modal) modal.style.display = "none";
    unlockScroll();
  };

  window.trackWin = function trackWin() {
    // 点击下载后保留弹窗，便于用户继续阅读 SmartScreen 说明
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closeDlModal();
      window.closeMacModal();
      window.closeWinModal();
    }
  });
})();
