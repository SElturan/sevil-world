const $ = (s) => document.querySelector(s);
const C = CONTENT;
const IDS = ["school", "family", "land"];
const SCENES = { school: A.sceneSchool, family: A.sceneFamily, land: A.sceneLand };

// ---------- состояние (хранится в телефоне) ----------
let P = { done: [], tasks: [], quiz: {} };
try { P = Object.assign(P, JSON.parse(localStorage.getItem("sevil-v2") || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem("sevil-v2", JSON.stringify(P)); } catch (e) {} };
let story = null, slide = 0, finaleShown = false;

// ---------- звук ----------
// Мелодия мира рендерится в WAV, песни приглушаются и «запекаются» в WAV: работает и на iPhone в беззвучном режиме.
async function renderLoop(c) {
  const sr = 22050, step = 60 / c.bpm / 2, n = c.melody.length, loop = n * step, tail = step * 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(sr * (loop + tail)), sr);
  const master = ctx.createGain(); master.gain.value = 0.3; master.connect(ctx.destination);
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
  return wavUrl([out], sr, 1);
}
function wavUrl(chs, sr, gain) {
  const ch = chs.length, L = chs[0].length;
  const w = new DataView(new ArrayBuffer(44 + L * ch * 2));
  const str = (o, t) => [...t].forEach((c, k) => w.setUint8(o + k, c.charCodeAt(0)));
  str(0, "RIFF"); w.setUint32(4, 36 + L * ch * 2, true); str(8, "WAVEfmt ");
  w.setUint32(16, 16, true); w.setUint16(20, 1, true); w.setUint16(22, ch, true);
  w.setUint32(24, sr, true); w.setUint32(28, sr * ch * 2, true); w.setUint16(32, ch * 2, true); w.setUint16(34, 16, true);
  str(36, "data"); w.setUint32(40, L * ch * 2, true);
  let o = 44;
  for (let i = 0; i < L; i++) for (let c = 0; c < ch; c++, o += 2) w.setInt16(o, Math.max(-1, Math.min(1, chs[c][i] * gain)) * 32767, true);
  return URL.createObjectURL(new Blob([w], { type: "audio/wav" }));
}
const BG = 0.28; // громкость песен как фона
async function bakedSong(path) {
  const raw = await (await fetch(path)).arrayBuffer();
  const ac = await new OfflineAudioContext(2, 1, 44100).decodeAudioData(raw);
  return wavUrl(Array.from({ length: ac.numberOfChannels }, (_, c) => ac.getChannelData(c)), ac.sampleRate, BG);
}
const audio = new Audio();
audio.loop = true; audio.setAttribute("playsinline", "");
const volOK = (() => { const a = new Audio(); a.volume = 0.5; return a.volume === 0.5; })();
const urls = {};
const getUrl = (k) => (urls[k] = urls[k] || (C.songs && C.songs[k] ? (volOK ? Promise.resolve(C.songs[k]) : bakedSong(C.songs[k]).catch(() => C.songs[k])) : renderLoop(C.music[k])));
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
  if (curTrack === key) fade(C.songs && C.songs[key] && volOK ? BG : 1, 500);
}
// Голос Севиль: файлы voice/<история>-<номер слайда>.mp3 и voice/hello.mp3. Если файла нет, молчим.
const voice = new Audio();
voice.setAttribute("playsinline", "");
function playVoice(name) {
  voice.pause();
  if (!name) return;
  voice.src = `voice/${name}.mp3?v=${C.voiceVersion || 1}`;
  voice.play().catch(() => {});
}
$("#mute").addEventListener("click", () => {
  audio.muted = !audio.muted; voice.muted = audio.muted;
  $("#mute").textContent = audio.muted ? "🔇" : "🔊";
  $("#mute").setAttribute("aria-label", audio.muted ? "Включить звук" : "Выключить звук");
});

