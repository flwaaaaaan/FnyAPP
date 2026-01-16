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

    // 使用 DocumentFragment 批量插入，减少重排
    const fragment = document.createDocumentFragment();
    
    nodes.forEach((node) => {
      const card = document.createElement("div");
      card.className = "node-card animate-on-scroll";
      card.innerHTML = `
        <img src="https://flagcdn.com/w80/${node.code}.png" width="40" alt="${node.name}" class="node-flag">
        <span class="node-name">${node.name}</span>
      `;
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


