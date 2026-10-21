const $ = (s, r = document) => r.querySelector(s);
const C = CONTENT;
const stage = $("#stage");
const SECS = ["school", "family", "land"]; // порядок как на диораме: школа · семья · Родина
const ANCHORS = [[62, 372], [128, 372], [138, 430], [262, 430], [270, 372], [338, 372]]; // подписи над головами

// ---------- прогресс (хранится в телефоне) ----------
let P = { done: [] };
try { P = Object.assign(P, JSON.parse(localStorage.getItem("sevil-v4") || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem("sevil-v4", JSON.stringify(P)); } catch (e) {} };

// ---------- звук ----------
// Мелодия книги рендерится в WAV; песни играют напрямую (iPhone: приглушаются в WAV).
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
const BG = 0.32; // громкость песен как фона
async function bakedSong(path) {
  const raw = await (await fetch(path)).arrayBuffer();
  const ac = await new OfflineAudioContext(2, 1, 44100).decodeAudioData(raw);
  return wavUrl(Array.from({ length: ac.numberOfChannels }, (_, c) => ac.getChannelData(c)), ac.sampleRate, BG);
}
const audio = new Audio();
audio.loop = true; audio.setAttribute("playsinline", "");
const volOK = (() => { const a = new Audio(); a.volume = 0.5; return a.volume === 0.5; })();
const urls = {};
const getUrl = (k) => (urls[k] = urls[k] || (C.songs[k] ? (volOK ? Promise.resolve(C.songs[k]) : bakedSong(C.songs[k]).catch(() => C.songs[k])) : renderLoop(C.music[k])));
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
  await fade(0, 300);
  if (curTrack !== key) return;
  try { audio.src = await getUrl(key); await audio.play(); } catch (e) { console.warn(e); }
  if (curTrack === key) fade(C.songs[key] && volOK ? BG : 1, 700);
}
// Голос Севиль: voice/<id сцены>.mp3 и voice/hello.mp3. Нет файла — просто тишина.
const voice = new Audio();
voice.setAttribute("playsinline", "");
function playVoice(name) { voice.pause(); voice.onerror = () => {}; voice.src = `voice/${name}.mp3?v=${C.voiceVersion || 1}`; voice.play().catch(() => {}); }
$("#mute").addEventListener("click", () => {
  audio.muted = !audio.muted; voice.muted = audio.muted;
  $("#mute").textContent = audio.muted ? "🔇" : "🔊";
});

