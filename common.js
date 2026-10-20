// Солнце с тундуком: 40 лучей
document.querySelectorAll(".rays").forEach((g) => {
  let h = "";
  for (let i = 0; i < 40; i++) {
    const a = (i * 9 * Math.PI) / 180;
    h += `<line x1="${Math.cos(a) * 46}" y1="${Math.sin(a) * 46}" x2="${Math.cos(a) * 62}" y2="${Math.sin(a) * 62}"/>`;
  }
  g.innerHTML = h;
});

// Музыка: щипковый инструмент в духе комуза, без аудиофайлов
function makeMusic(c) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
  const step = 60 / c.bpm / 2;
  let i = 0, next = ctx.currentTime + 0.1;
  setInterval(() => {
    while (next < ctx.currentTime + 0.3) {
      const n = c.melody[i % c.melody.length];
      if (n !== null) pluck(c.root + n, next, step * 2.2, 0.35, c.wave);
      if (i % 8 === 0) pluck(c.root - 12 + c.bass[(i / 8) % c.bass.length], next, step * 7, 0.3, "sine");
      if (c.drum && i % 4 === 0) pluck(c.root - 24, next, step, 0.35, "sine");
      next += step; i++;
    }
  }, 100);
  return ctx;
}

// Старт по нажатию (телефон не даёт включить звук сам)
function begin(c) {
  const start = document.querySelector(".start");
  const mute = document.querySelector(".mute");
  const cap = document.querySelector(".caption");
  let ctx;
  start.querySelector("button").addEventListener("click", () => {
    ctx = makeMusic(c.music);
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
    if (ctx.state === "running") { ctx.suspend(); mute.textContent = "🔇"; }
    else { ctx.resume(); mute.textContent = "🔊"; }
  });
}
