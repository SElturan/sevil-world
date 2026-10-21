const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = CONTENT;
const SECS = ["land", "family", "school"];
const PAGES = ["home", ...SECS, "awards"];
const COLOR = { land: "#d62839", family: "#e8590c", school: "#2b7de9" };
const HERO = { land: ART.heroLand, family: ART.heroFamily, school: ART.heroSchool };

// ---------- прогресс (хранится в телефоне) ----------
let P = { seen: {}, done: [], tasks: [] };
try { P = Object.assign(P, JSON.parse(localStorage.getItem("sevil-v3") || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem("sevil-v3", JSON.stringify(P)); } catch (e) {} };

// ---------- звук ----------
// Мелодия главной рендерится в WAV; песни играют напрямую (iPhone: приглушаются в WAV).
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
  await fade(0, 250);
  if (curTrack !== key) return;
  try { audio.src = await getUrl(key); await audio.play(); } catch (e) { console.warn(e); }
  if (curTrack === key) fade(C.songs[key] && volOK ? BG : 1, 500);
}
// Голос Севиль: файлы voice/<раздел>-<номер карточки>.mp3 и voice/hello.mp3. Нет файла — вежливое сообщение.
const voice = new Audio();
voice.setAttribute("playsinline", "");
function stopVoice() { voice.pause(); $$(".listen.playing").forEach((b) => b.classList.remove("playing")); }
function playVoice(name, btn, quiet) {
  const was = btn && btn.classList.contains("playing");
  stopVoice();
  if (!name || was) return;
  voice.onerror = () => { if (btn) btn.classList.remove("playing"); if (!quiet) toast("Голос Севиль скоро появится 🎙️"); };
  voice.onended = () => btn && btn.classList.remove("playing");
  voice.src = `voice/${name}.mp3?v=${C.voiceVersion || 1}`;
  voice.play().then(() => btn && btn.classList.add("playing")).catch(() => {});
}
$("#mute").addEventListener("click", () => {
  audio.muted = !audio.muted; voice.muted = audio.muted;
  $("#mute").innerHTML = icon(audio.muted ? "mute" : "sound");
  $("#mute").setAttribute("aria-label", audio.muted ? "Включить звук" : "Выключить звук");
});

// ---------- мелочи ----------
let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400); }
function burst(x, y, emoji = "❤️") {
  for (let i = 0; i < 4; i++) {
    const s = document.createElement("span");
    s.className = "burst"; s.textContent = emoji;
    s.style.left = x + (Math.random() - 0.5) * 40 + "px"; s.style.top = y + "px"; s.style.animationDelay = i * 0.07 + "s";
    document.body.appendChild(s); setTimeout(() => s.remove(), 1400);
  }
}
function confetti(count = 120) {
  const cv = $("#confetti"), g = cv.getContext("2d"), dpr = devicePixelRatio || 1;
  cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
  const colors = ["#d62839", "#ffd23f", "#26a69a", "#2b7de9", "#ff8fd0", "#8be67b"];
  const ps = Array.from({ length: count }, () => ({
    x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.6, w: (6 + Math.random() * 8) * dpr,
    v: (2 + Math.random() * 4) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], dx: (Math.random() - 0.5) * 2,
  }));
  const t0 = performance.now();
  (function loop(t) {
    g.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) { p.y += p.v; p.x += p.dx; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore(); }
    if (t - t0 < 4500) requestAnimationFrame(loop); else g.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}
const seenCount = (id) => (P.seen[id] || []).length;
const total = (id) => C.sections[id].blocks.length;

// ---------- построение страниц ----------
$("#defs").innerHTML = A.defs();
$("#brandTitle").textContent = C.title;
$("#mute").innerHTML = icon("sound");
$("#tabs").innerHTML = [["home", "Главная"], ["land", "Родина"], ["family", "Семья"], ["school", "Школа"], ["awards", "Награды"]]
  .map(([id, t]) => `<button class="tab" data-go="${id}"><span class="pill">${icon(id)}</span>${t}</button>`).join("");