// ---------- помощники ----------
const words = (el, text) => { el.innerHTML = text.split(" ").map((w, i) => `<span class="w" style="animation-delay:${0.2 + i * 0.06}s">${w}</span>`).join(" "); };
function burst(x, y, emoji = "❤️") {
  const app = $("#app").getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const s = document.createElement("span");
    s.className = "burst"; s.textContent = emoji;
    s.style.left = x - app.left + (Math.random() - 0.5) * 50 + "px"; s.style.top = y - app.top + "px";
    s.style.animationDelay = i * 0.07 + "s";
    $("#app").appendChild(s); setTimeout(() => s.remove(), 1400);
  }
}
const stat = () => ({ medals: P.done.length, hearts: P.tasks.length });

// ---------- мир ----------
$("#defs").innerHTML = A.defs();
$("#worldArt").innerHTML = A.world();
$("#wTitle").textContent = C.worldTitle;
$("#wSub").textContent = `${C.name}, ${C.grade}`;
$("#hint").innerHTML = `<span>👆</span><span>${C.hint}</span>`;

const SPOTS = {
  school: { cx: 100, cy: 600, rx: 108, ry: 96, chip: [100, 478] },
  family: { cx: 305, cy: 606, rx: 104, ry: 92, chip: [305, 494] },
  land: { cx: 205, cy: 370, rx: 176, ry: 74, chip: [310, 322] },
};
document.querySelector("#worldArt svg:last-of-type").insertAdjacentHTML("beforeend", IDS.map((id) => {
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
  $("#stars").innerHTML = IDS.map((id) => `<span class="${P.done.includes(id) ? "on" : "off"}">🏅</span>`).join("");
  $("#stars").setAttribute("aria-label", `Медалей: ${P.done.length} из 3`);
  document.querySelectorAll(".spot").forEach((s) => s.classList.toggle("visited", P.done.includes(s.dataset.id)));
  $("#hint").classList.toggle("gone", P.done.length > 0);
}

// ---------- истории ----------
const storyEl = $("#story");
function spotCenter(id) {
  const r = document.querySelector(`.spot[data-id="${id}"] .ring`).getBoundingClientRect(), a = $("#app").getBoundingClientRect();
  return [r.left + r.width / 2 - a.left, r.top + r.height / 2 - a.top];
}
function openStory(id, push = true) {
  story = id; slide = 0;
  const [px, py] = spotCenter(id);
  $("#stage").innerHTML = SCENES[id]();
  storyEl.style.setProperty("--cx", px + "px"); storyEl.style.setProperty("--cy", py + "px");
  const w = $("#world"), ap = $("#app");
  w.style.setProperty("--ox", px + "px"); w.style.setProperty("--oy", py + "px");
  w.style.setProperty("--zx", ap.clientWidth / 2 - px + "px"); w.style.setProperty("--zy", ap.clientHeight / 2 - py + "px");
  w.classList.remove("intro"); w.classList.add("zoom");
  renderSlide();
  requestAnimationFrame(() => storyEl.classList.add("open"));
  setTimeout(() => { if (story) w.classList.add("off"); }, 1000); // мир под историей не рисуем: экономим силы телефона
  if (push) history.pushState({ s: id }, "", "#" + id);
  track(id);
}
function closeStory() {
  if (!story) return;
  story = null;
  voice.pause();
  storyEl.classList.remove("open"); storyEl.classList.add("closing");
  $("#world").classList.remove("off"); $("#world").classList.remove("zoom");
  refreshWorld();
  track("world");
  setTimeout(() => {
    storyEl.classList.remove("closing"); $("#stage").innerHTML = "";
    if (P.done.length === 3 && !finaleShown) showFinale();
  }, 800);
}
function setHead(t, p) { $("#ct").textContent = t; if (p !== undefined) words($("#cp"), p); }

function camPx(cx, cy, s) {
  const W = $("#app").clientWidth, H = $("#app").clientHeight, k = Math.max(W / 400, H / 800), ox = (W - 400 * k) / 2;
  return `translate(${k * 200 + ox - s * (k * cx + ox)}px, ${k * 290 - s * k * cy}px) scale(${s})`;
}
function renderSlide() {
  const st = C.stories[story], sl = st.slides[slide], n = st.slides.length;
  $("#stage .layers").style.transform = camPx(...sl.cam);
  document.querySelectorAll("#stage [data-show]").forEach((el) => {
    const on = el.dataset.show.split(",").includes(sl.id);
    el.classList.remove("on");
    if (on) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
  });
  $("#ic").textContent = st.icon;
  $("#extra").innerHTML = ""; $("#card").dataset.type = sl.type || "story";
  setHead(sl.t, sl.p || "");
  $("#dots").innerHTML = st.slides.map((_, i) => `<i class="${i < slide ? "done" : i === slide ? "cur" : ""}"></i>`).join("");
  $("#prev").disabled = slide === 0;
  const last = slide === n - 1;
  $("#next").textContent = last ? "Готово 🎉" : "Дальше ▶";
  $("#next").classList.toggle("last", last);
  $("#next").disabled = false;
  if (sl.type === "tasks") runTasks(st, sl);
  else if (sl.type === "reasons") runReasons();
  playVoice(`${story}-${slide + 1}`);
}

// --- задания «Сердце доброты»
function runTasks(st, sl) {
  const key = (i) => `${story}:${i}`;
  const draw = () => {
    $("#extra").innerHTML = sl.tasks.map((t, i) => `<button class="task ${P.tasks.includes(key(i)) ? "done" : ""}" data-i="${i}"><span class="chk">${P.tasks.includes(key(i)) ? "❤️" : "🤍"}</span>${t}</button>`).join("");
  };
  draw();
  $("#extra").onclick = (e) => {
    const b = e.target.closest(".task"); if (!b) return;
    const k = key(+b.dataset.i);
    if (!P.tasks.includes(k)) { P.tasks.push(k); save(); const r = b.getBoundingClientRect(); burst(r.left + 30, r.top); }
    draw();
  };
}
// --- «За что я люблю семью?»
function runReasons() {
  let i = 0;
  $("#extra").innerHTML = `<button class="opt big" id="rs">💖 Показать</button>`;
  $("#extra").onclick = (e) => {
    const b = e.target.closest("#rs"); if (!b) return;
    const txt = C.reasons[i % C.reasons.length]; i++;
    setHead("Я люблю свою семью…", txt);
    const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top);
    b.textContent = i >= C.reasons.length ? "💖 Ещё раз" : "💖 Ещё";
  };
}
// --- нажатие на интерактивные предметы на сцене (дерево, портфель, карта…)
function onMk(el) {
  if (!el) return;
  el.classList.add("seen");
  setHead(el.dataset.t, el.dataset.p);
  const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, "✨");
}
$("#stage").addEventListener("click", (e) => onMk(e.target.closest(".mk")));
$("#stage").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onMk(e.target.closest(".mk")); } });

