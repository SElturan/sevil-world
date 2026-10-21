const $ = (s) => document.querySelector(s);
const C = CONTENT;
const IDS = ["school", "family", "land"];
const SCENES = { school: A.sceneSchool, family: A.sceneFamily, land: A.sceneLand };

// ---------- состояние ----------
let visited = new Set();
try { visited = new Set(JSON.parse(localStorage.getItem("sevil-visited") || "[]")); } catch (e) {}
const saveVisited = () => { try { localStorage.setItem("sevil-visited", JSON.stringify([...visited])); } catch (e) {} };
let story = null, slide = 0, finaleShown = false;

// ---------- звук ----------
// Мелодия рендерится в WAV и играет через <audio>: работает и на iPhone в беззвучном режиме.
async function renderLoop(c) {
  const sr = 22050, step = 60 / c.bpm / 2, n = c.melody.length, loop = n * step, tail = step * 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(sr * (loop + tail)), sr);
  const master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
  const f = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function pluck(m, t, d, v, type) {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f(m);
    fl.type = "lowpass"; fl.frequency.setValueAtTime(3200, t); fl.frequency.exponentialRampToValueAtTime(400, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(fl); fl.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.05);
  }
  for (let i = 0; i < n; i++) {
    const t = i * step, m = c.melody[i];
    if (m !== null) pluck(c.root + m, t, step * 2.2, 0.35, c.wave);
    if (i % 8 === 0) pluck(c.root - 12 + c.bass[(i / 8) % c.bass.length], t, step * 7, 0.3, "sine");
    if (c.drum && i % 4 === 0) pluck(c.root - 24, t, step, 0.35, "sine");
  }
  const buf = await ctx.startRendering();
  const d = buf.getChannelData(0), L = Math.round(sr * loop), out = new Float32Array(L);
  out.set(d.subarray(0, L));
  for (let i = L; i < d.length; i++) out[i - L] += d[i];
  const w = new DataView(new ArrayBuffer(44 + L * 2));
  const str = (o, t) => [...t].forEach((ch, k) => w.setUint8(o + k, ch.charCodeAt(0)));
  str(0, "RIFF"); w.setUint32(4, 36 + L * 2, true); str(8, "WAVEfmt ");
  w.setUint32(16, 16, true); w.setUint16(20, 1, true); w.setUint16(22, 1, true);
  w.setUint32(24, sr, true); w.setUint32(28, sr * 2, true); w.setUint16(32, 2, true); w.setUint16(34, 16, true);
  str(36, "data"); w.setUint32(40, L * 2, true);
  for (let i = 0; i < L; i++) w.setInt16(44 + i * 2, Math.max(-1, Math.min(1, out[i])) * 32767, true);
  return URL.createObjectURL(new Blob([w], { type: "audio/wav" }));
}
const audio = new Audio();
audio.loop = true; audio.setAttribute("playsinline", "");
const urls = {};
const getUrl = (k) => (urls[k] = urls[k] || (C.songs && C.songs[k] ? Promise.resolve(C.songs[k]) : renderLoop(C.music[k])));
let curTrack = null;
const fade = (to, ms) => new Promise((res) => {
  const from = audio.volume, t0 = Date.now();
  const id = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / ms);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k >= 1) { clearInterval(id); res(); }
  }, 30);
});
async function track(key) {
  if (curTrack === key) return;
  curTrack = key;
  await fade(0, 250);
  if (curTrack !== key) return;
  try { audio.src = await getUrl(key); await audio.play(); } catch (e) { console.warn(e); }
  if (curTrack === key) fade(0.9, 500);
}
$("#mute").addEventListener("click", () => {
  audio.muted = !audio.muted;
  $("#mute").textContent = audio.muted ? "🔇" : "🔊";
  $("#mute").setAttribute("aria-label", audio.muted ? "Включить звук" : "Выключить звук");
});

// ---------- мир ----------
$("#defs").innerHTML = A.defs();
$("#worldArt").innerHTML = A.world();
$("#wTitle").textContent = C.worldTitle;
$("#wSub").textContent = `${C.name}, ${C.grade}`;
$("#sTitle").textContent = C.worldTitle;
$("#sSub").textContent = `Салам! Меня зовут ${C.name}. Добро пожаловать в мой мир!`;
$("#hint").innerHTML = `<span>👆</span><span>${C.hint}</span>`;

const SPOTS = {
  school: { cx: 100, cy: 600, rx: 108, ry: 96, chip: [100, 478] },
  family: { cx: 305, cy: 606, rx: 104, ry: 92, chip: [305, 494] },
  land: { cx: 205, cy: 370, rx: 176, ry: 74, chip: [310, 322] },
};
$("#wcam").insertAdjacentHTML("beforeend", IDS.map((id) => {
  const sp = SPOTS[id], st = C.stories[id];
  return `<g class="spot" data-id="${id}" tabindex="0" role="button" aria-label="Открыть: ${st.label}">
    <ellipse cx="${sp.cx}" cy="${sp.cy}" rx="${sp.rx}" ry="${sp.ry}" fill="rgba(255,255,255,.001)" pointer-events="all"/>
    <ellipse class="ring" cx="${sp.cx}" cy="${sp.cy}" rx="${sp.rx - 6}" ry="${sp.ry - 6}"/>
    <g transform="translate(${sp.chip[0]},${sp.chip[1]})"><g class="chip">
      <rect class="chipBg" x="-64" y="-20" width="128" height="40" rx="20"/>
      <text x="0" y="7" font-size="20" text-anchor="middle">${st.icon} ${st.label}</text>
      <g class="tick"><circle cx="58" cy="-18" r="11" fill="#2fb344" stroke="#fff" stroke-width="2.5"/><path d="M52 -18 l4 4 l8 -9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
    </g></g></g>`;
}).join(""));

