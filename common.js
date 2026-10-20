// Солнце с тундуком: 40 лучей
document.querySelectorAll(".rays").forEach((g) => {
  let h = "";
  for (let i = 0; i < 40; i++) {
    const a = (i * 9 * Math.PI) / 180;
    h += `<line x1="${Math.cos(a) * 46}" y1="${Math.sin(a) * 46}" x2="${Math.cos(a) * 62}" y2="${Math.sin(a) * 62}"/>`;
  }
  g.innerHTML = h;
});

// Музыка: щипковый инструмент в духе комуза, без аудиофайлов.
// Мелодия рендерится в WAV и играет через <audio>: так звук есть и на iPhone в беззвучном режиме.
async function renderLoop(c) {
  const sr = 22050, step = 60 / c.bpm / 2, n = c.melody.length;
  const loop = n * step, tail = step * 3;
  const ctx = new OfflineAudioContext(1, Math.ceil(sr * (loop + tail)), sr);
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);
  const f = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function pluck(m, t, d, v, type) {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f(m);
    fl.type = "lowpass";
    fl.frequency.setValueAtTime(3200, t);
    fl.frequency.exponentialRampToValueAtTime(400, t + d);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(fl); fl.connect(g); g.connect(master);
    o.start(t); o.stop(t + d + 0.05);
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
  for (let i = L; i < d.length; i++) out[i - L] += d[i]; // хвост — в начало, чтобы цикл был плавным
  const w = new DataView(new ArrayBuffer(44 + L * 2));
  const str = (o, t) => [...t].forEach((ch, k) => w.setUint8(o + k, ch.charCodeAt(0)));
  str(0, "RIFF"); w.setUint32(4, 36 + L * 2, true); str(8, "WAVEfmt ");
  w.setUint32(16, 16, true); w.setUint16(20, 1, true); w.setUint16(22, 1, true);
  w.setUint32(24, sr, true); w.setUint32(28, sr * 2, true); w.setUint16(32, 2, true); w.setUint16(34, 16, true);
  str(36, "data"); w.setUint32(40, L * 2, true);
  for (let i = 0; i < L; i++) w.setInt16(44 + i * 2, Math.max(-1, Math.min(1, out[i])) * 32767, true);
  return URL.createObjectURL(new Blob([w], { type: "audio/wav" }));
}

// Старт по нажатию (телефон не даёт включить звук сам)
function begin(c) {
  const start = document.querySelector(".start");
  const mute = document.querySelector(".mute");
  const cap = document.querySelector(".caption");
  const audio = new Audio();
  audio.loop = true;
  audio.setAttribute("playsinline", "");
  start.querySelector("button").addEventListener("click", () => {
    // «разблокируем» аудио прямо в момент нажатия, пока рендерится мелодия
    audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    audio.play().catch(() => {});
    renderLoop(c.music).then((url) => { audio.src = url; return audio.play(); }).catch((e) => console.warn(e));
    start.classList.add("hide");
    document.body.classList.add("go");
    let k = 0;
    const say = () => {
      cap.classList.remove("show");
      setTimeout(() => { cap.textContent = c.lines[k++ % c.lines.length]; cap.classList.add("show"); }, 500);
    };
    say(); setInterval(say, 4500);
  });
  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    mute.textContent = audio.muted ? "🔇" : "🔊";
  });
}

// Эффекты поверх картинки: золотые искорки и (по желанию) дым из заданной точки
function startFx(opts) {
  opts = opts || {};
  const scene = document.querySelector(".scene");
  const cv = document.createElement("canvas");
  cv.id = "fx"; scene.appendChild(cv);
  const g = cv.getContext("2d");
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener("resize", fit);
  const N = 38, p = [];
  const mk = (init) => ({ x: Math.random() * cv.width, y: init ? Math.random() * cv.height : cv.height + 10,
    r: 1.5 + Math.random() * 3, v: 0.25 + Math.random() * 0.7, ph: Math.random() * 6.28 });
  for (let i = 0; i < N; i++) p.push(mk(true));
  (function loop(t) {
    g.clearRect(0, 0, cv.width, cv.height);
    for (const s of p) {
      s.y -= s.v; s.x += Math.sin(t / 900 + s.ph) * 0.4;
      if (s.y < -10) Object.assign(s, mk(false));
      const a = 0.35 + 0.35 * Math.sin(t / 400 + s.ph);
      g.beginPath(); g.fillStyle = `rgba(255,224,130,${a})`; g.shadowColor = "#ffd23f"; g.shadowBlur = 10;
      g.arc(s.x, s.y, s.r, 0, 6.28); g.fill();
    }
    requestAnimationFrame(loop);
  })(0);
  if (opts.smoke) for (let i = 0; i < 3; i++) {
    const d = document.createElement("div");
    d.className = "puff"; d.style.left = opts.smoke[0] + "%"; d.style.top = opts.smoke[1] + "%";
    d.style.animationDelay = i * 1.7 + "s"; scene.appendChild(d);
  }
}
