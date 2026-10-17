import {commercialCopy} from './commercial-copy.mjs';
import { catalogs, routeFor } from "./i18n.mjs";
import { cinematicCopy } from "./cinematic-copy.mjs";
import { mountOperation } from "./cinematic-operation.mjs";
const home = document.querySelector("[data-journey]");
let language = document.documentElement.lang;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
let progress = home ? 0 : 4,
  world,
  raf = 0;
let operation;
let contextScene = -1,
  contextSelection = -1;
let area = 0,
  resultKey = "";
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let lastWidth = innerWidth,
  lastHeight = innerHeight,
  useStills = false,
  stills = null,
  lastRenderTime = 0,
  lastProgress = 0,
  slowFrames = 0;
const params = new URLSearchParams(location.search),
  forceWebGL =
    document.body.dataset.buildMode !== "production" &&
    params.get("quality") === "webgl";
function requestRender() {
  if (!raf) raf = requestAnimationFrame(render);
}
function render() {
  raf = 0;
  if (home) {
    const rawProgress = clamp(scrollY / (innerHeight * 1.6), 0, 4);
    progress = reduced.matches ? Math.round(rawProgress) : rawProgress;
    const index = Math.round(progress),
      operating = progress > 2.65;
    const reveal = clamp((progress - 2.3) / 0.65);
    const isOperation = index === 3;
    document.body.classList.toggle("operating", isOperation);
    document.body.classList.toggle("results-view", index === 4);
    home.style.setProperty("--app", String(reveal));
    if (index !== contextScene) {
      contextScene = index;
      contextSelection = -1;
      renderContext();
    }
    home.dataset.progress = progress.toFixed(4);
    document.querySelector(".experience").dataset.scene = index;
    document.querySelectorAll("[data-copy]").forEach((el, i) => {
      el.classList.toggle("active", i === index);
      el.inert = i !== index;
      el.setAttribute("aria-hidden", String(i !== index));
    });
    document.querySelector("[data-scene-count]").textContent = `0${index + 1}`;
    const names =
      language === "es"
        ? [
            "El archivo",
            "Interpretación",
            "Inteligencia",
            "Operación",
            "Evidencia",
          ]
        : [
            "The archive",
            "Understanding",
            "Intelligence",
            "Operation",
            "Evidence",
          ];
    document.querySelector("[data-scene-name]").textContent = names[index];
    document.querySelectorAll(".scene-nav a").forEach((el, i) => {
      if (i === index) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
    const mobile = innerWidth < 1000;
    const poses = mobile
      ? [
          [
            [0.36, 0.62, 0.48, -25],
            [0.59, 0.65, 0.48, -30],
            [0.8, 0.67, 0.48, -35],
          ],
          [
            [0.2, 0.62, 0.5, -20],
            [0.52, 0.65, 0.56, 0],
            [0.84, 0.62, 0.5, 20],
          ],
          [
            [0.2, 0.62, 0.42, -18],
            [0.52, 0.65, 0.55, 0],
            [0.84, 0.62, 0.42, 18],
          ],
          [
            [0.5, 0.6, 1, 0],
            [1.6, 0.6, 1, 0],
            [2.7, 0.6, 1, 0],
          ],
          [
            [0.2, 0.68, 0.4, -10],
            [0.5, 0.7, 0.45, 0],
            [0.8, 0.68, 0.4, 10],
          ],
        ]
      : [
          [
            [0.57, 0.55, 0.58, -28],
            [0.69, 0.54, 0.58, -28],
            [0.81, 0.53, 0.58, -28],
          ],
          [
            [0.5, 0.58, 0.72, -18],
            [0.68, 0.5, 0.7, -8],
            [0.85, 0.59, 0.65, 10],
          ],
          [
            [0.48, 0.59, 0.64, -18],
            [0.67, 0.48, 0.72, 0],
            [0.84, 0.6, 0.62, 18],
          ],
          [
            [0.205, 0.61, 1, 0],
            [0.5, 0.61, 1, 0],
            [0.795, 0.61, 1, 0],
          ],
          [
            [0.12, 0.63, 0.5, -15],
            [0.4, 0.7, 0.5, 12],
            [0.275, 0.6, 1, 0],
          ],
        ];
    const idx = Math.min(3, Math.floor(progress));
    let t = progress - idx;
    t = t * t * (3 - 2 * t);
    document.querySelectorAll("[data-surface]").forEach((el, i) => {
      const a = poses[idx][i],
        b = poses[idx + 1][i],
        p = a.map((n, k) => n + (b[k] - n) * t);
      if (mobile && isOperation) {
        p[0] += (0 - (operation?.panel ?? 0)) * 1.1;
      }
      const interactive =
        (isOperation &&
          operating &&
          (!mobile || i === (operation?.panel ?? 0))) ||
        (index === 4 && i === 2 && !mobile);
      el.querySelector(".surface-app").inert = !interactive;
      el.style.pointerEvents = interactive ? "auto" : "none";
      el.setAttribute("aria-hidden", String(!interactive));
      el.style.transform = `translate(-50%,-50%) translate(${p[0] * innerWidth}px,${p[1] * innerHeight}px) rotateY(${p[3]}deg) rotateX(${operating ? 0 : 3}deg) scale(${p[2]})`;
      el.dataset.pose = p.map((x) => x.toFixed(4)).join(",");
      el.style.opacity = String(
        index === 4 ? (mobile ? 0.13 : i === 2 ? 1 : 0.18) : 1,
      );
    });
    const tabs = document.querySelector("[data-operation-tabs]");
    tabs.hidden = !isOperation;
    tabs
      .querySelectorAll("button")
      .forEach((button, i) =>
        button.setAttribute(
          "aria-pressed",
          String(i === (operation?.panel ?? 0)),
        ),
      );
    document.querySelector("[data-disclosure]").textContent =
      cinematicCopy[language][isOperation ? "executable" : "conceptual"];
    document.querySelector("[data-exploration]").hidden = index !== 4;
    if (index === 4) renderExploration();
  }
  const state = operation?.run;
  if (useStills) renderStills(progress);
  else if (world) {
    const now = performance.now(),
      interval = now - lastRenderTime,
      moving = Math.abs(progress - lastProgress) > 0.001;
    world.render(progress, state?.stage ?? 0, state?.failed ?? false, area);
    if (!forceWebGL && moving && interval > 90 && interval < 1800) slowFrames++;
    else if (interval < 50) slowFrames = Math.max(0, slowFrames - 1);
    lastRenderTime = now;
    lastProgress = progress;
    if (slowFrames >= 4) enableFallback();
  }
}
function enableFallback() {
  useStills = true;
  document.body.classList.add("graphics-fallback");
  requestRender();
}
function renderStills(p) {
  if (!stills) {
    const layer = document.createElement("div");
    layer.className = "optical-stills";
    layer.setAttribute("aria-hidden", "true");
    stills = [0, 1].map(() => {
      const img = new Image();
      img.alt = "";
      img.onload = () => document.body.classList.add("has-optical-stills");
      layer.append(img);
      return img;
    });
    document.querySelector(".world-backdrop").append(layer);
  }
  const prefix = innerWidth < 700 ? "mobile" : "desktop",
    index = Math.min(3, Math.floor(p)),
    t = p - index;
  stills.forEach((img, i) => {
    // The next pose is only needed when the visitor actually begins its transition.
    if (i === 1 && t <= 0.001) {
      img.style.opacity = "0";
      return;
    }
    const path = `/assets/optical/${prefix}-${index + i}.webp`;
    if (img.dataset.path !== path) {
      img.dataset.path = path;
      img.src = path;
    }
    img.style.opacity = String(i ? t : 1);
    img.style.transform = reduced.matches
      ? "none"
      : `scale(${1 + Math.sin(t * Math.PI) * 0.025}) translateX(${Math.sin(t * Math.PI) * -0.4}%)`;
  });
}
function renderExploration() {
  const c = cinematicCopy[language],
    lab = catalogs[language].lab,
    run = operation?.run,
    key = `${language}:${area}:${run?.events.length ?? 0}:${run?.result?.outcome ?? ""}`;
  if (resultKey === key) return;
  resultKey = key;
  const result = run?.result;
  const summary = result
    ? `<span class="result-code mono">${result.id} / ${lab.values[result.outcome]}</span><p>${c.owner}: ${lab.values[result.owner]} <span aria-hidden="true">·</span> ${c.writes}: ${result.externalWrites}</p>`
    : `<p>${c.noResult}</p>`;
  document.querySelector("[data-exploration]").innerHTML =
    `<div class="result-summary" role="status">${summary}<a href="#scene-3" data-result-inspect>${c.returnOperation} ↗</a></div><p class="eyebrow">${c.expertiseTitle}</p><div class="expertise-selector" role="group" aria-label="${c.expertiseTitle}">${c.areas.map((item, i) => `<button data-area="${i}" aria-pressed="${i === area}"><span class="mono">0${i + 1}</span><span>${item[0]}</span><span aria-hidden="true">${i === area ? "−" : "+"}</span></button>`).join("")}</div><div class="expertise-detail"><h3>${c.areas[area][1]}</h3><p>${c.areas[area][2]}</p><a href="${c.areas[area][4] === "scene" ? "#scene-2" : routeFor(language, c.areas[area][4])}" ${c.areas[area][4] === "scene" ? 'data-go="2"' : ""}>${c.areas[area][3]} ↗</a></div><nav class="commercial-links" aria-label="${catalogs[language].nav.label}"><a href="${routeFor(language, "labs")}">${c.allLab} ↗</a><a href="${routeFor(language, "cases")}">${c.work} ↗</a><a href="${routeFor(language, "contact")}">${c.contact} ↗</a><a href="${routeFor(language, "privacy")}">${catalogs[language].nav.privacy}</a></nav>`;
}
function renderContext() {
  if (!home) return;
  const copy = cinematicCopy[language],
    section =
      contextScene === 1
        ? "understanding"
        : contextScene === 2
          ? "integration"
          : null;
  const actions = document.querySelector("[data-context-actions]");
  actions.inert = !section;
  actions.setAttribute("aria-hidden", String(!section));
  actions.innerHTML = section
    ? copy[section]
        .map(
          (item, i) =>
            `<button data-context="${i}" aria-expanded="${i === contextSelection}"><span class="mono">0${i + 1}</span> ${item[0]} <span aria-hidden="true">+</span></button>`,
        )
        .join("")
    : "";
  const inspector = document.querySelector(".context-inspector");
  inspector.hidden = contextSelection < 0 || !section;
  if (section && contextSelection >= 0) {
    const item = copy[section][contextSelection];
    inspector.innerHTML = `<button data-context-close aria-label="${copy.close}">×</button><p class="eyebrow">${item[2]}</p><h3>${item[0]}</h3><p>${item[1]}</p>`;
  }
}
document.addEventListener("click", (event) => {
  const inspect = event.target.closest("[data-context]");
  if (inspect) {
    contextSelection =
      contextSelection === Number(inspect.dataset.context)
        ? -1
        : Number(inspect.dataset.context);
    renderContext();
  }
  if (event.target.closest("[data-context-close]")) {
    const old = contextSelection;
    contextSelection = -1;
    renderContext();
    document.querySelector(`[data-context="${old}"]`)?.focus();
  }
  const selectArea = event.target.closest("[data-area]");
  if (selectArea) {
    area = Number(selectArea.dataset.area);
    renderExploration();
    document.querySelector(`[data-area="${area}"]`)?.focus();
    requestRender();
  }
  if (event.target.closest("[data-result-inspect]")) {
    event.preventDefault();
    if (operation) operation.panel = 2;
    history.replaceState(null, "", "#scene-3");
    scrollTo({ top: 3 * innerHeight * 1.6, behavior: "instant" });
    requestRender();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contextSelection >= 0) {
    const old = contextSelection;
    contextSelection = -1;
    renderContext();
    document.querySelector(`[data-context="${old}"]`)?.focus();
  }
});
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-go]");
  if (!home || !link) return;
  event.preventDefault();
  const p = Number(link.dataset.go);
  history.replaceState(null, "", `#scene-${p}`);
  scrollTo({ top: p * innerHeight * 1.6, behavior: "instant" });
  requestRender();
  if (link.classList.contains('skip')) {
    operation.panel = 0;
    requestAnimationFrame(() => {
      render();
      document.querySelector('[data-scenario]').focus({preventScroll:true});
    });
  }
});
addEventListener("scroll", requestRender, { passive: true });
addEventListener("resize", () => {
  const p = progress;
  world?.resize();
  if (home && (Math.abs(lastWidth - innerWidth) > 40 || Math.abs(lastHeight - innerHeight) > 70))
    scrollTo({ top: p * innerHeight * 1.6, behavior: "instant" });
  lastWidth = innerWidth;
  lastHeight = innerHeight;
  requestRender();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) requestRender();
});
function setLanguage(next, push = true) {
  if (!home || !["en", "es"].includes(next)) return;
  language = next;
  const c = cinematicCopy[language],
    nav = catalogs[language].nav,
    other = language === "es" ? "en" : "es";
  document.documentElement.lang = language;
  document.title = commercialCopy[language].title;
  document.querySelector('meta[name="description"]').content = commercialCopy[language].description;
  for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]']) document.querySelector(selector).content = commercialCopy[language].title;
  for(const selector of ['meta[property="og:description"]','meta[name="twitter:description"]']) document.querySelector(selector).content = commercialCopy[language].description;
  document.querySelector('meta[property="og:url"]').content = 'https://santensor.com'+routeFor(language);
  document.querySelector('meta[property="og:locale"]').content = language==='es'?'es_CO':'en_US';
  document.querySelector('meta[property="og:locale:alternate"]').content = language==='es'?'en_US':'es_CO';
  document.querySelector('.hero-commercial').setAttribute('aria-label',language==='es'?'Proyectos y contacto':'Projects and contact');
  document.querySelector('link[rel="canonical"]').href =
    `https://santensor.com${routeFor(language)}`;
  const brand = document.querySelector("header .wordmark");
  brand.href = routeFor(language);
  brand.setAttribute("aria-label", nav.home);
  document.querySelector(".edition").textContent =
    `${language === "es" ? "INGENIERÍA" : "ENGINEERING"} / V.04.1`;
  document.querySelector("header nav").setAttribute("aria-label", nav.label);
  for (const route of ["labs", "cases", "contact"]) {
    const a = document.querySelector(`header [data-route="${route}"]`);
    a.href = routeFor(language, route);
    a.innerHTML =
      route === "contact"
        ? `${c.navContact} <span aria-hidden="true">↗</span>`
        : route === "cases"
          ? c.navWork
          : c.navLab;
  }
  const switcher = document.querySelector("[data-language]");
  switcher.dataset.language = other;
  switcher.href = routeFor(other);
  switcher.setAttribute("aria-label", nav.language);
  switcher.setAttribute("lang", other);
  switcher
    .querySelectorAll("span")
    .forEach((el) =>
      el.classList.toggle(
        "selected",
        el.textContent.toLowerCase() === language,
      ),
    );
  document.querySelectorAll("[data-copy]").forEach((el, i) => {
    el.querySelector("h1,h2").textContent = c.titles[i];
    el.querySelector(".eyebrow").textContent = `${c.chapter} / 0${i + 1}`;
    el.querySelector("p:not(.eyebrow)").textContent = i===0?commercialCopy[language].intro:c.bodies[i];
  });
  const commercial = commercialCopy[language];
  document.querySelectorAll('.capability-lines li').forEach((el,i)=>el.textContent=commercial.capabilities[i]);
  document.querySelectorAll('.hero-commercial a').forEach((el,i)=>{el.textContent=(i?commercial.contact:commercial.projects)+' ↗';el.href=routeFor(language,i?'contact':'cases');});
  document.querySelector(".scene-copy .text-link").innerHTML =
    `${c.enter} <span aria-hidden="true">↓</span>`;
  document.querySelectorAll("[data-surface]").forEach((el, i) => {
    el.setAttribute("aria-label", c.panels[i]);
    el.querySelector(".surface-top span").textContent =
      `0${i + 1} / ${c.panels[i]}`;
    el.querySelector(".surface-preview p").textContent =
      c.surfaceDescriptions[i];
  });
  document
    .querySelectorAll("[data-panel-tab]")
    .forEach((el, i) => (el.textContent = c.panels[i]));
  document.querySelector(".skip").textContent = nav.skip;
  document.querySelector(".skip-operation").textContent = `${c.go} ↗`;
  document.querySelector(".scroll-cue").innerHTML =
    `${c.scroll} <span aria-hidden="true">↓</span>`;
  const previewLabel = document.querySelector(".preview-label");
  if (previewLabel) previewLabel.textContent = `V4 / ${c.preview}`;
  document.querySelector(".scene-nav").setAttribute("aria-label", c.scenes);
  document.querySelectorAll(".scene-nav a").forEach((el, i) => {
    el.setAttribute("aria-label", `0${i + 1} ${c.names[i]}`);
    el.querySelector(".scene-nav-name").textContent = c.names[i];
  });
  try {
    localStorage.setItem("santensor-language", language);
  } catch {}
  if (push)
    history.pushState(
      { progress, language },
      "",
      `${routeFor(language)}${location.hash}`,
    );
  operation?.setLanguage(language);
  renderContext();
  requestRender();
}
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-language]");
  if (!link) return;
  try {
    localStorage.setItem("santensor-language", link.dataset.language);
  } catch {}
  if (home) {
    event.preventDefault();
    setLanguage(link.dataset.language);
  } else if (location.hash) link.hash = location.hash;
});
addEventListener("popstate", () => {
  if (home) {
    setLanguage(location.pathname.startsWith("/es/") ? "es" : "en", false);
    requestRender();
  }
});
try {
  localStorage.setItem("santensor-language", language);
} catch {}
requestRender();
if (home || document.querySelector("[data-standalone-lab]"))
  operation = mountOperation({ language, onChange: requestRender });