// ---------- частицы (один лёгкий холст) ----------
const cv = $("#fx"), g = cv.getContext("2d");
stage.appendChild(cv);
const fx = { type: null, ps: [], last: 0 };
function fitFx() { cv.width = stage.clientWidth; cv.height = stage.clientHeight; }
const heart = (x, y, s) => { g.beginPath(); g.moveTo(x, y + s * .3); g.bezierCurveTo(x - s, y - s * .6, x - s * .2, y - s, x, y - s * .3); g.bezierCurveTo(x + s * .2, y - s, x + s, y - s * .6, x, y + s * .3); g.fill(); };
function spawn(type, initial) {
  const W = cv.width, H = cv.height, r = Math.random;
  if (type === "confetti") return { x: r() * W, y: initial ? r() * H * 0.4 - H * 0.4 : -10, v: 2 + r() * 3.5, dx: (r() - 0.5) * 2, s: 5 + r() * 6, rot: r() * 6, vr: (r() - 0.5) * 0.3, c: ["#ff5d3b", "#ffd23f", "#26a69a", "#2b7de9", "#ff8fd0", "#8be67b"][(r() * 6) | 0] };
  return { x: r() * W, y: initial ? r() * H : H + 20, v: 0.35 + r() * 0.9, dx: (r() - 0.5) * 0.4, s: type === "hearts" ? 7 + r() * 9 : 1.5 + r() * 3, ph: r() * 6.28 };
}
function setFx(type, count = 26) {
  fx.type = type; cv.width = cv.width; cv.style.zIndex = type === "confetti" ? 80 : 12;
  fx.ps = type ? Array.from({ length: type === "confetti" ? 110 : count }, () => spawn(type, true)) : [];
}
function frame(t) {
  requestAnimationFrame(frame);
  if (!fx.type || stage.classList.contains("paused") || t - fx.last < 33) return;
  fx.last = t;
  const W = cv.width, H = cv.height;
  g.clearRect(0, 0, W, H);
  for (const p of fx.ps) {
    p.y += fx.type === "confetti" ? p.v : -p.v; p.x += p.dx + (fx.type === "confetti" ? 0 : Math.sin(t / 700 + p.ph) * 0.35);
    if (fx.type === "confetti") { p.rot += p.vr; if (p.y > H + 10) Object.assign(p, spawn("confetti", false)); g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); continue; }
    if (p.y < -20) Object.assign(p, spawn(fx.type, false));
    const a = 0.45 + 0.4 * Math.sin(t / 380 + p.ph);
    if (fx.type === "hearts") { g.fillStyle = `rgba(255,120,150,${a})`; heart(p.x, p.y, p.s); }
    else if (fx.type === "sparks") { g.fillStyle = `rgba(255,244,190,${a})`; g.fillRect(p.x - p.s * 0.2, p.y - p.s * 1.6, p.s * 0.4, p.s * 3.2); g.fillRect(p.x - p.s * 1.6, p.y - p.s * 0.2, p.s * 3.2, p.s * 0.4); }
    else { g.fillStyle = `rgba(255,226,140,${a * 0.55})`; g.beginPath(); g.arc(p.x, p.y, p.s * 1.9, 0, 6.3); g.fill(); g.fillStyle = `rgba(255,248,210,${a})`; g.beginPath(); g.arc(p.x, p.y, p.s * 0.8, 0, 6.3); g.fill(); }
  }
}

// ---------- параллакс: наклон телефона или мышь ----------
let lastPar = 0;
function setPar(x, y) { const now = performance.now(); if (now - lastPar < 40) return; lastPar = now; stage.style.setProperty("--px", x.toFixed(1)); stage.style.setProperty("--py", y.toFixed(1)); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
window.addEventListener("deviceorientation", (e) => { if (e.gamma == null) return; setPar(clamp(e.gamma, -30, 30) / 30 * 22, clamp((e.beta || 45) - 45, -30, 30) / 30 * 14); });
stage.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; const r = stage.getBoundingClientRect(); setPar(((e.clientX - r.left) / r.width - 0.5) * 44, ((e.clientY - r.top) / r.height - 0.5) * 28); });

// ---------- помощники для картинок ----------
const parLayers = (layers) => layers.map(([cls, d, svg]) => `<div class="par" style="--d:${d}"><div class="lay ${cls}">${svg}</div></div>`).join("");
function words(el, text, step = 0.07, base = 0.15) { el.innerHTML = text.split(" ").map((w, i) => `<span class="w" style="animation-delay:${base + i * step}s">${w}</span>`).join(" "); }
const mapK = (W, H) => { const pw = W * 1.1, ph = H * 1.1, k = Math.max(pw / 400, ph / 800); return { k, ox: (pw - 400 * k) / 2 - W * 0.05, oy: (ph - 800 * k) / 2 - H * 0.05 }; };

