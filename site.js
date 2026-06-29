(function () {
  "use strict";

  const path = window.location.pathname.split("/").pop() || "index.html";
  const pages = {
    "index.html": {
      bodyClass: "page-home",
      eyebrow: "Open learning resources",
      title: "让知识更容易被发现",
      description: "面向大气、海洋与数据科学学习者的开放资料库。课程笔记、编程实践与专业工具，集中整理，持续更新。",
      actions: '<a href="course_study_material.html">浏览学习资料</a><a class="secondary" href="python_study.html">进入 Python 专区</a>'
    },
    "course_study_material.html": {
      bodyClass: "page-resources",
      eyebrow: "Resource catalogue",
      title: "学习参考资料",
      description: "按学科整理的课程笔记、试题、视频和研究生阶段资料。输入课程名或关键词可快速筛选。",
      searchable: "resource"
    },
    "python_study.html": {
      bodyClass: "page-python",
      eyebrow: "Python learning path",
      title: "Python 学习分享",
      description: "从语言基础到海气数据处理与可视化，按照清晰的学习路径组织内容与实例。"
    },
    "some_links.html": {
      bodyClass: "page-links",
      eyebrow: "Curated directory",
      title: "专业网站导航",
      description: "精选教育、科研、气象海洋、Python 与数据服务网站，减少重复检索，把时间留给真正的学习。",
      searchable: "links"
    }
  };

  const page = pages[path] || pages["index.html"];
  document.body.classList.add(page.bodyClass);

  document.querySelectorAll(".leftbar .menu a").forEach(function (link) {
    const href = (link.getAttribute("href") || "").split("#")[0];
    if (href === path || (path === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const leftbar = document.querySelector(".leftbar");
  if (leftbar) {
    const menu = leftbar.querySelector(".menu");
    if (menu) {
      menu.id = "primary-navigation";
      const toggle = document.createElement("button");
      toggle.className = "menu-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-controls", menu.id);
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span class="menu-toggle-icon" aria-hidden="true"></span><span>菜单</span>';
      leftbar.insertBefore(toggle, menu);
      toggle.addEventListener("click", function () {
        const open = leftbar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    const hero = document.createElement("section");
    hero.className = "page-hero";
    hero.setAttribute("aria-labelledby", "page-title");
    const tools = page.searchable
      ? '<div class="catalogue-tools"><label class="catalogue-search"><span class="sr-only">搜索</span><input id="catalogue-query" type="search" autocomplete="off" placeholder="搜索课程、资料或网站…"></label><span class="result-count" id="result-count" aria-live="polite"></span></div>'
      : page.actions
        ? '<div class="hero-actions">' + page.actions + "</div>"
        : "";
    hero.innerHTML = '<div class="page-hero-inner"><div class="eyebrow">' + page.eyebrow + '</div><h1 id="page-title">' + page.title + "</h1><p>" + page.description + "</p>" + tools + "</div>";
    leftbar.insertAdjacentElement("afterend", hero);
  }

  if (page.bodyClass === "page-home") {
    const content = document.querySelector(".home-content");
    if (content) {
      const grid = document.createElement("section");
      grid.setAttribute("aria-labelledby", "resource-entrances");
      grid.innerHTML = '<h2 class="section-heading" id="resource-entrances">从这里开始</h2><div class="quick-grid">' +
        '<article class="quick-card"><a href="course_study_material.html"><span class="card-index">01 · MATERIALS</span><h3>课程学习资料</h3><p>大气科学、海洋、物理、数学与研究生课程资料。</p><span class="card-link">查看资源 →</span></a></article>' +
        '<article class="quick-card"><a href="python_study.html"><span class="card-index">02 · PYTHON</span><h3>数据科学实践</h3><p>Python 基础、科学计算、海气数据处理与可视化。</p><span class="card-link">开始学习 →</span></a></article>' +
        '<article class="quick-card"><a href="some_links.html"><span class="card-index">03 · DIRECTORY</span><h3>专业网站导航</h3><p>科研数据库、业务平台、官方文档和常用工具入口。</p><span class="card-link">浏览导航 →</span></a></article></div>';
      content.insertBefore(grid, content.firstChild);
    }
  }

  function normalize(value) {
    return value.toLocaleLowerCase("zh-CN").replace(/\s+/g, " ").trim();
  }

  function setupResourceSearch() {
    const input = document.getElementById("catalogue-query");
    const count = document.getElementById("result-count");
    const rows = Array.from(document.querySelectorAll(".resource-main table tr"));
    const sections = Array.from(document.querySelectorAll(".resource-main .tabledata"));
    if (!input || !count || rows.length === 0) return;

    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有找到匹配的资料，请尝试更短的关键词。";
    document.querySelector(".resource-main").appendChild(empty);

    function apply() {
      const query = normalize(input.value);
      let visible = 0;
      rows.forEach(function (row) {
        const match = !query || normalize(row.textContent).includes(query);
        row.hidden = !match;
        if (match) visible += 1;
      });
      sections.forEach(function (section) {
        const hasVisible = Array.from(section.querySelectorAll("tr")).some(function (row) { return !row.hidden; });
        section.hidden = !hasVisible;
      });
      count.textContent = "共 " + visible + " 项资源";
      empty.classList.toggle("is-visible", visible === 0);
    }

    input.addEventListener("input", apply);
    apply();
  }

  function setupLinksSearch() {
    const input = document.getElementById("catalogue-query");
    const count = document.getElementById("result-count");
    const groups = Array.from(document.querySelectorAll(".page-links .links-orderls"));
    const items = groups.flatMap(function (group) { return Array.from(group.children).filter(function (node) { return node.tagName === "LI"; }); });
    if (!input || !count || items.length === 0) return;

    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有找到匹配的网站，请尝试其他关键词。";
    document.querySelector(".page-links .main-body").appendChild(empty);

    function apply() {
      const query = normalize(input.value);
      let visible = 0;
      items.forEach(function (item) {
        const match = !query || normalize(item.textContent).includes(query);
        item.hidden = !match;
        if (match) visible += 1;
      });
      groups.forEach(function (group) {
        const title = group.previousElementSibling;
        const hasVisible = Array.from(group.children).some(function (item) { return item.tagName === "LI" && !item.hidden; });
        group.hidden = !hasVisible;
        if (title && title.classList.contains("links-title")) title.hidden = !hasVisible;
      });
      count.textContent = "共 " + visible + " 个网站";
      empty.classList.toggle("is-visible", visible === 0);
    }

    input.addEventListener("input", apply);
    apply();
  }

  if (page.searchable === "resource") setupResourceSearch();
  if (page.searchable === "links") setupLinksSearch();

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.setAttribute("rel", "noopener noreferrer");
  });

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.setAttribute("aria-label", "回到顶部");
    backToTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    const updateBackToTop = function () {
      backToTop.style.display = window.scrollY > 360 ? "block" : "none";
    };
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }
}());