if (home && /^#scene-[0-4]$/.test(location.hash))
  requestAnimationFrame(() => {
    scrollTo({
      top: Number(location.hash.at(-1)) * innerHeight * 1.6,
      behavior: "instant",
    });
    requestRender();
  });
const constrained =
  (navigator.deviceMemory && navigator.deviceMemory < 4) ||
  navigator.hardwareConcurrency <= 2 ||
  navigator.connection?.saveData;
function hasAcceleratedGraphics() {
  try {
    const probe = document.createElement("canvas").getContext("webgl2");
    if (!probe) return false;
    const info = probe.getExtension("WEBGL_debug_renderer_info"),
      backend = info ? probe.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    return !/SwiftShader|llvmpipe|software|Microsoft Basic Render/i.test(
      backend,
    );
  } catch {
    return false;
  }
}
const accelerated =
  forceWebGL ||
  (!reduced.matches &&
    !params.has("graphics-off") &&
    !constrained &&
    hasAcceleratedGraphics());
if (accelerated) {
  import("./vendor/cinematic-world.bundle.mjs")
    .then(({ createWorld }) => {
      world = createWorld(
        document.querySelector("#optical-world"),
        enableFallback,
      );
      if (!useStills) document.body.classList.add("graphics-ready");
      requestRender();
    })
    .catch(enableFallback);
} else enableFallback();
// Inspection hooks belong to the review build and are removed from the production bundle.
if (
  typeof __SANTENSOR_PREVIEW__ === "undefined"
    ? document.body.dataset.buildMode !== "production"
    : __SANTENSOR_PREVIEW__
)
  globalThis.santensorExperience = {
    get progress() {
      return progress;
    },
    get operation() {
      return operation?.state;
    },
    capture: (p) => world?.capture(p),
    stats: () =>
      useStills
        ? {
            mode: "css-fallback",
            enhancement: "original-render-stills",
            reason: reduced.matches
              ? "reduced-motion"
              : constrained
                ? "device-budget"
                : params.has("graphics-off")
                  ? "requested"
                  : !accelerated
                    ? "unaccelerated-graphics"
                    : "adaptive-or-context-loss",
          }
        : (world?.stats() ?? { mode: "loading" }),
  };