// ---------- главная: одна сцена-диорама, выбор на одном экране ----------
$("#defs").innerHTML = A.defs() + EXTRA_DEFS;
const hl = (cls, d, svg) => `<div class="hl ${cls}"><div class="par" style="--d:${d}"><div class="lay">${svg}</div></div></div>`;
$("#hubLayers").innerHTML = hl("wall", 0.08, PAPER.wall()) + hl("tree", 0.3, PAPER.tree()) + hl("boxes", 0.45, PAPER.boxes()) + hl("fx", 0.6, PAPER.hubFx());
const SPOTS = [
  { sec: "family", rect: [40, 96, 320, 450], chip: [200, 130], label: "Семья ❤️" },
  { sec: "school", rect: [8, 476, 160, 280], chip: [88, 506], label: "Школа 📚" },
  { sec: "land", rect: [232, 476, 160, 280], chip: [312, 506], label: "Родина 🇰🇬" },
];
function placeSpots() {
  const W = stage.clientWidth, H = stage.clientHeight, { k, ox, oy } = mapK(W, H);
  $("#spots").innerHTML = SPOTS.map((s) => {
    const [x, y, w, h] = s.rect, l = ox + x * k, t = oy + y * k, pw = w * k, ph = h * k;
    const cx = ((s.chip[0] - x) / w) * 100, cy = ((s.chip[1] - y) / h) * 100;
    return `<button class="spot${P.done.includes(s.sec) ? " done" : ""}" data-sec="${s.sec}" aria-label="Открыть: ${C.sections[s.sec].title}" style="left:${l.toFixed(0)}px;top:${t.toFixed(0)}px;width:${pw.toFixed(0)}px;height:${ph.toFixed(0)}px"><span class="lbl" style="left:${cx.toFixed(1)}%;top:${cy.toFixed(1)}%">${s.label}</span></button>`;
  }).join("");
}
const renderMedals = placeSpots; // отметка ✓ на пройденных местах
$("#spots").addEventListener("click", (e) => { const b = e.target.closest(".spot"); if (b) openSection(b.dataset.sec); });
addEventListener("resize", () => { fitFx(); placeSpots(); });

// ---------- рассказ ----------
function buildScene(s) {
  const el = document.createElement("div");
  el.className = "scene" + (s.scene === "family" || s.scene === "familyTree" ? " warm" : "");
  el.style.setProperty("--dur", s.dur + "s");
  let inner;
  if (s.pano) inner = `<div class="photoWrap"><div class="par" style="--d:0"><div class="photo pano" style="--x0:${s.from[0]};--x1:${s.to[0]};--s0:${s.from[1]};--s1:${s.to[1]};--o:${s.origin}">${PAPER.pano().map(([c, , svg]) => `<div class="lay ${c}">${svg}</div>`).join("")}</div></div></div>`;
  else inner = parLayers(PAPER.layers[s.scene](s));
  let extra = "";
  if (s.scene === "family" || s.scene === "familyTree") extra += `<div class="glow"></div>`;
  if (s.names) {
    const W = stage.clientWidth, H = stage.clientHeight, { k, ox, oy } = mapK(W, H);
    extra += C.people.map((p, i) => `<span class="chip" style="left:${(ox + ANCHORS[i][0] * k).toFixed(0)}px;top:${(oy + ANCHORS[i][1] * k).toFixed(0)}px;--d:${(0.9 + i).toFixed(1)}s">${p.name ? `${p.role} ${p.name}` : p.role}</span>`).join("");
  }
  if (s.letters) extra += ["А", "Б", "2+3", "ABC", "π", "✏️", "📚", "🔬"].map((t, i) => `<span class="letter" style="left:${8 + ((i * 37) % 80)}%;--d:${(i * 0.55).toFixed(2)}s">${t}</span>`).join("");
  el.innerHTML = `<div class="camera${s.scene ? " push" : ""}">${inner}${extra}</div><div class="sweep"></div>`;
  return el;
}
let list = [], idx = 0, cur = null, running = false, sec = null;
function renderSegs() { $("#segs").innerHTML = list.map((_, k) => `<i class="${k < idx ? "done" : k === idx ? "cur" : ""}"><b></b></i>`).join(""); }
function go(i) {
  if (i < 0) i = 0;
  if (i >= list.length) return endSection();
  idx = i;
  const s = list[i], el = buildScene(s);
  $("#scenes").appendChild(el);
  void el.offsetWidth; el.classList.add("on");
  if (cur) { const old = cur; old.classList.remove("on"); setTimeout(() => old.remove(), 1100); }
  cur = el;
  stage.style.setProperty("--dur", s.dur + "s");
  $("#area").textContent = s.area; words($("#line"), s.text);
  renderSegs(); setFx(s.fx); track(s.music || "home"); playVoice(s.id);
}
$("#segs").addEventListener("animationend", (e) => { if (e.animationName === "fill" && running) go(idx + 1); });
function openSection(id) {
  sec = id; list = C.scenes.filter((s) => s.sec === id); idx = 0; running = true;
  $("#scenes").innerHTML = ""; cur = null;
  stage.classList.add("story");
  $("#hint").classList.add("show"); setTimeout(() => $("#hint").classList.remove("show"), 4000);
  go(0);
}
function leaveStory() {
  running = false; stage.classList.remove("story", "paused"); voice.pause(); setFx(null);
  setTimeout(() => { if (!running) { $("#scenes").innerHTML = ""; cur = null; } }, 900);
  track("home"); renderMedals();
}
function endSection() {
  if (sec && !P.done.includes(sec)) { P.done.push(sec); save(); }
  leaveStory();
  if (P.done.length === SECS.length) setTimeout(showFinale, 1000);
}
$("#home").addEventListener("click", leaveStory);