// ---------- навигация ----------
const go = (d) => {
  if (!story) return;
  const n = C.stories[story].slides.length;
  if (d > 0 && slide === n - 1) return finishStory();
  slide = Math.max(0, Math.min(n - 1, slide + d)); renderSlide();
};
function back() { history.state && history.state.s ? history.back() : closeStory(); }
$("#next").addEventListener("click", () => go(1));
$("#prev").addEventListener("click", () => go(-1));
$("#back").addEventListener("click", back);
window.addEventListener("popstate", () => { if (story && !$("#medal").classList.contains("show")) closeStory(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); else if (e.key === "Escape") back();
});
let tx = null;
storyEl.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
storyEl.addEventListener("touchend", (e) => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 55 && !e.target.closest(".mk, .opt, .task")) go(dx < 0 ? 1 : -1);
});
const openSpot = (el) => { if (el && !story) openStory(el.dataset.id); };
$("#worldArt").addEventListener("click", (e) => openSpot(e.target.closest(".spot")));
$("#worldArt").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSpot(e.target.closest(".spot")); } });

// ---------- медаль, финал, книга воспоминаний ----------
function finishStory() {
  const id = story, m = C.stories[id].medal;
  voice.pause();
  $("#mArt").innerHTML = A.medal(m);
  $("#mName").textContent = `Медаль «${m.name}»`;
  $("#mText").textContent = m.text;
  $("#medal").classList.add("show");
  confetti(120);
  $("#mOk").onclick = () => {
    $("#medal").classList.remove("show");
    if (!P.done.includes(id)) { P.done.push(id); save(); }
    closeStory();
  };
}
function showFinale() {
  finaleShown = true;
  $("#fTitle").textContent = C.finale;
  const s = stat();
  $("#fBook").innerHTML = `<b>📖 Книга воспоминаний</b>
    <span>🏅 Медалей: ${s.medals} из 3</span><span>❤️ Добрых дел: ${s.hearts}</span>`;
  $("#fMedals").innerHTML = IDS.map((id, i) => `<div class="fm fm${i}">${A.medal(C.stories[id].medal)}</div>`).join("");
  $("#finale").classList.remove("hide");
  requestAnimationFrame(() => setTimeout(() => $("#fMedals").classList.add("join"), 400));
  confetti(150);
}
$("#again").addEventListener("click", () => { $("#finale").classList.add("hide"); $("#fMedals").classList.remove("join"); });
function confetti(count = 120) {
  const cv = $("#confetti"), g = cv.getContext("2d");
  cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio;
  const colors = ["#ff5d3b", "#ffd23f", "#26a69a", "#2b93e6", "#ff8fd0", "#8be67b"];
  const ps = Array.from({ length: count }, () => ({
    x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.6, w: (6 + Math.random() * 8) * devicePixelRatio,
    v: (2 + Math.random() * 4) * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], dx: (Math.random() - 0.5) * 2,
  }));
  const t0 = performance.now();
  (function loop(t) {
    g.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) { p.y += p.v; p.x += p.dx; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore(); }
    if (t - t0 < 5000) requestAnimationFrame(loop); else g.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}

