const state = {
  lang: localStorage.getItem("lang") || "zh",
  theme: localStorage.getItem("theme") || "dark",
  content: null,
  scene: "work"
};

const outsideKeys = ["animals", "painting", "musicals", "musicTaste"];
const hobbyIcons = { animals: "PAW", painting: "ART", musicals: "STG", musicTaste: "MUS" };
const worldPoints = {
  Japan: { x: 86, y: 37 },
  Korea: { x: 83, y: 36 },
  Vietnam: { x: 77, y: 48 },
  Thailand: { x: 74, y: 50 },
  Cambodia: { x: 75.2, y: 52.3 },
  USA: { x: 18, y: 40 }
};

const app = document.getElementById("app");
const modal = document.getElementById("detailModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const themeHint = document.getElementById("themeHint");
const introScreen = document.getElementById("introScreen");
const openCurtainBtn = document.getElementById("openCurtainBtn");
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function applyTheme(theme) {
  state.theme = theme;
  document.body.classList.toggle("light-mode", theme === "light");
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "☾" : "☀";
    themeToggle.title = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  }
}

function triggerLifePawTrail() {
  const old = document.querySelector(".paw-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "paw-overlay";
  overlay.innerHTML = `
    <span style="--x:8;--y:78;--r:-28deg;--d:0ms;">🐾</span>
    <span style="--x:18;--y:68;--r:-18deg;--d:90ms;">🐾</span>
    <span style="--x:28;--y:59;--r:-24deg;--d:180ms;">🐾</span>
    <span style="--x:39;--y:50;--r:-14deg;--d:270ms;">🐾</span>
    <span style="--x:50;--y:41;--r:-20deg;--d:360ms;">🐾</span>
    <span style="--x:61;--y:33;--r:-12deg;--d:450ms;">🐾</span>
    <span style="--x:72;--y:25;--r:-18deg;--d:540ms;">🐾</span>
    <span style="--x:83;--y:17;--r:-10deg;--d:630ms;">🐾</span>
    <span style="--x:92;--y:10;--r:-16deg;--d:720ms;">🐾</span>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  setTimeout(() => overlay.remove(), 4800);
}

function getImageCandidates(baseName) {
  const roots = ["assets", "Assets/assets"];
  const exts = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
  return roots.flatMap((root) => exts.map((ext) => `${root}/${baseName}.${ext}`));
}

function resolveFirstAvailable(candidates) {
  return new Promise((resolve) => {
    const list = (candidates || []).slice();
    const tryNext = () => {
      if (list.length === 0) {
        resolve("");
        return;
      }
      const src = list.shift();
      const probe = new Image();
      probe.onload = () => resolve(src);
      probe.onerror = tryNext;
      probe.src = src;
    };
    tryNext();
  });
}

function bindCandidateFallback(container = document) {
  container.querySelectorAll("img[data-candidates]").forEach((img) => {
    const candidates = (img.dataset.candidates || "").split(",").filter(Boolean);
    if (candidates.length === 0) return;
    let candidateIndex = 0;
    const onError = () => {
      candidateIndex += 1;
      if (candidateIndex < candidates.length) {
        img.src = candidates[candidateIndex];
      } else {
        const card = img.closest(".mini-card, .art-card");
        if (card) card.style.display = "none";
        else img.style.display = "none";
      }
    };
    img.addEventListener("error", onError);
    img.src = candidates[0];
  });
}

const uiText = {
  zh: {
    kicker: "财富设计舞台",
    transitionTitle: "当我不在埋头算数字的时候",
    transitionDesc: "工作之外的我，是更松弛、更有色彩、更感性的另一面。",
    openLabel: "点击查看详情",
    educationTips: "课程与背景",
    experienceTips: "时间线与能力",
    assetTips: "策略主题",
    outsideTips: "手风琴悬停展开",
    singerTips: "风格偏好",
    travelTips: "动态路线地图",
    jumpToLife: "看完工作履历，进入工作之外",
    backToWork: "回到工作主线",
    profileTags: ["喜欢画画", "双子座", "ENTJ", "爱音乐剧"],
    bgChips: ["我的猫", "我的狗", "我的画"],
    wallNotes: ["课后日常", "和朋友出行", "海岛旅行", "摄影记录"],
    wallExtra: ["我的生日", "毕业典礼"],
    cameraHint: "点击查看我的猫",
    cameraShot: "拍一下",
    cameraTitle: "迷你相机",
    cameraStates: ["个人", "我的猫", "我的狗", "我的画"],
    cameraPrompts: ["点击查看我的猫", "点击查看我的狗", "点击查看我的画", "点击回到个人照"],
    animalsLead: "我真的非常喜欢小猫和小狗，它们总能让我感到幸福和被治愈。",
    animalsStressRelief:
      "我压力大的时候总是会去猫咖狗咖，和小动物呆在一起让我觉得很放松，毛茸茸的手感总是让我的压力一扫而空。",
    petExtraNote: "除了他们之外 我还喂养着很多的流浪猫狗，虽然我目前还没有能力给他们温暖的家 但是我希望能在这些日子里给他们一些小小的温暖",
    animalsCta: "点击查看我和宠物的小故事",
    catName: "猫猫",
    dogName: "贝果",
    catProfile:
      "她是一只被我收养的流浪小猫，脾气有点凶，总爱抓我。因为野性很强，我们最终没能把她留下。快满一岁的时候，她悄悄跑丢了。",
    dogProfile:
      "严格来说他不算是我的狗狗，而是我哥哥在美国留学时养的。现在他和全家一起生活，是个很乖很听话的小绅士。",
    musicalList: [
      { title: "汉密尔顿", url: "https://www.youtube.com/results?search_query=Hamilton+musical+official+trailer" },
      { title: "亲爱的埃文汉森", url: "https://www.youtube.com/results?search_query=Dear+Evan+Hansen+musical+official+trailer" },
      { title: "悲惨世界", url: "https://www.youtube.com/results?search_query=Les+Miserables+musical+official+trailer" }
    ],
    musicPicks: [
      { artist: "FLO", song: "Change", url: "https://www.youtube.com/watch?v=EaVP9q-qqMI&list=RDEaVP9q-qqMI&start_radio=1&autoplay=1" },
      { artist: "Keyshia Cole", song: "Fallin' Out", url: "https://www.youtube.com/watch?v=wetpzyZvgQk&list=RDwetpzyZvgQk&start_radio=1&autoplay=1" },
      { artist: "Ariana Grande", song: "eternal sunshine", url: "https://www.youtube.com/watch?v=zFwrArDXHkE&list=RDzFwrArDXHkE&start_radio=1&autoplay=1" },
      { artist: "Kehlani", song: "Folded", url: "https://www.youtube.com/watch?v=vD1bemWtjUU&list=RDvD1bemWtjUU&start_radio=1&autoplay=1" }
    ],
    playNow: "播放",
    connectTitle: "联系我",
    themeHint: "可在这里修改颜色模式",
    footer: "可编辑作品集草稿 · 内容与图片可继续更新",
    statTrack: "方向",
    statTrackValue: "私人财富管理 / 资产管理",
    statFocus: "重点",
    statFocusValue: "客户资产配置策略",
    statFootprints: "足迹",
    statCountries: "个国家",
    paintingStory:
      "我从小学就开始学习绘画与素描，后来也接触了板绘。现在时间越来越少，但我仍然希望有一天能重新认真拿起画笔。",
    paintingPreviewPrefix:
      "我曾经一度希望能够前往日本学习游戏设计与动画设计，因为和家人的观念不一致所以失败了。",
    paintingPreview: "点击查看我的画",
    outsideTitle: "工作之外"
  },
  en: {
    kicker: "WEALTH DESIGN STAGE",
    transitionTitle: "me when I am not crumbing numbers",
    transitionDesc: "Beyond work, I am brighter, bolder, and full of color.",
    openLabel: "Click to open detail",
    educationTips: "background and courses",
    experienceTips: "timeline and impact",
    assetTips: "strategy themes",
    outsideTips: "accordion hover reveal",
    singerTips: "music profile",
    travelTips: "animated route map",
    jumpToLife: "Done with work section? Go to Outside of Work",
    backToWork: "Back to Work Story",
    profileTags: ["Painting lover", "Gemini", "ENTJ", "Musical fan"],
    bgChips: ["My Cat", "My Dog", "My Painting"],
    wallNotes: ["after class", "traveling with friends", "island tourism", "Photographic photo"],
    wallExtra: ["my birthday", "graduation ceremony"],
    cameraHint: "Click to see my cat",
    cameraShot: "Take Shot",
    cameraTitle: "Mini Cam",
    cameraStates: ["Profile", "My Cat", "My Dog", "My Art"],
    cameraPrompts: ["Click to see my cat", "Click to see my dog", "Click to see my art", "Click to see my profile"],
    animalsLead: "I absolutely adore cats and dogs. They make me feel grounded, warm, and genuinely happy.",
    animalsStressRelief:
      "Whenever I feel stressed, I go to cat cafes or dog cafes. Being around animals relaxes me so much, and their fluffy warmth always melts my stress away.",
    petExtraNote:
      "Besides them, I also feed many stray cats and dogs. I still cannot give them a permanent home yet, but I hope I can offer them a little warmth during these days.",
    animalsCta: "click to see my story with my pets",
    catProfile:
      "She was a stray kitten I adopted. She had a fierce little temper and always scratched me. Because she was so wild, I could not keep her. Around one year old, she quietly ran away and never came back.",
    dogProfile:
      "He is technically my brother's dog from his years in the U.S., but now he lives with the whole family. He is a little gentleman, calm, polite, and very obedient.",
    musicalList: [
      { title: "Hamilton", url: "https://www.youtube.com/results?search_query=Hamilton+musical+official+trailer" },
      { title: "Dear Evan Hansen", url: "https://www.youtube.com/results?search_query=Dear+Evan+Hansen+musical+official+trailer" },
      { title: "Les Miserables", url: "https://www.youtube.com/results?search_query=Les+Miserables+musical+official+trailer" }
    ],
    musicPicks: [
      { artist: "FLO", song: "Change", url: "https://www.youtube.com/watch?v=EaVP9q-qqMI&list=RDEaVP9q-qqMI&start_radio=1&autoplay=1" },
      { artist: "Keyshia Cole", song: "Fallin' Out", url: "https://www.youtube.com/watch?v=wetpzyZvgQk&list=RDwetpzyZvgQk&start_radio=1&autoplay=1" },
      { artist: "Ariana Grande", song: "eternal sunshine", url: "https://www.youtube.com/watch?v=zFwrArDXHkE&list=RDzFwrArDXHkE&start_radio=1&autoplay=1" },
      { artist: "Kehlani", song: "Folded", url: "https://www.youtube.com/watch?v=vD1bemWtjUU&list=RDvD1bemWtjUU&start_radio=1&autoplay=1" }
    ],
    playNow: "Play",
    connectTitle: "let's connect",
    themeHint: "Change color mode here",
    footer: "Editable Portfolio Draft · Content and media can be updated",
    statTrack: "Track",
    statTrackValue: "Private Wealth / Asset Management",
    statFocus: "Focus",
    statFocusValue: "Client Portfolio Strategy",
    statFootprints: "Footprints",
    statCountries: "Countries",
    paintingStory:
      "I started drawing and sketching in primary school. As I grew older, I also explored digital painting. Now time is tighter than before, but I still hope one day I can truly pick up my brush again.",
    paintingPreviewPrefix:
      "At one point, I hoped to study game design and animation design in Japan, but that plan fell through because my family and I had different expectations.",
    paintingPreview: "click to see my art",
    outsideTitle: "Outside of Work",
    catName: "Mio",
    dogName: "Bagel"
  }
};

function setupCurtainControl() {
  openCurtainBtn.addEventListener("click", () => {
    document.body.classList.add("curtain-open");
    setTimeout(() => introScreen.classList.add("hidden"), 1200);
  });
}

function setupCursorFx() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);

  const trail = Array.from({ length: 12 }).map(() => {
    const node = document.createElement("span");
    node.className = "cursor-trail";
    document.body.appendChild(node);
    return { node, x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;
  let uiTone = "work";
  const interactiveSelector =
    "button, a, .accordion-item, .marker, .timeline-item, .travel-item, .lang-toggle, .open-curtain-btn";

  function setToneFromElement(element) {
    const toneNode = element?.closest("[data-ui-tone]");
    uiTone = toneNode?.dataset.uiTone || "work";
    document.body.dataset.cursorTone = uiTone;
  }

  function animateRing() {
    ringX += (targetX - ringX) * 0.2;
    ringY += (targetY - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    let x = targetX;
    let y = targetY;
    trail.forEach((particle, index) => {
      particle.x += (x - particle.x) * 0.28;
      particle.y += (y - particle.y) * 0.28;
      particle.node.style.left = `${particle.x}px`;
      particle.node.style.top = `${particle.y}px`;
      particle.node.style.opacity = `${Math.max(0.1, 1 - index / trail.length)}`;
      particle.node.style.transform = `translate(-50%, -50%) scale(${1 - index / (trail.length * 1.6)})`;
      x = particle.x;
      y = particle.y;
    });

    requestAnimationFrame(animateRing);
  }

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });

  document.addEventListener("mousemove", (event) => {
    const hovered = document.elementFromPoint(event.clientX, event.clientY);
    setToneFromElement(hovered);
  });

  document.addEventListener("mousedown", (event) => {
    const burst = document.createElement("span");
    burst.className = "cursor-burst";
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 620);
  });

  document.addEventListener("mouseover", (event) => {
    if (event.target.closest(interactiveSelector)) ring.classList.add("hover");
  });

  document.addEventListener("mouseout", (event) => {
    if (event.target.closest(interactiveSelector)) ring.classList.remove("hover");
  });

  animateRing();
}

function switchScene(targetScene) {
  if (state.scene === targetScene) return;
  const current = document.querySelector(".scene-view.is-active");
  const next = document.getElementById(`${targetScene}Scene`);
  if (!current || !next) return;

  const toLife = targetScene === "life";
  current.style.display = "block";
  next.style.display = "block";
  next.classList.add("prep", toLife ? "from-right" : "from-left");
  next.classList.remove("is-hidden");

  requestAnimationFrame(() => {
    current.classList.add(toLife ? "to-left" : "to-right");
    next.classList.add("is-active");
    next.classList.remove("prep", "from-right", "from-left");
  });

  setTimeout(() => {
    current.classList.remove("is-active", "to-left", "to-right");
    current.classList.add("is-hidden");
    current.style.display = "none";
    next.style.display = "block";
  }, 700);

  state.scene = targetScene;
  document.body.classList.toggle("life-mode", toLife);
  document.body.classList.toggle("in-life-scene", toLife);
  applyTheme(toLife ? "dark" : "light");
  localStorage.setItem("theme", state.theme);
  if (toLife) {
    triggerLifePawTrail();
  }
}

langToggle.addEventListener("click", async () => {
  state.lang = state.lang === "zh" ? "en" : "zh";
  localStorage.setItem("lang", state.lang);
  await loadAndRender();
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.add("hidden");
});

function section(title, id, tip, bodyHtml, tone = "work", deco = "none") {
  return `
    <section class="section-panel" id="${id}" data-ui-tone="${tone}">
      <span class="mini-deco deco-${deco}" aria-hidden="true"></span>
      <div class="section-head">
        <h2 class="section-title">${title}</h2>
        <p class="section-tip">${tip}</p>
      </div>
      <div class="section-body">${bodyHtml}</div>
    </section>
  `;
}

function renderNav(t) {
  const links = [
    { id: "education", label: t.sections.education },
    { id: "experience", label: t.sections.experience },
    { id: "asset", label: t.sections.asset },
    { id: "outside", label: uiText[state.lang]?.outsideTitle || t.sections.outside },
    { id: "travel", label: t.sections.travel }
  ];
  return links.map((item) => `<a class="nav-link" href="#${item.id}">${item.label}</a>`).join("");
}

function renderTravelMap(countries, labels, hoverMap) {
  const points = countries
    .map((name) => {
      const p = worldPoints[name];
      if (!p) return "";
      return `<circle class="marker" cx="${p.x}" cy="${p.y}" r="1.05" data-country="${name}" data-ui-tone="life" />`;
    })
    .join("");

  const routePath = countries
    .map((country, index) => {
      const p = worldPoints[country];
      if (!p) return "";
      return `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ");

  const list = countries
    .map((country) => {
      const label = labels[country] || country;
      const note = hoverMap[country] || "";
      return `
        <div class="travel-item" data-country-card="${country}" data-ui-tone="life">
          <strong>${label}</strong>
          <span>${note}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div class="map-shell" data-ui-tone="life">
      <div class="map-stage">
        <svg viewBox="0 0 100 60" aria-label="Travel map">
          <rect x="0" y="0" width="100" height="60" fill="#090615"></rect>
          <path class="land" d="M2 24 L9 18 L19 14 L31 15 L34 21 L28 28 L15 31 L6 29 Z"></path>
          <path class="land" d="M28 18 L36 13 L48 12 L54 18 L50 25 L39 28 L31 24 Z"></path>
          <path class="land" d="M51 15 L69 13 L83 19 L87 28 L80 34 L66 35 L55 30 L49 23 Z"></path>
          <path class="land" d="M71 39 L80 40 L90 46 L88 53 L77 50 L70 44 Z"></path>
          <path class="land" d="M35 35 L43 36 L49 41 L45 47 L38 46 L33 41 Z"></path>
          <path class="route-line" d="${routePath}"></path>
          ${points}
        </svg>
        <div id="mapTooltip" class="tooltip"></div>
      </div>
      <div class="travel-list">${list}</div>
    </div>
  `;
}

function renderPage() {
  const t = state.content;
  const locale = uiText[state.lang];

  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  langToggle.textContent = state.lang === "zh" ? "EN" : "中";
  if (themeHint) themeHint.textContent = locale.themeHint;

  const statCards = `
    <article class="stat-card"><p class="stat-label">${locale.statTrack}</p><p class="stat-value">${locale.statTrackValue}</p></article>
    <article class="stat-card"><p class="stat-label">${locale.statFocus}</p><p class="stat-value">${locale.statFocusValue}</p></article>
    <article class="stat-card"><p class="stat-label">${locale.statFootprints}</p><p class="stat-value">${t.travelCountries.length} ${locale.statCountries}</p></article>
    <article class="stat-card"><p class="stat-label">MBTI</p><p class="stat-value">ENTJ</p></article>
  `;

  const educationBody = `
    <div class="timeline-grid">
      <article class="timeline-item">
        <h4>${t.education.school}</h4>
        <p class="timeline-meta">${t.education.program}</p>
      </article>
    </div>
    <div class="focus-cloud" style="margin-top:12px;">${t.education.courses.map((course) => `<span class="focus-tag">${course}</span>`).join("")}</div>
  `;

  const experienceBody = `
    <div class="timeline-grid">
      ${t.experience
        .map(
          (item) => `
            <article class="timeline-item">
              <h4>${item.role} · ${item.company}</h4>
              <p class="timeline-meta">${item.date}</p>
              <p class="timeline-detail">${item.summary}</p>
            </article>`
        )
        .join("")}
    </div>
  `;

  const assetBody = `
    <p class="timeline-detail" style="margin-bottom:12px;">${t.assetIntro}</p>
    <div class="focus-cloud">${t.assetManagementFocus.map((item) => `<span class="focus-tag">${item}</span>`).join("")}</div>
    <div class="focus-cloud" style="margin-top:12px;">${t.awards.map((award) => `<span class="focus-tag">${award}</span>`).join("")}</div>
  `;

  const outsideBody = `
    <div class="accordion-shell" data-ui-tone="life">
      ${outsideKeys
        .map((key) => {
          const item = t.outsideOfWork[key];
          const preview =
            key === "animals"
              ? `${locale.animalsLead} ${locale.animalsStressRelief}`
              : key === "painting"
                ? `${locale.paintingPreviewPrefix} ${locale.paintingPreview}`
                : item.preview;
          const details =
            key === "animals"
              ? `${locale.animalsStressRelief} ${locale.animalsCta}`
              : key === "painting"
                ? `${locale.paintingPreviewPrefix} ${locale.paintingStory}`
                : item.details;
          const musicalHtml =
            key === "musicals"
              ? `<div class="jump-hint">Click a title to open</div>
                 <ul class="musical-list">
                  ${locale.musicalList
                    .map(
                      (m, i) =>
                        `<li><a class="musical-link" href="${m.url}" target="_blank" rel="noopener noreferrer">${i + 1}. ${m.title}</a></li>`
                    )
                    .join("")}
                 </ul>`
              : "";
          const musicHtml =
            key === "musicTaste"
              ? `<div class="music-picks">
                  ${locale.musicPicks
                    .map(
                      (m) => `<div class="music-pick">
                        <div>
                          <strong>${m.artist}</strong>
                          <p>${m.song}</p>
                        </div>
                        <button class="play-btn" data-url="${m.url}" type="button">${locale.playNow}</button>
                      </div>`
                    )
                    .join("")}
                </div>`
              : "";
          const detailDeco =
            key === "animals"
              ? `<span class="detail-deco detail-deco-paw" aria-hidden="true"></span>`
              : key === "painting"
                ? `<span class="detail-deco detail-deco-brush" aria-hidden="true"></span>`
                : "";
          return `
            <article class="accordion-item" data-outside="${key}" data-ui-tone="life">
              <div class="accordion-tab">${hobbyIcons[key]}</div>
              <div class="accordion-content">
                <div class="accordion-doodle" aria-hidden="true"></div>
                <h4>${item.title}</h4>
                <p>${preview}</p>
                <div class="accordion-expand">
                  ${detailDeco}
                  ${musicalHtml}
                  ${musicHtml}
                  <p>${details}</p>
                </div>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;

  const travelBody = `<p class="timeline-detail" style="margin-bottom:12px;">${t.travelIntro}</p>${renderTravelMap(
    t.travelCountries,
    t.travelLabels,
    t.travelHover
  )}`;

  const ticker = [...t.hero.quickFacts, ...t.hero.quickFacts];
  app.innerHTML = `
    <section class="hero-shell" data-ui-tone="work">
      <div class="hero-top">
        <div class="hero-copy">
          <p class="kicker">${locale.kicker}</p>
          <h1 class="hero-title">${t.hero.name}</h1>
          <p class="hero-subtitle">${t.hero.tagline}</p>
          <div class="mini-wall" id="miniWall">
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-1").join(",")}" src="assets/wall-1.jpg" alt="mini wall 1" />
              <figcaption>${locale.wallNotes[0]}</figcaption>
            </figure>
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-2").join(",")}" src="assets/wall-2.jpg" alt="mini wall 2" />
              <figcaption>${locale.wallNotes[1]}</figcaption>
            </figure>
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-3").join(",")}" src="assets/wall-3.jpg" alt="mini wall 3" />
              <figcaption>${locale.wallNotes[2]}</figcaption>
            </figure>
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-4").join(",")}" src="assets/wall-4.jpg" alt="mini wall 4" />
              <figcaption>${locale.wallNotes[3]}</figcaption>
            </figure>
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-5").join(",")}" src="assets/wall-5.jpg" alt="mini wall 5" />
              <figcaption>${locale.wallExtra[0]}</figcaption>
            </figure>
            <figure class="mini-card">
              <img class="mini-wall-img" data-candidates="${getImageCandidates("wall-6").join(",")}" src="assets/wall-6.jpg" alt="mini wall 6" />
              <figcaption>${locale.wallExtra[1]}</figcaption>
            </figure>
          </div>
          <div class="hero-accent-pack" aria-hidden="true">
            <span class="accent-orb"></span>
            <span class="accent-line"></span>
            <span class="accent-line short"></span>
          </div>
        </div>
        <div class="hero-side">
          <div class="portrait-panel" data-ui-tone="work">
            <div class="portrait-stage" id="portraitStage">
              <div class="portrait-backdrop"></div>
              <img class="portrait-img is-active" data-candidates="${getImageCandidates("profile-1").join(",")}" src="assets/profile-1.jpg" alt="Profile photo one" />
              <div class="portrait-fallback">Add your photo in <code>assets/profile-1.jpg</code></div>
              <div class="shutter-flash"></div>
              <div class="portrait-tags">
                ${locale.profileTags.map((tag) => `<span class="portrait-tag">${tag}</span>`).join("")}
              </div>
            </div>
            <div class="camera-widget" id="cameraWidget">
              <div class="camera-top">
                <span class="camera-led"></span>
                <span class="camera-title">${locale.cameraTitle}</span>
              </div>
              <div class="camera-subject" id="cameraSubject">${locale.cameraStates[0]}</div>
              <div class="camera-body">
                <button id="cameraShutterBtn" class="camera-shutter" type="button" aria-label="${locale.cameraShot}"></button>
              </div>
            </div>
            <p id="cameraHintText" class="drag-hint">${locale.cameraHint}</p>
          </div>
          <div class="stat-grid">${statCards}</div>
        </div>
      </div>
      <div class="quick-facts">
        <div class="facts-track">
          ${ticker.map((fact) => `<span class="fact-pill">${fact}</span>`).join("")}
        </div>
      </div>
    </section>

    <nav class="floating-nav" aria-label="Section Navigation">${renderNav(t)}</nav>

    <div class="scene-stage">
      <section id="workScene" class="scene-view is-active" data-ui-tone="work">
        <div class="deck" id="workZone" data-ui-tone="work">
          ${section(t.sections.education, "education", locale.educationTips, educationBody, "work", "brush")}
          ${section(t.sections.experience, "experience", locale.experienceTips, experienceBody, "work", "paw")}
          ${section(t.sections.asset, "asset", locale.assetTips, assetBody, "work", "brush")}
        </div>
        <section class="life-jump-panel" data-ui-tone="work">
          <button id="jumpToLife" class="jump-life-btn" type="button">${locale.jumpToLife}</button>
        </section>
      </section>

      <section id="lifeScene" class="scene-view is-hidden" data-ui-tone="life">
        <section class="mode-transition" data-ui-tone="life">
          <h3>${locale.transitionTitle}</h3>
          <p>${locale.transitionDesc}</p>
        </section>
        <div class="deck" id="lifeZone" data-ui-tone="life">
          ${section(locale.outsideTitle || t.sections.outside, "outside", locale.outsideTips, outsideBody, "life", "paw")}
          ${section(t.sections.travel, "travel", locale.travelTips, travelBody, "life", "brush")}
        </div>
        <section class="life-jump-panel" data-ui-tone="life">
          <button id="backToWork" class="jump-life-btn" type="button">${locale.backToWork}</button>
        </section>
      </section>
    </div>

    <section class="connect-panel">
      <h3>${locale.connectTitle}</h3>
      <div class="connect-item">
        <span class="connect-icon">✉</span>
        <a href="mailto:raozhiyun62@gmail.com">raozhiyun62@gmail.com</a>
      </div>
      <div class="connect-item">
        <span class="connect-icon">in</span>
        <a href="https://www.linkedin.com/in/selarao/?skipRedirect=true" target="_blank" rel="noopener noreferrer">linkedin.com/in/selarao</a>
      </div>
    </section>

    <div class="footer-note">${locale.footer || t.footer}</div>
  `;

  state.scene = "work";
  document.body.classList.remove("life-mode");
  document.body.classList.remove("in-life-scene");
  applyTheme("light");
  localStorage.setItem("theme", "light");
  const workSceneNode = document.getElementById("workScene");
  const lifeSceneNode = document.getElementById("lifeScene");
  if (workSceneNode) workSceneNode.style.display = "block";
  if (lifeSceneNode) lifeSceneNode.style.display = "none";

  const jumpBtn = document.getElementById("jumpToLife");
  if (jumpBtn) {
    jumpBtn.addEventListener("click", () => {
      switchScene("life");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 380);
    });
  }
  const backBtn = document.getElementById("backToWork");
  if (backBtn) backBtn.addEventListener("click", () => switchScene("work"));
  const portraitStage = document.getElementById("portraitStage");
  if (portraitStage) {
    portraitStage.querySelectorAll(".portrait-img").forEach((img) => {
      const candidates = (img.dataset.candidates || "").split(",").filter(Boolean);
      let candidateIndex = 0;
      img.addEventListener("load", () => {
        portraitStage.classList.add("has-image");
        const ratio = img.naturalWidth / img.naturalHeight;
        img.classList.remove("is-landscape", "is-portrait", "is-square");
        if (ratio > 1.12) img.classList.add("is-landscape");
        else if (ratio < 0.9) img.classList.add("is-portrait");
        else img.classList.add("is-square");
      });
      img.addEventListener("error", () => {
        candidateIndex += 1;
        if (candidateIndex < candidates.length) {
          img.src = candidates[candidateIndex];
          return;
        }
        img.style.display = "none";
      });
      if (candidates.length > 0) img.src = candidates[0];
    });
  }

  const miniWall = document.getElementById("miniWall");
  if (miniWall) {
    bindCandidateFallback(miniWall);
  }

  const outsideSection = document.getElementById("outside");
  if (outsideSection) bindCandidateFallback(outsideSection);

  const cameraShutterBtn = document.getElementById("cameraShutterBtn");
  const cameraSubject = document.getElementById("cameraSubject");
  const cameraHintText = document.getElementById("cameraHintText");
  if (cameraShutterBtn && portraitStage) {
    const backdrop = portraitStage.querySelector(".portrait-backdrop");
    const heroPhoto = portraitStage.querySelector(".portrait-img.is-active");
    let activeIndex = 0;
    const cameraStates = locale.cameraStates || ["Profile", "Scene A", "Scene B", "Scene C"];
    const cameraPrompts = locale.cameraPrompts || ["Click to see next"];
    const backgrounds = [
      getImageCandidates("profile-1"),
      getImageCandidates("bg-1"),
      getImageCandidates("bg-2"),
      getImageCandidates("bg-4")
    ];
    const sourceCache = new Map();

    async function setActiveChip(index, withFilm = true) {
      activeIndex = ((index % backgrounds.length) + backgrounds.length) % backgrounds.length;
      if (backdrop) {
        if (!sourceCache.has(activeIndex)) {
          sourceCache.set(activeIndex, await resolveFirstAvailable(backgrounds[activeIndex]));
        }
        const resolved = sourceCache.get(activeIndex);
        if (resolved && heroPhoto) {
          heroPhoto.src = resolved;
          heroPhoto.style.display = "";
        }
      }
      if (cameraSubject) cameraSubject.textContent = cameraStates[activeIndex] || cameraStates[0];
      if (cameraHintText) cameraHintText.textContent = cameraPrompts[activeIndex] || cameraPrompts[0];
      if (withFilm) {
        portraitStage.classList.remove("film-cut");
        requestAnimationFrame(() => portraitStage.classList.add("film-cut"));
        cameraShutterBtn.classList.remove("shot");
        requestAnimationFrame(() => cameraShutterBtn.classList.add("shot"));
      }
    }

    cameraShutterBtn.addEventListener("click", async () => {
      await setActiveChip(activeIndex + 1, true);
    });

    setActiveChip(0, false);
  }

  const lifeIds = new Set(["outside", "travel"]);
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href")?.slice(1);
      if (!targetId) return;
      const wantsLife = lifeIds.has(targetId);
      const targetScene = wantsLife ? "life" : "work";
      if (state.scene !== targetScene) {
        event.preventDefault();
        switchScene(targetScene);
        setTimeout(() => {
          if (wantsLife && targetId === "outside") {
            window.scrollTo({ top: 0, behavior: "auto" });
          }
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 380);
      }
    });
  });

  document.querySelectorAll(".accordion-item[data-outside]").forEach((card) => {
    card.addEventListener("click", () => {
      const detail = t.outsideOfWork[card.dataset.outside];
      if (card.dataset.outside === "animals") {
        modalBody.innerHTML = `
          <h3>${detail.title}</h3>
          <p>${locale.animalsLead}</p>
          <p>${locale.animalsStressRelief}</p>
          <p>${locale.petExtraNote}</p>
          <div class="pet-modal-layout">
            <article class="pet-story-block">
              <img data-candidates="${[...getImageCandidates("pet-cat"), ...getImageCandidates("wall-1")].join(",")}" src="${getImageCandidates("pet-cat")[0]}" alt="Mio the cat" />
              <div class="pet-text-card">
                <h4>${locale.catName}</h4>
                <p>${locale.catProfile}</p>
              </div>
            </article>
            <article class="pet-story-block">
              <img data-candidates="${[...getImageCandidates("pet-dog"), ...getImageCandidates("wall-2")].join(",")}" src="${getImageCandidates("pet-dog")[0]}" alt="Bagel the dog" />
              <div class="pet-text-card">
                <h4>${locale.dogName}</h4>
                <p>${locale.dogProfile}</p>
              </div>
            </article>
          </div>
        `;
        bindCandidateFallback(modalBody);
        modal.classList.remove("hidden");
        return;
      }
      if (card.dataset.outside === "painting") {
        modalBody.innerHTML = `
          <h3>${detail.title}</h3>
          <p>${locale.paintingPreviewPrefix} ${locale.paintingStory}</p>
          <div class="art-wall modal-art-wall">
            <figure class="art-card">
              <img data-candidates="${getImageCandidates("art-1").join(",")}" src="${getImageCandidates("art-1")[0]}" alt="artwork 1" />
              <figcaption>Art 01</figcaption>
            </figure>
            <figure class="art-card">
              <img data-candidates="${getImageCandidates("art-2").join(",")}" src="${getImageCandidates("art-2")[0]}" alt="artwork 2" />
              <figcaption>Art 02</figcaption>
            </figure>
            <figure class="art-card">
              <img data-candidates="${[...getImageCandidates("art-3"), ...getImageCandidates("art3")].join(",")}" src="${getImageCandidates("art-3")[0]}" alt="artwork 3" />
              <figcaption>Art 03</figcaption>
            </figure>
          </div>
        `;
        bindCandidateFallback(modalBody);
        modal.classList.remove("hidden");
        return;
      }
      modalBody.innerHTML = `
        <h3>${detail.title}</h3>
        <p>${detail.details}</p>
      `;
      modal.classList.remove("hidden");
    });
  });

  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const url = btn.dataset.url;
      if (!url) return;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  const tooltip = document.getElementById("mapTooltip");
  const cardLookup = new Map(
    Array.from(document.querySelectorAll("[data-country-card]")).map((el) => [el.dataset.countryCard, el])
  );
  document.querySelectorAll(".marker").forEach((marker) => {
    marker.addEventListener("mouseenter", () => {
      const country = marker.dataset.country;
      tooltip.textContent = `${t.travelLabels[country] || country}: ${t.travelHover[country] || ""}`;
      tooltip.classList.add("show");
      tooltip.style.left = `${marker.getAttribute("cx")}%`;
      tooltip.style.top = `${marker.getAttribute("cy")}%`;
      const linkedCard = cardLookup.get(country);
      if (linkedCard) linkedCard.classList.add("active");
    });
    marker.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
      const country = marker.dataset.country;
      const linkedCard = cardLookup.get(country);
      if (linkedCard) linkedCard.classList.remove("active");
    });
  });
}

async function loadAndRender() {
  window.scrollTo({ top: 0, behavior: "auto" });
  const response = await fetch(`content/${state.lang}.json?ts=${Date.now()}`);
  state.content = await response.json();
  renderPage();
}

setupCurtainControl();
setupCursorFx();
applyTheme(state.theme);
loadAndRender();