function refreshWorld() {
  $("#stars").innerHTML = IDS.map((id) => `<span class="${visited.has(id) ? "on" : "off"}">⭐</span>`).join("");
  $("#stars").setAttribute("aria-label", `Открыто ${visited.size} из 3`);
  document.querySelectorAll(".spot").forEach((s) => s.classList.toggle("visited", visited.has(s.dataset.id)));
  $("#hint").classList.toggle("gone", visited.size > 0);
}

// ---------- истории ----------
const storyEl = $("#story");
function spotCenter(id) {
  const r = document.querySelector(`.spot[data-id="${id}"] .ring`).getBoundingClientRect(), a = $("#app").getBoundingClientRect();
  return [r.left + r.width / 2 - a.left, r.top + r.height / 2 - a.top];
}
function openStory(id, push = true) {
  story = id; slide = 0;
  const [px, py] = spotCenter(id), sp = SPOTS[id];
  $("#stage").innerHTML = SCENES[id]();
  storyEl.style.setProperty("--cx", px + "px"); storyEl.style.setProperty("--cy", py + "px");
  const w = $("#world");
  w.style.setProperty("--zx", -2.6 * (sp.cx - 200) + "px"); w.style.setProperty("--zy", -2.6 * (sp.cy - 400) + "px");
  w.classList.remove("intro"); w.classList.add("zoom");
  renderSlide(false);
  requestAnimationFrame(() => storyEl.classList.add("open"));
  if (push) history.pushState({ s: id }, "", "#" + id);
  track(id);
}
function closeStory() {
  if (!story) return;
  const id = story; story = null;
  visited.add(id); saveVisited();
  storyEl.classList.remove("open"); storyEl.classList.add("closing");
  $("#world").classList.remove("zoom");
  refreshWorld();
  track("world");
  setTimeout(() => {
    storyEl.classList.remove("closing"); $("#stage").innerHTML = "";
    if (visited.size === 3 && !finaleShown) showFinale();
  }, 800);
}
function renderSlide(animate = true) {
  const st = C.stories[story], sl = st.slides[slide], n = st.slides.length;
  const cam = $("#stage .cam"), [cx, cy, s] = sl.cam;
  cam.style.transform = `translate(${200 - cx * s}px, ${290 - cy * s}px) scale(${s})`;
  document.querySelectorAll("#stage [data-show]").forEach((el) => {
    const on = el.dataset.show.split(",").includes(String(slide + 1));
    el.classList.remove("on");
    if (on) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
  });
  $("#ic").textContent = st.icon; $("#ct").textContent = sl.t;
  $("#cp").innerHTML = sl.p.split(" ").map((w, i) => `<span class="w" style="animation-delay:${0.25 + i * 0.07}s">${w}</span>`).join(" ");
  $("#dots").innerHTML = st.slides.map((_, i) => `<i class="${i < slide ? "done" : i === slide ? "cur" : ""}"></i>`).join("");
  $("#prev").disabled = slide === 0;
  const last = slide === n - 1;
  $("#next").textContent = last ? "В мой мир 🌍" : "Дальше ▶";
  $("#next").classList.toggle("last", last);
}
const go = (d) => {
  if (!story) return;
  const n = C.stories[story].slides.length;
  if (d > 0 && slide === n - 1) return back();
  slide = Math.max(0, Math.min(n - 1, slide + d)); renderSlide();
};
function back() { history.state && history.state.s ? history.back() : closeStory(); }
$("#next").addEventListener("click", () => go(1));
$("#prev").addEventListener("click", () => go(-1));
$("#back").addEventListener("click", back);
window.addEventListener("popstate", () => { if (story) closeStory(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); else if (e.key === "Escape") back();
});
let tx = null;
storyEl.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
storyEl.addEventListener("touchend", (e) => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 55) go(dx < 0 ? 1 : -1);
});

const openSpot = (el) => { if (el && !story) openStory(el.dataset.id); };
$("#worldSvg").addEventListener("click", (e) => openSpot(e.target.closest(".spot")));
$("#worldSvg").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSpot(e.target.closest(".spot")); } });

// ---------- финал и конфетти ----------
function showFinale() {
  finaleShown = true;
  $("#fTitle").textContent = C.finale;
  $("#fSub").textContent = `Это мой мир: школа, семья и Родина. С любовью, ${C.name}!`;
  $("#finale").classList.remove("hide");
  confetti();
}
$("#again").addEventListener("click", () => { $("#finale").classList.add("hide"); });
function confetti() {
  const cv = $("#confetti"), g = cv.getContext("2d");
  cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio;
  const colors = ["#ff5d3b", "#ffd23f", "#26a69a", "#2b93e6", "#ff8fd0", "#8be67b"];
  const ps = Array.from({ length: 120 }, () => ({
    x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.6, w: (6 + Math.random() * 8) * devicePixelRatio,
    v: (2 + Math.random() * 4) * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], dx: (Math.random() - 0.5) * 2,
  }));
  const t0 = performance.now();
  (function loop(t) {
    g.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) {
      p.y += p.v; p.x += p.dx; p.r += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
    }
    if (t - t0 < 6000) requestAnimationFrame(loop); else g.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}

// ---------- старт ----------
refreshWorld();
const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
$("#enter").addEventListener("click", () => {
  audio.src = SILENT; audio.play().catch(() => {}); // «разблокируем» звук в момент нажатия
  $("#start").classList.add("hide");
  track("world");
  IDS.forEach((k) => getUrl(k)); // готовим остальную музыку заранее
  const h = location.hash.slice(1);
  if (IDS.includes(h)) { history.replaceState(null, "", location.pathname); setTimeout(() => openStory(h), 400); }
});