// ---------- старт ----------
$("#sTitle").innerHTML = C.worldTitle.split("").map((ch, i) => (ch === " " ? " " : `<span class="lt" style="animation-delay:${0.15 + i * 0.05}s">${ch}</span>`)).join("");
$("#sSub").textContent = C.hello;
$("#enter").textContent = "▶ " + C.startButton;
$("#start").insertAdjacentHTML("afterbegin", `<svg class="sbg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <rect width="400" height="800" fill="url(#sky)"/>${A.sun(330, 120, 30)}${A.cloud(80, 160, 1, 38)}${A.cloud(250, 260, 0.8, 46, -9)}${A.mountains(300)}
  <path d="M-50 770 Q100 720 220 760 T450 740 V900 H-50Z" fill="url(#grass)" stroke="${INK}" stroke-width="2.5"/></svg>`);
$("#card").insertAdjacentHTML("afterbegin", `<svg class="guide" viewBox="-36 -80 72 86" aria-hidden="true">${A.kid({ kind: "girl", cls: "hop" })}</svg>`);
refreshWorld();
const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
$("#enter").addEventListener("click", () => {
  audio.src = SILENT; audio.play().catch(() => {});
  voice.src = SILENT; voice.play().catch(() => {});
  $("#start").classList.add("hide");
  track("world");
  if (!volOK) IDS.forEach((k, i) => setTimeout(() => getUrl(k), 5000 + i * 6000)); // iPhone: готовим песни по одной
  setTimeout(() => playVoice("hello"), 300);
  const h = location.hash.slice(1);
  if (IDS.includes(h)) { history.replaceState(null, "", location.pathname); setTimeout(() => openStory(h), 400); }
});