function blockHTML(sec, b, i) {
  const idx = i + 1;
  const head = `<div class="cardhead"><span class="chip">${b.label}</span><button class="listen" data-voice="${sec}-${idx}" aria-label="Слушать: ${b.t}">${icon("sound")}<span>Слушать</span></button></div>`;
  const title = `<h2>${b.t}</h2>`;
  let body = "";
  if (b.type === "text") body = `${title}${b.art ? `<figure class="art">${ART[b.art]()}</figure>` : ""}<p>${b.p}</p>`;
  else if (["tree", "bag", "music", "map"].includes(b.type)) body = `${title}<p>${b.p}</p><figure class="fig">${ART[b.type]()}</figure><div class="info"><b>Нажми на картинку</b>Здесь появится рассказ.</div>`;
  else if (b.type === "tasks") body = `${title}<p>${b.p}</p>${b.tasks.map((t, k) => { const key = `${sec}:${k}`; const on = P.tasks.includes(key); return `<button class="task ${on ? "done" : ""}" data-key="${key}"><span class="chk">${on ? "❤️" : ""}</span>${t}</button>`; }).join("")}`;
  else if (b.type === "reasons") body = `${title}<p>${b.p}</p><div class="reasonBox" data-i="0">Нажми на кнопку 👇</div><button class="btn ghost wide reasonBtn">💖 Показать</button>`;
  else if (b.type === "end") body = `${title}<p>${b.p}</p><div class="finish"><small data-fin-note></small><button class="btn primary medalbtn" data-sec="${sec}"></button></div>`;
  return `<article class="card" data-sec="${sec}" data-i="${i}" data-end="${b.type === "end" ? 1 : 0}">${head}${body}</article>`;
}
const sectionHTML = (sec) => {
  const s = C.sections[sec], n = SECS.indexOf(sec) + 1;
  return `<section class="page" data-page="${sec}">
    <div class="hero">${HERO[sec]()}</div>
    <div class="sheet">
      <div class="titlebar"><div><div class="eyebrow">Раздел ${n} из 3</div><h1>${s.title}</h1></div><span class="count" data-count="${sec}"></span></div>
      <div class="lead">${s.lead}</div>
      <div class="bar"><i data-bar="${sec}"></i></div>
      ${s.blocks.map((b, i) => blockHTML(sec, b, i)).join("")}
    </div></section>`;
};
const hello = C.hello.split("! ");
const homeHTML = `<section class="page" data-page="home">
  <div class="homeHero"><div class="homeSky">${ART.heroHome()}</div>
    <div class="homeCopy"><img class="arch" src="img/sevil.jpg" alt="Севиль"><div class="bubble"><b>${hello[0]}!</b>${hello.slice(1).join("! ")}</div></div></div>
  <div class="sheet">
    <div class="titlebar"><div><div class="eyebrow">${C.name}, ${C.grade}</div><h1>${C.title}</h1></div></div>
    <button class="btn ghost wide" data-voice="hello" style="margin-bottom:16px">Слушать приветствие</button>
    <div class="h2">Куда отправимся?</div>
    ${SECS.map((id) => `<button class="route" data-go="${id}" style="--c:${COLOR[id]}"><div class="thumb">${HERO[id]()}</div>
      <div class="rbody"><div class="rtext"><h3>${C.sections[id].title}</h3><p>${C.sections[id].lead}</p><div class="mini"><i data-mini="${id}"></i></div></div><span class="go">${icon("back")}</span></div></button>`).join("")}
  </div></section>`;
$("#pages").innerHTML = homeHTML + SECS.map(sectionHTML).join("") + `<section class="page" data-page="awards"><div class="sheet" id="awardsBox" style="margin-top:0;padding-top:20px"></div></section>`;
// на главной маленькие картинки не двигаются
function refreshProgress() {
  SECS.forEach((id) => {
    const pct = Math.round((seenCount(id) / total(id)) * 100);
    const bar = $(`[data-bar="${id}"]`), mini = $(`[data-mini="${id}"]`), cnt = $(`[data-count="${id}"]`);
    if (bar) bar.style.width = pct + "%"; if (mini) mini.style.width = pct + "%";
    if (cnt) cnt.textContent = P.done.includes(id) ? "✓ Пройдено" : `${seenCount(id)} из ${total(id)}`;
    refreshFinish(id);
  });
}
function refreshFinish(id) {
  const btn = $(`.medalbtn[data-sec="${id}"]`), note = $(`.card[data-sec="${id}"][data-end="1"] [data-fin-note]`);
  if (!btn) return;
  const need = total(id) - 1, got = (P.seen[id] || []).filter((i) => !C.sections[id].blocks[i].type.startsWith("end")).length;
  if (P.done.includes(id)) { btn.textContent = "Смотреть медаль"; btn.disabled = false; note.textContent = "Раздел пройден 🎉"; }
  else if (got >= need) { btn.textContent = "Получить медаль 🏅"; btn.disabled = false; note.textContent = "Ты прочитал всё. Забирай награду!"; }
  else { btn.textContent = "Медаль скоро"; btn.disabled = true; note.textContent = `Прочитай карточки выше: ${got} из ${need}`; }
}
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  const r = e.intersectionRect, b = e.boundingClientRect;
  if (r.height >= Math.min(b.height * 0.5, 240)) {
    const sec = e.target.dataset.sec, i = +e.target.dataset.i;
    P.seen[sec] = P.seen[sec] || [];
    if (!P.seen[sec].includes(i)) { P.seen[sec].push(i); save(); refreshProgress(); }
  }
}), { root: $("#pages"), threshold: [0.02, 0.3, 0.6] });
$$(".card").forEach((c) => io.observe(c));