// нажатия: справа дальше, слева назад, удержание — пауза
let holdT = null, held = false;
const zones = $("#zones");
zones.addEventListener("pointerdown", () => { held = false; holdT = setTimeout(() => { held = true; stage.classList.add("paused"); voice.pause(); }, 220); });
const release = () => { clearTimeout(holdT); if (held) { stage.classList.remove("paused"); voice.play().catch(() => {}); } };
zones.addEventListener("pointerup", (e) => { release(); if (held || !running) return; const r = stage.getBoundingClientRect(); go((e.clientX - r.left) / r.width < 0.3 ? idx - 1 : idx + 1); });
zones.addEventListener("pointercancel", release);
zones.addEventListener("pointerleave", release);

// ---------- финал ----------
$("#finaleLayers").innerHTML = parLayers([["sky", 0.05, PAPER.sunset()], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.3, PAPER.familyMid()]]);
$("#fText").textContent = C.finaleText;
$("#fCredit").textContent = `${C.name}, ${C.grade} · школа «${C.school}»`;
function showFinale() {
  stage.classList.add("fin");
  $("#meds").classList.remove("join");
  $("#meds").innerHTML = SECS.map((id, k) => `<div class="med med${k}">${A.medal(C.sections[id].medal)}</div>`).join("");
  $("#finale").classList.add("on");
  setTimeout(() => $("#meds").classList.add("join"), 500);
  setFx("confetti"); track("home"); playVoice("finale");
}
$("#again").addEventListener("click", () => { $("#finale").classList.remove("on"); stage.classList.remove("fin"); setFx(null); voice.pause(); });

// ---------- заставка ----------
$("#introLayers").innerHTML = parLayers([["sky", 0.05, PAPER.sunset()], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.3, PAPER.titleMid()]]);
words($("#iTitle"), C.title, 0.12, 0.3);
$("#iHello").textContent = C.hello;
$("#enter").textContent = C.tap;
const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
$("#enter").addEventListener("click", () => {
  audio.src = SILENT; audio.play().catch(() => {});
  voice.src = SILENT; voice.play().catch(() => {});
  const D = window.DeviceOrientationEvent;
  if (D && typeof D.requestPermission === "function") D.requestPermission().catch(() => {});
  $("#intro").classList.add("hide");
  setTimeout(() => $("#hub").classList.add("rise"), 350);
  track("home");
  setTimeout(() => playVoice("hello"), 600);
  if (!volOK) Object.keys(C.songs).forEach((k, i) => setTimeout(() => getUrl(k), 6000 + i * 6000)); // iPhone: готовим песни по одной
});
fitFx(); renderMedals(); requestAnimationFrame(frame);
