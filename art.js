// Мультяшная графика в SVG. Каждая функция возвращает кусок разметки.
const INK = "#5b3a29";
const S = (w = 2.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const A = {};

A.defs = () => `
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3da9f0"/><stop offset=".55" stop-color="#8fd6ff"/><stop offset="1" stop-color="#e9f8ff"/></linearGradient>
  <linearGradient id="skyWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5bb8f2"/><stop offset=".6" stop-color="#ffe3a8"/><stop offset="1" stop-color="#fff2d0"/></linearGradient>
  <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be35f"/><stop offset="1" stop-color="#4fb046"/></linearGradient>
  <linearGradient id="grass2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7ee73"/><stop offset="1" stop-color="#6cc34c"/></linearGradient>
  <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ddcff"/><stop offset="1" stop-color="#2b93e6"/></linearGradient>
  <radialGradient id="sunG"><stop offset="0" stop-color="#fff7a8"/><stop offset="1" stop-color="#ffc62b"/></radialGradient>
  <pattern id="lat" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#fff6e0"/><path d="M0 0H14M0 0V14" stroke="#d9bb8c" stroke-width="1.6"/></pattern>
  <pattern id="orn" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="14" fill="#d9372f"/><path d="M11 2 L18 7 L11 12 L4 7Z" fill="#fff3d6"/><circle cx="0" cy="7" r="2.2" fill="#ffd23f"/><circle cx="22" cy="7" r="2.2" fill="#ffd23f"/></pattern>
  <pattern id="orn2" width="18" height="12" patternUnits="userSpaceOnUse"><rect width="18" height="12" fill="#2a6fd6"/><path d="M9 1 L15 6 L9 11 L3 6Z" fill="#ffd23f"/></pattern>
</defs>`;

// ---------- мелочи ----------
A.cloud = (x, y, s = 1, dur = 40, delay = 0) => `
<g transform="translate(${x},${y}) scale(${s})"><g class="drift" style="animation-duration:${dur}s;animation-delay:${delay}s">
  <path d="M-40 12 Q-50 -4 -30 -8 Q-26 -28 -2 -22 Q14 -36 30 -18 Q54 -16 48 6 Q52 16 38 16 H-30 Q-40 18 -40 12Z" fill="#fff" stroke="#bfe3f8" stroke-width="2"/>
</g></g>`;

A.sun = (x, y, r = 34) => {
  let rays = "";
  for (let i = 0; i < 40; i++) {
    const a = (i * 9 * Math.PI) / 180, l = i % 2 ? r + 11 : r + 17;
    rays += `<line x1="${(Math.cos(a) * (r + 4)).toFixed(1)}" y1="${(Math.sin(a) * (r + 4)).toFixed(1)}" x2="${(Math.cos(a) * l).toFixed(1)}" y2="${(Math.sin(a) * l).toFixed(1)}"/>`;
  }
  return `<g transform="translate(${x},${y})"><g class="spin" style="transform-origin:0 0"><g stroke="#ffb81c" stroke-width="3" stroke-linecap="round">${rays}</g></g>
  <circle r="${r}" fill="url(#sunG)" stroke="#f2a20c" stroke-width="3"/>
  <circle cx="${-r * .35}" cy="${-r * .1}" r="3.4" fill="${INK}"/><circle cx="${r * .35}" cy="${-r * .1}" r="3.4" fill="${INK}"/>
  <path d="M${-r * .4} ${r * .22} Q0 ${r * .6} ${r * .4} ${r * .22}" fill="none" ${S(2.6)}/>
  <ellipse cx="${-r * .6}" cy="${r * .15}" rx="5" ry="3" fill="#ff9a8a" opacity=".7"/><ellipse cx="${r * .6}" cy="${r * .15}" rx="5" ry="3" fill="#ff9a8a" opacity=".7"/></g>`;
};

A.flower = (x, y, c = "#ff5d73", delay = 0, s = 1) => `
<g transform="translate(${x},${y}) scale(${s})"><g class="sway" style="animation-delay:${delay}s">
  <path d="M0 0 Q-2 -12 0 -24" fill="none" stroke="#3f9a3a" stroke-width="3" stroke-linecap="round"/>
  <path d="M0 -10 Q-10 -14 -12 -8 Q-4 -4 0 -10Z" fill="#58b84a"/>
  <g fill="${c}" ${S(1.4)}><circle cx="0" cy="-32" r="5"/><circle cx="6.5" cy="-27" r="5"/><circle cx="-6.5" cy="-27" r="5"/><circle cx="4" cy="-20" r="5"/><circle cx="-4" cy="-20" r="5"/></g>
  <circle cx="0" cy="-26" r="4" fill="#ffd23f" ${S(1.2)}/>
</g></g>`;

A.tree = (x, y, s = 1) => `
<g transform="translate(${x},${y}) scale(${s})">
  <rect x="-7" y="-46" width="14" height="48" rx="5" fill="#9a6232" ${S()}/>
  <g ${S()}><circle cx="0" cy="-78" r="30" fill="#52b94a"/><circle cx="-24" cy="-60" r="22" fill="#5fc454"/><circle cx="24" cy="-60" r="22" fill="#5fc454"/><circle cx="0" cy="-92" r="20" fill="#6dd25f"/></g>
  <circle cx="-8" cy="-86" r="5" fill="#8be67b" opacity=".7"/>
</g>`;

A.heart = (x, y, delay = 0, c = "#ff4d6d", s = 1) => `
<g transform="translate(${x},${y}) scale(${s})"><path class="heartUp" style="animation-delay:${delay}s" d="M0 6 C-14 -6 -10 -18 0 -10 C10 -18 14 -6 0 6Z" fill="${c}" ${S(1.6)}/></g>`;

A.sparkle = (x, y, delay = 0, s = 1) => `
<g transform="translate(${x},${y}) scale(${s})"><path class="twinkle" style="animation-delay:${delay}s" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="#fff6a8" stroke="#ffc62b" stroke-width="1.5"/></g>`;

A.eagle = (x, y, s = 1) => `
<g transform="translate(${x},${y}) scale(${s})"><g class="glide">
  <g class="wingL"><path d="M0 0 Q-30 -30 -70 -10 Q-48 -8 -40 4 Q-32 -2 -24 7 Q-14 2 0 8Z" fill="#7a4a24" ${S(2)}/></g>
  <g class="wingR"><path d="M0 0 Q30 -30 70 -10 Q48 -8 40 4 Q32 -2 24 7 Q14 2 0 8Z" fill="#7a4a24" ${S(2)}/></g>
  <ellipse cx="0" cy="6" rx="12" ry="18" fill="#8d5a2b" ${S(2)}/>
  <circle cx="0" cy="-12" r="9" fill="#f0c36a" ${S(2)}/>
  <path d="M3 -12 L12 -9 L4 -6Z" fill="#ffb81c" ${S(1.5)}/><circle cx="1" cy="-14" r="1.8" fill="${INK}"/>
  <path d="M-6 22 L0 34 L6 22Z" fill="#6a3d1c" ${S(1.6)}/>
</g></g>`;

// ---------- человечки ----------
// Начало координат — под ногами. kind: girl | boy | mom | dad
A.kid = (o) => {
  const { x = 0, y = 0, s = 1, kind = "girl", cls = "", delay = 0, dataShow = "" } = o;
  const skin = "#f7c9a0";
  const cfg = {
    girl: { top: "#e8433f", legs: "#f7c9a0", hair: "#2b1b12", dress: true },
    boy: { top: "#2f8fe0", legs: "#2f4a8a", hair: "#3a2416", dress: false },
    mom: { top: "#c2408a", legs: "#f7c9a0", hair: "#2b1b12", dress: true },
    dad: { top: "#2f6f5a", legs: "#33405e", hair: "#2b1b12", dress: false },
    teen: { top: "#f59f00", legs: "#2f4a8a", hair: "#4a2c16", dress: false },
    pupilB: { top: "#ff7a1a", legs: "#2b2f3a", hair: "#2b1b12", dress: false },
    pupilG: { top: "#ff7a1a", legs: "#f7c9a0", hair: "#2b1b12", dress: true },
  }[kind];
  const big = kind === "mom" || kind === "dad";
  let hair = "", hat = "";
  if (kind === "girl" || kind === "pupilG") {
    // Севиль: короткое каштановое каре
    hair = `<path d="M-15 -10 Q-17 -34 0 -34 Q17 -34 15 -10 L15 0 Q11 -2 9 -12 Q0 -19 -9 -12 Q-11 -2 -15 0Z" fill="#6b4630" ${S(1.8)}/>`;
    if (kind === "girl") hat = `<path d="M-14 -21 Q-13 -39 0 -39 Q13 -39 14 -21Z" fill="#ffe066" ${S(2)}/><path d="M-14 -21 Q4 -17 20 -21 Q12 -26 0 -24Z" fill="#f5c933" ${S(1.8)}/><path d="M-3 -33 l-5 -3 l1 6Z M-3 -33 l5 -3 l-1 6Z" fill="#fff3a0" ${S(1.2)}/>`;
  } else if (kind === "mom") {
    hair = `<path d="M-14 -14 Q-14 -32 0 -32 Q14 -32 14 -14 Q8 -24 0 -24 Q-8 -24 -14 -14Z" fill="${cfg.hair}" ${S(1.8)}/>
      <path d="M-14 -14 Q-20 -2 -15 8" fill="none" stroke="${cfg.hair}" stroke-width="6" stroke-linecap="round"/><path d="M14 -14 Q20 -2 15 8" fill="none" stroke="${cfg.hair}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-15" cy="8" r="3.6" fill="#ffd23f"/><circle cx="15" cy="8" r="3.6" fill="#ffd23f"/>`;
  } else {
    hair = `<path d="M-14 -14 Q-15 -32 0 -32 Q15 -32 14 -14 Q6 -22 -2 -20 Q-9 -20 -14 -14Z" fill="${cfg.hair}" ${S(1.8)}/>`;
  }
  if (kind === "dad" || kind === "boy") {
    hat = `<path d="M-13 -22 Q-11 -44 0 -46 Q11 -44 13 -22 Z" fill="#fff" ${S(2)}/><rect x="-14" y="-25" width="28" height="6" rx="3" fill="#1d1d1d" ${S(1.4)}/>`;
    hair = "";
  }
  if (kind === "mom") hat = `<path d="M-14 -22 Q0 -38 14 -22 Q0 -28 -14 -22Z" fill="#ffd23f" ${S(1.6)}/>`;
  // Севиль в белой футболке «Баластан» и юбке-русалке
  const teeSkirt = `<path d="M-10 2 Q0 -1 10 2 L12 15 L-12 15Z" fill="#fff" ${S(2)}/><circle cx="0" cy="9" r="3" fill="#ff7a1a"/>
    <path d="M-13 14 L13 14 L17 30 Q0 35 -17 30Z" fill="#b98cff" ${S(2)}/><path d="M-9 20 Q0 24 9 20 M-11 26 Q0 30 11 26" fill="none" stroke="#7fe0f5" stroke-width="2.2" stroke-linecap="round"/>`;
  const body = cfg.dress
    ? `<path d="M-14 28 L-9 4 Q0 0 9 4 L14 28 Q0 33 -14 28Z" fill="${cfg.top}" ${S(2)}/><path d="M-12 22 Q0 27 12 22" fill="none" stroke="#fff3d6" stroke-width="3" stroke-dasharray="2 4" stroke-linecap="round"/>`
    : `<rect x="-10" y="2" width="20" height="27" rx="8" fill="${cfg.top}" ${S(2)}/>`;
  return `<g transform="translate(${x},${y}) scale(${(big ? 1.3 : 1) * s})" ${dataShow ? `data-show="${dataShow}"` : ""}>
  <g transform="translate(0,-43)"><g class="${cls}" style="animation-delay:${delay}s">
    <rect x="-8" y="26" width="6" height="15" rx="3" fill="${cfg.legs}" ${S(1.8)}/><rect x="2" y="26" width="6" height="15" rx="3" fill="${cfg.legs}" ${S(1.8)}/>
    <ellipse cx="-5" cy="42" rx="6.5" ry="3.6" fill="#3a2a22"/><ellipse cx="5" cy="42" rx="6.5" ry="3.6" fill="#3a2a22"/>
    ${kind === "girl" ? teeSkirt : body}
    <path class="armL" d="M-10 8 Q-19 14 -16 22" fill="none" stroke="${skin}" stroke-width="5" stroke-linecap="round"/><path class="armR" d="M10 8 Q19 14 16 22" fill="none" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-12" r="14" fill="${skin}" ${S(2)}/>
    ${hair}${hat}
    <circle cx="-5" cy="-12" r="1.9" fill="${INK}"/><circle cx="5" cy="-12" r="1.9" fill="${INK}"/>
    <ellipse cx="-9" cy="-7" rx="3" ry="2" fill="#ff9a8a" opacity=".75"/><ellipse cx="9" cy="-7" rx="3" ry="2" fill="#ff9a8a" opacity=".75"/>
    <path d="M-4 -6 Q0 -2 4 -6" fill="none" ${S(1.6)}/>
  </g></g></g>`;
};

// ---------- флаг Кыргызстана ----------
A.flag = (x, y, s = 1) => {
  let rays = "";
  for (let i = 0; i < 40; i++) {
    const a = (i * 9 * Math.PI) / 180;
    rays += `<line x1="${(Math.cos(a) * 13.5).toFixed(2)}" y1="${(Math.sin(a) * 13.5).toFixed(2)}" x2="${(Math.cos(a) * 19.5).toFixed(2)}" y2="${(Math.sin(a) * 19.5).toFixed(2)}"/>`;
  }
  const arcs = `<path d="M-8 -4 Q0 -9 8 -4 M-8.5 0 Q0 -5 8.5 0 M-8 4 Q0 -1 8 4" fill="none"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
  <rect x="-2.5" y="-120" width="5" height="120" rx="2.5" fill="#c9a15a" ${S(1.6)}/><circle cx="0" cy="-122" r="5" fill="#ffd23f" ${S(1.6)}/>
  <g transform="translate(2,-114)"><g class="flagw">
    <path fill="#e8112d" ${S(2)} d="M0 0 C25 -8 50 8 100 -2 L100 64 C50 74 25 56 0 66 Z">
      <animate attributeName="d" dur="2.2s" repeatCount="indefinite" values="M0 0 C25 -8 50 8 100 -2 L100 64 C50 74 25 56 0 66 Z;M0 0 C25 8 50 -8 100 2 L100 66 C50 56 25 74 0 64 Z;M0 0 C25 -8 50 8 100 -2 L100 64 C50 74 25 56 0 66 Z"/>
    </path>
    <g transform="translate(50,33)">
      <g stroke="#ffd23f" stroke-width="1.5" stroke-linecap="round">${rays}</g>
      <circle r="12.5" fill="#ffd23f"/><circle r="9.5" fill="none" stroke="#e8112d" stroke-width="1.3"/>
      <g stroke="#e8112d" stroke-width="1.1">${arcs}<g transform="rotate(90)">${arcs}</g></g>
    </g>
  </g></g></g>`;
};

// ---------- горы ----------
const snow = (px, py, w = 18) =>
  `<path d="M${px} ${py} L${px - w} ${py + w * 1.6} L${px - w * .5} ${py + w * 1.3} L${px} ${py + w * 1.8} L${px + w * .5} ${py + w * 1.3} L${px + w} ${py + w * 1.6}Z" fill="#fff" stroke="#c9dcf7" stroke-width="1.5" stroke-linejoin="round"/>`;
A.mountains = (dy = 0) => `<g transform="translate(0,${dy})">
  <path d="M-10 440 L-10 360 L45 300 L80 335 L130 270 L190 345 L235 300 L285 350 L330 285 L410 360 L410 440Z" fill="#a4bff4" stroke="#6f8fd6" stroke-width="2.5" stroke-linejoin="round"/>
  ${snow(45, 300, 16)}${snow(130, 270, 20)}${snow(235, 300, 17)}${snow(330, 285, 19)}
  <path d="M-10 440 L-10 395 L70 335 L110 370 L170 310 L240 390 L290 350 L350 330 L410 385 L410 440Z" fill="#7f9fec" stroke="#4f6fc2" stroke-width="2.5" stroke-linejoin="round"/>
  ${snow(70, 335, 17)}${snow(170, 310, 21)}${snow(350, 330, 17)}
</g>`;

A.lake = (cx, cy, rx, ry) => `<g>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#lake)" ${S(2.5)}/>
  <g class="shimmer" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"><path d="M${cx - 60} ${cy - 3} h26"/><path d="M${cx + 20} ${cy + 5} h34"/><path d="M${cx - 20} ${cy + 10} h18"/><path d="M${cx + 70} ${cy - 6} h20"/></g>
</g>`;

// ---------- юрта ----------
A.yurt = (x, y, s = 1, smoke = true) => `
<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="4" rx="112" ry="10" fill="rgba(60,40,10,.18)"/>
  <path d="M-92 0 L-92 -58 Q0 -66 92 -58 L92 0 Q0 8 -92 0Z" fill="url(#lat)" ${S()}/>
  <path d="M-100 -56 C-96 -100 -46 -128 0 -130 C46 -128 96 -100 100 -56 Q0 -48 -100 -56Z" fill="#fffaf0" ${S()}/>
  <g fill="none" stroke="#c9a06b" stroke-width="2.2" stroke-linecap="round"><path d="M0 -128 L-70 -62"/><path d="M0 -128 L-36 -58"/><path d="M0 -128 L0 -56"/><path d="M0 -128 L36 -58"/><path d="M0 -128 L70 -62"/></g>
  <path d="M-97 -70 Q0 -60 97 -70" fill="none" stroke="#c78b4a" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M-98 -57 Q0 -49 98 -57 L98 -43 Q0 -35 -98 -43Z" fill="url(#orn)" ${S(2)}/>
  <path d="M-92 -22 Q0 -14 92 -22 L92 -14 Q0 -6 -92 -14Z" fill="url(#orn2)" ${S(1.8)}/>
  <path d="M-19 2 V-38 Q0 -54 19 -38 V2Z" fill="#c07b3d" ${S()}/><path d="M0 -48 V2" stroke="${INK}" stroke-width="2"/>
  <circle cx="-7" cy="-18" r="2.2" fill="#ffd23f"/><circle cx="7" cy="-18" r="2.2" fill="#ffd23f"/>
  <path d="M-13 -30 q6 -6 12 0 M1 -30 q6 -6 12 0" fill="none" stroke="#7a4a2a" stroke-width="2"/>
  <ellipse cx="0" cy="-130" rx="24" ry="7.5" fill="#8a5630" ${S(2)}/><path d="M-18 -130 Q0 -138 18 -130 M-18 -130 Q0 -122 18 -130 M0 -136 V-124" fill="none" stroke="#f0c98f" stroke-width="2"/>
  ${smoke ? `<g class="smoke"><circle cx="0" cy="-140" r="9"/><circle cx="0" cy="-140" r="9" style="animation-delay:1.4s"/><circle cx="0" cy="-140" r="9" style="animation-delay:2.8s"/></g>` : ""}
</g>`;

// ---------- школа ----------
A.school = (x, y, s = 1, flagOn = true) => {
  const win = (wx, wy) => `<g transform="translate(${wx},${wy})"><rect x="-15" y="-16" width="30" height="32" rx="4" fill="#9fdcff" ${S(2.2)}/><path d="M0 -16 V16 M-15 0 H15" stroke="${INK}" stroke-width="2"/><path d="M-11 -12 L-3 -12 L-11 -4Z" fill="#fff" opacity=".7"/><rect x="-18" y="16" width="36" height="5" rx="2" fill="#e8433f" ${S(1.6)}/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="4" rx="125" ry="10" fill="rgba(60,40,10,.18)"/>
  <rect x="-108" y="-100" width="216" height="100" rx="6" fill="#f6efe2" ${S()}/>
  <path d="M-116 -98 L-100 -126 H100 L116 -98Z" fill="#e8590c" ${S()}/>
  <rect x="-108" y="-14" width="216" height="14" fill="url(#orn)" ${S(2)}/>
  ${win(-78, -66)}${win(-42, -66)}${win(42, -66)}${win(78, -66)}
  <rect x="-34" y="-150" width="68" height="150" rx="6" fill="#ffe8bd" ${S()}/>
  <path d="M-42 -148 L0 -184 L42 -148Z" fill="#e8590c" ${S()}/>
  <circle cx="0" cy="-128" r="14" fill="#fff" ${S(2.2)}/><path d="M0 -128 V-137 M0 -128 L7 -125" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="-37" y="-108" width="74" height="26" rx="6" fill="#2b6fd6" ${S(2)}/>
  <circle cx="-8" cy="-101" r="3.2" fill="#9b5de5"/><circle cx="0" cy="-103" r="3.2" fill="#3dbb4f"/><circle cx="8" cy="-101" r="3.2" fill="#ff9a1a"/>
  <text x="0" y="-87" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="12" fill="#fff" letter-spacing=".3">БАЛАСТАН</text>
  <path d="M-17 0 V-34 Q0 -50 17 -34 V0Z" fill="#c07b3d" ${S()}/><path d="M0 -44 V0" stroke="${INK}" stroke-width="2"/>
  <rect x="-24" y="-3" width="48" height="6" rx="2" fill="#e8d3a8" ${S(1.6)}/>
  ${flagOn ? `<g transform="translate(0,-184) scale(.32)"><g transform="translate(0,0)">${A.flag(0, 0, 1)}</g></g>` : ""}
</g>`;
};

// ---------- автобус ----------
A.bus = (x, y, s = 1, moving = false) => `
<g transform="translate(${x},${y}) scale(${s})"><g ${moving ? 'class="busgo"' : ""}>
  <ellipse cx="0" cy="4" rx="78" ry="7" fill="rgba(60,40,10,.2)"/>
  <rect x="-76" y="-62" width="152" height="58" rx="14" fill="#ffc21a" ${S()}/>
  <rect x="-70" y="-26" width="140" height="8" fill="#e8433f"/>
  <g fill="#aee3ff" ${S(2)}><rect x="-66" y="-54" width="24" height="22" rx="5"/><rect x="-36" y="-54" width="24" height="22" rx="5"/><rect x="-6" y="-54" width="24" height="22" rx="5"/><rect x="24" y="-54" width="24" height="22" rx="5"/></g>
  <g><circle cx="-54" cy="-43" r="5" fill="#f7c9a0" ${S(1.4)}/><circle cx="-24" cy="-43" r="5" fill="#f7c9a0" ${S(1.4)}/><circle cx="6" cy="-43" r="5" fill="#f7c9a0" ${S(1.4)}/></g>
  <path d="M52 -54 h14 a6 6 0 0 1 6 6 v18 h-20Z" fill="#aee3ff" ${S(2)}/>
  <circle cx="72" cy="-14" r="4" fill="#fff6a8" ${S(1.4)}/>
  <g transform="translate(-44,0)"><circle r="12" fill="#3a3a44" ${S(2)}/><g class="wheel"><circle r="5.5" fill="#cfd3dc"/><path d="M-5 0 H5 M0 -5 V5" stroke="#3a3a44" stroke-width="2"/></g></g>
  <g transform="translate(44,0)"><circle r="12" fill="#3a3a44" ${S(2)}/><g class="wheel"><circle r="5.5" fill="#cfd3dc"/><path d="M-5 0 H5 M0 -5 V5" stroke="#3a3a44" stroke-width="2"/></g></g>
  <text x="0" y="-12" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="10" fill="#fff" stroke="#c0392b" stroke-width=".4">ШКОЛА</text>
</g></g>`;

// ---------- дастархан ----------
A.table = (x, y, s = 1) => `
<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="0" rx="92" ry="22" fill="#d9372f" ${S()}/><ellipse cx="0" cy="0" rx="78" ry="16" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 6"/>
  <g ${S(2)}><ellipse cx="-38" cy="-6" rx="17" ry="7" fill="#f2c27a"/><ellipse cx="-38" cy="-9" rx="17" ry="6" fill="#f8d799"/><ellipse cx="38" cy="-4" rx="17" ry="7" fill="#f2c27a"/><ellipse cx="38" cy="-7" rx="17" ry="6" fill="#f8d799"/></g>
  <g ${S(2)}><ellipse cx="-2" cy="2" rx="11" ry="4" fill="#fff"/><path d="M-11 2 Q-11 -8 -2 -8 Q9 -8 9 2Z" fill="#fff"/></g>
  <g transform="translate(0,-18)"><path d="M-12 0 Q-14 -18 0 -18 Q14 -18 12 0Z" fill="#3aa0e8" ${S(2)}/><path d="M12 -8 q12 -2 10 -12" fill="none" ${S(2.4)}/><path d="M-3 -18 h6" ${S(3)}/></g>
  <g class="steam" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"><path d="M-3 -40 q-6 -8 0 -14 q6 -6 0 -14"/><path d="M5 -38 q-6 -8 0 -14 q6 -6 0 -14" style="animation-delay:.8s"/></g>
</g>`;

// ---------- общий фон для историй ----------
A.land = (warm = false) => `
<rect x="-50" y="-100" width="500" height="620" fill="url(#${warm ? "skyWarm" : "sky"})"/>
${A.sun(330, 100, 32)}
${A.cloud(80, 120, 1, 36)}${A.cloud(250, 190, 0.8, 48, -10)}${A.cloud(60, 250, 0.7, 52, -20)}`;

A.ground = () => `
<path d="M-50 470 Q80 430 200 465 T450 450 V900 H-50Z" fill="url(#grass)" ${S(2.5)}/>
<path d="M-50 520 Q100 490 230 520 T450 505 V900 H-50Z" fill="url(#grass2)" ${S(2.5)}/>`;

// ===================== МИР =====================
A.world = () => `
<svg id="worldSvg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Мультяшный мир: школа, юрта и горы с флагом">
  <g id="wcam">
  <rect x="-50" y="-100" width="500" height="650" fill="url(#sky)"/>
  ${A.sun(338, 205, 26)}
  ${A.cloud(70, 150, 1, 38)}${A.cloud(220, 100, 0.8, 50, -12)}${A.cloud(330, 230, 0.7, 44, -6)}
  ${A.mountains(30)}
  ${A.flag(176, 345, 0.95)}
  <g>${A.eagle(78, 335, 0.5)}</g>
  <path d="M-50 505 Q90 470 210 500 T450 490 V900 H-50Z" fill="url(#grass2)" ${S(2.5)}/>
  ${A.lake(205, 505, 150, 14)}
  <path d="M-50 560 Q100 520 230 555 T450 540 V900 H-50Z" fill="url(#grass)" ${S(2.5)}/>
  <path d="M170 900 Q210 760 200 640 Q196 600 215 575 L226 580 Q210 610 220 650 Q244 770 270 900Z" fill="#f0d49b" ${S(2)}/>
  ${A.tree(24, 640, 0.9)}${A.tree(380, 612, 0.8)}
  ${A.school(100, 662, 0.82)}
  ${A.yurt(305, 668, 0.9)}
  <g transform="translate(0,0)"><g class="roadbus">${A.bus(0, 742, 0.42, true)}</g></g>
  ${A.flower(40, 770, "#ff5d73", 0)}${A.flower(70, 790, "#ffd23f", .4)}${A.flower(330, 776, "#ff8fd0", .8)}${A.flower(362, 792, "#fff", 1.1)}${A.flower(150, 788, "#ff9f1c", .5)}${A.flower(258, 790, "#c77dff", .2)}
  ${A.kid({ x: 160, y: 712, s: 0.62, kind: "pupilG", cls: "hop" })}
  ${A.kid({ x: 248, y: 716, s: 0.56, kind: "pupilB", cls: "hop", delay: .3 })}
  </g>
</svg>`;

// ===================== ИСТОРИЯ: ШКОЛА =====================
A.sceneSchool = () => `
<svg class="stage" viewBox="0 0 400 800" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><g class="cam">
  ${A.land()}
  ${A.mountains(60)}
  ${A.ground()}
  ${A.tree(38, 500, 1.15)}${A.tree(372, 492, 1.0)}
  ${A.school(200, 500, 1.28)}
  <g data-show="2" style="transform:translate(120px,520px)"><g class="busIn">${A.bus(0, 0, 0.95, true)}</g></g>
  <g data-show="3">
    <g class="float" style="animation-delay:0s"><text x="70" y="250" font-size="34" font-weight="900" fill="#e8433f" font-family="Nunito, system-ui">А</text></g>
    <g class="float" style="animation-delay:.6s"><text x="320" y="230" font-size="34" font-weight="900" fill="#2b93e6" font-family="Nunito, system-ui">2+3</text></g>
    <g class="float" style="animation-delay:1.1s"><text x="40" y="330" font-size="28" font-weight="900" fill="#26a69a" font-family="Nunito, system-ui">ABC</text></g>
    <g class="float" style="animation-delay:1.6s"><text x="330" y="320" font-size="30" font-weight="900" fill="#f59f00" font-family="Nunito, system-ui">π</text></g>
    <g class="float" style="animation-delay:.3s" transform="translate(300,360)"><rect x="-22" y="-16" width="44" height="30" rx="4" fill="#dfe6f2" ${S(2)}/><rect x="-18" y="-12" width="36" height="22" rx="2" fill="#2b4a7a"/><path d="M-10 -4 l6 4 l-6 4 M0 6 h10" stroke="#7dffa1" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-28 16 H28 L24 22 H-24Z" fill="#c4cbd9" ${S(1.6)}/></g>
  </g>
  <g data-show="4">${A.kid({ x: 230, y: 530, s: 1.0, kind: "pupilB", cls: "hop" })}${A.kid({ x: 285, y: 534, s: 1.0, kind: "pupilG", cls: "hop", delay: .25 })}${A.kid({ x: 340, y: 530, s: 0.95, kind: "pupilB", cls: "hop", delay: .5 })}
    <g transform="translate(262,486)"><circle r="10" fill="#ff5d73" ${S(2)}><animate attributeName="cy" values="0;-34;0" dur="1.2s" repeatCount="indefinite"/></circle></g></g>
  ${A.kid({ x: 150, y: 540, s: 1.05, kind: "pupilG", cls: "hop", delay: .1 })}
  <g data-show="5">${A.heart(110, 330, 0)}${A.heart(300, 310, .5)}${A.heart(200, 270, 1)}${A.heart(60, 280, 1.4)}${A.heart(340, 380, 1.8)}${A.sparkle(150, 240, .2, 1.2)}${A.sparkle(260, 250, .7, 1)}</g>
  ${A.flower(30, 560, "#ff5d73")}${A.flower(100, 580, "#ffd23f", .4)}${A.flower(370, 566, "#ff8fd0", .8)}
</g></svg>`;

// ===================== ИСТОРИЯ: СЕМЬЯ =====================
A.sceneFamily = () => `
<svg class="stage" viewBox="0 0 400 800" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><g class="cam">
  ${A.land(true)}
  ${A.mountains(70)}
  ${A.ground()}
  ${A.tree(36, 505, 1.1)}${A.tree(378, 498, 0.95)}
  ${A.yurt(200, 478, 1.55)}
  <g data-show="3" class="pop">${A.table(200, 540, 1.1)}</g>
  <g data-show="1,2,3,4,5" class="pop">${A.kid({ x: 82, y: 520, s: 1.05, kind: "dad", cls: "hop" })}</g>
  <g data-show="1,2,3,4,5" class="pop" style="animation-delay:.3s">${A.kid({ x: 318, y: 520, s: 1.05, kind: "mom", cls: "hop", delay: .2 })}</g>
  <g data-show="1,2,3,4,5" class="pop" style="animation-delay:.6s">${A.kid({ x: 200, y: 530, s: 1.15, kind: "girl", cls: "hop", delay: .4 })}</g>
  <g data-show="2,5">${A.heart(110, 380, 0)}${A.heart(290, 380, .6)}${A.heart(200, 350, 1.2)}${A.heart(60, 430, 1.8, "#ff8fa3", .8)}${A.heart(340, 430, 2.2, "#ff8fa3", .8)}</g>
  <g data-show="4">${A.sparkle(165, 195, 0, 1.3)}${A.sparkle(235, 190, .5, 1.1)}${A.sparkle(200, 170, 1, 1.4)}${A.sparkle(130, 230, 1.4, 1)}${A.sparkle(272, 228, .9, 1)}</g>
  ${A.flower(30, 575, "#ff5d73")}${A.flower(112, 590, "#ffd23f", .4)}${A.flower(290, 588, "#ff8fd0", .8)}${A.flower(372, 570, "#fff", 1.1)}
</g></svg>`;

// ===================== ИСТОРИЯ: РОДИНА =====================
A.sceneLand = () => `
<svg class="stage" viewBox="0 0 400 800" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><g class="cam">
  ${A.land()}
  ${A.mountains(0)}
  ${A.eagle(300, 230, 0.8)}
  <g data-show="2">${A.eagle(120, 200, 0.6)}</g>
  <path d="M-50 470 Q80 440 200 468 T450 456 V900 H-50Z" fill="url(#grass2)" ${S(2.5)}/>
  ${A.lake(200, 472, 190, 20)}
  <g data-show="3"><g transform="translate(275,470)"><g class="boat"><path d="M-22 0 H22 L16 10 H-16Z" fill="#e8433f" ${S(2)}/><path d="M0 0 V-30 L18 -6Z" fill="#fff" ${S(2)}/></g></g>${A.sparkle(215, 462, 0, 1.2)}${A.sparkle(330, 478, .6, 1)}${A.sparkle(235, 484, 1.1, 1)}</g>
  <path d="M-50 520 Q100 490 230 520 T450 505 V900 H-50Z" fill="url(#grass)" ${S(2.5)}/>
  ${A.yurt(318, 556, 0.5)}${A.yurt(262, 572, 0.38)}
  ${A.flag(70, 560, 1.15)}
  ${A.tree(372, 540, 0.8)}
  <g data-show="5">${A.heart(110, 330, 0)}${A.heart(300, 310, .5)}${A.heart(200, 270, 1)}${A.heart(60, 400, 1.4)}${A.heart(340, 400, 1.8)}${A.sparkle(150, 240, .2, 1.2)}${A.sparkle(260, 250, .7, 1)}</g>
  ${A.kid({ x: 200, y: 560, s: 1.0, kind: "girl", cls: "hop" })}
  ${A.flower(30, 585, "#ff5d73")}${A.flower(130, 598, "#ffd23f", .4)}${A.flower(270, 600, "#ff8fd0", .8)}${A.flower(366, 586, "#fff", 1.1)}
</g></svg>`;