// ---------- действия ----------
$("#pages").addEventListener("click", (e) => {
  const t = e.target;
  const go = t.closest("[data-go]"); if (go) return void (location.hash = go.dataset.go);
  const lis = t.closest("[data-voice]"); if (lis) return playVoice(lis.dataset.voice, lis.classList.contains("listen") ? lis : null);
  const mkEl = t.closest(".mk");
  if (mkEl) {
    mkEl.classList.add("seen");
    const box = $(".info", mkEl.closest(".card")); box.innerHTML = `<b>${mkEl.dataset.t}</b>${mkEl.dataset.p}`;
    box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop");
    const r = mkEl.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, "✨");
    return;
  }
  const task = t.closest(".task");
  if (task) {
    const k = task.dataset.key;
    if (!P.tasks.includes(k)) { P.tasks.push(k); save(); task.classList.add("done"); task.firstElementChild.textContent = "❤️"; const r = task.getBoundingClientRect(); burst(r.left + 30, r.top); }
    return;
  }
  const rb = t.closest(".reasonBtn");
  if (rb) {
    const box = rb.previousElementSibling, i = +box.dataset.i;
    box.textContent = C.reasons[i % C.reasons.length]; box.dataset.i = i + 1;
    const r = rb.getBoundingClientRect(); burst(r.left + r.width / 2, r.top);
    rb.textContent = i + 1 >= C.reasons.length ? "💖 Ещё раз" : "💖 Ещё";
    return;
  }
  const mb = t.closest(".medalbtn");
  if (mb && !mb.disabled) { const id = mb.dataset.sec; P.done.includes(id) ? (location.hash = "awards") : finish(id); }
});
$("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) location.hash = b.dataset.go; });
$("#splash").addEventListener("click", (e) => { if (e.target.closest("[data-voice]")) playVoice("hello"); });

function finish(id) {
  const m = C.sections[id].medal;
  stopVoice();
  $("#mArt").innerHTML = A.medal(m);
  $("#mName").textContent = `Медаль «${m.name}»`;
  $("#mText").textContent = m.text;
  $("#medal").classList.add("show");
  confetti(120);
  $("#mOk").onclick = () => {
    $("#medal").classList.remove("show");
    if (!P.done.includes(id)) { P.done.push(id); save(); }
    refreshProgress();
    location.hash = P.done.length === 3 ? "awards" : "home";
  };
}
function renderAwards() {
  const hearts = P.tasks.length;
  $("#awardsBox").innerHTML = `<div class="eyebrow">Мои достижения</div><h1 style="font-family:var(--head);font-weight:900;font-size:30px;margin:2px 0 14px">Награды</h1>
    <div class="medals">${SECS.map((id) => { const m = C.sections[id].medal, got = P.done.includes(id); return `<div class="medalBox ${got ? "" : "lock"}">${A.medal(m)}<b>${m.name}</b><span>${got ? "Получена" : "Пока закрыта"}</span></div>`; }).join("")}</div>
    <div class="stat"><em>🏅</em>Медалей<strong>${P.done.length} из 3</strong></div>
    <div class="stat"><em>❤️</em>Добрых дел<strong>${hearts}</strong></div>
    <div class="stat"><em>📖</em>Прочитано карточек<strong>${SECS.reduce((s, id) => s + seenCount(id), 0)}</strong></div>
    ${P.done.length === 3 ? `<div class="finale"><div class="three">${SECS.map((id) => A.medal(C.sections[id].medal)).join("")}</div><p>${C.finale}</p></div>` : `<p style="margin-top:12px;font-weight:700;color:var(--muted)">Пройди все три раздела, и откроется финал.</p>`}`;
  if (P.done.length === 3 && !renderAwards.shown) { renderAwards.shown = true; confetti(90); }
}

// ---------- переходы между страницами ----------
function show(id) {
  if (!PAGES.includes(id)) id = "home";
  $$(".page").forEach((p) => p.classList.toggle("on", p.dataset.page === id));
  $$(".tab").forEach((t) => t.classList.toggle("on", t.dataset.go === id));
  $("#app").dataset.theme = id;
  $("#pages").scrollTop = 0;
  stopVoice();
  if (id === "awards") renderAwards();
  track(SECS.includes(id) ? id : "home");
}
window.addEventListener("hashchange", () => { if (started) show(location.hash.slice(1)); });

// ---------- старт ----------
let started = false;
$("#splashSky").innerHTML = ART.heroHome();
$("#sTitle").textContent = C.title;
$("#sHello").textContent = C.hello;
$("#enter").textContent = C.startButton + " →";
const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
$("#enter").addEventListener("click", () => {
  audio.src = SILENT; audio.play().catch(() => {});
  voice.src = SILENT; voice.play().catch(() => {});
  started = true;
  $("#splash").classList.add("hide");
  refreshProgress();
  show(location.hash.slice(1));
  setTimeout(() => playVoice("hello", null, true), 400);
  if (!volOK) SECS.forEach((k, i) => setTimeout(() => getUrl(k), 6000 + i * 6000)); // iPhone: готовим песни по одной
});
refreshProgress();
