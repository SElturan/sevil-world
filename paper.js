// Рисунки в стиле «объёмной книги»: слои из бумаги и войлока. Всё рисуется один раз, двигаются только отдельные слои.
const EXTRA_DEFS = `<defs>
  <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4766d1"/><stop offset=".4" stop-color="#b27bc9"/><stop offset=".62" stop-color="#ff9d7a"/><stop offset=".82" stop-color="#ffd89a"/><stop offset="1" stop-color="#fff0c9"/></linearGradient>
  <linearGradient id="morning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8fe8"/><stop offset=".55" stop-color="#7fd0ff"/><stop offset="1" stop-color="#eafaff"/></linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf1da"/><stop offset="1" stop-color="#f0d3a4"/></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9824a"/><stop offset="1" stop-color="#7d4f26"/></linearGradient>
  <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5429"/><stop offset=".5" stop-color="#b5763b"/><stop offset="1" stop-color="#8a5429"/></linearGradient>
  <radialGradient id="sunGlow"><stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".25" stop-color="#ffe27a" stop-opacity=".9"/><stop offset=".6" stop-color="#ffb347" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
  <linearGradient id="warmTint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a4c" stop-opacity="0"/><stop offset="1" stop-color="#ff7a3a" stop-opacity=".38"/></linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
  <linearGradient id="felt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f7a75"/><stop offset="1" stop-color="#14524f"/></linearGradient>
</defs>`;

const L = (html, view = "0 0 400 800", par = "xMidYMid slice") => `<svg viewBox="${view}" preserveAspectRatio="${par}" aria-hidden="true">${html}</svg>`;
const PAPER = {};
const rnd = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const shift = (f, dy) => (...a) => f(...a).replace('aria-hidden="true">', `aria-hidden="true"><g transform="translate(0,${dy})">`).replace(/<\/svg>\s*$/, "</g></svg>");

// ---------- небо ----------
PAPER.sunset = (sy = 470) => L(`<rect x="-60" y="-100" width="520" height="1000" fill="url(#dusk)"/><circle cx="200" cy="${sy}" r="190" fill="url(#sunGlow)"/><circle cx="200" cy="${sy}" r="52" fill="#fff6c8"/>`);
PAPER.morning = () => L(`<rect x="-60" y="-100" width="520" height="1000" fill="url(#morning)"/><circle cx="320" cy="170" r="150" fill="url(#sunGlow)"/><circle cx="320" cy="170" r="34" fill="#fff6c8"/>`);
PAPER.clouds = () => L(`<g opacity=".93">${A.cloud(70, 190, 1.5, 1)}${A.cloud(300, 120, 1.1, 1)}${A.cloud(210, 300, .9, 1)}</g>`.replace(/class="drift"/g, ""));

// ---------- семейное древо с медальонами ----------
const GREENS = ["#1f7a47", "#2f9e5b", "#3fb36b", "#58c87a", "#7ad88a"];
const MED = { // положения медальонов в рисунке 400×800
  grandma: [100, 214], mom: [166, 172], dad: [236, 172], grandpa: [302, 214], brother: [112, 316], sister: [290, 316],
};
const MEDKIND = ["granny", "mom", "dad", "grandpa", "brother", "sister"];
const MEDPOS = [MED.grandma, MED.mom, MED.dad, MED.grandpa, MED.brother, MED.sister];
PAPER.treeArt = () => {
  const r = rnd(7); let leaves = "";
  for (let i = 0; i < 300; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()), x = 200 + Math.cos(a) * d * 182, y = 262 + Math.sin(a) * d * 156, sc = 1.0 + r() * 1.0, rot = r() * 360, col = GREENS[(r() * 5) | 0];
    leaves += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${sc.toFixed(2)})"><path d="M0 0 Q9 -13 0 -30 Q-9 -13 0 0Z" fill="${col}" stroke="#17603a" stroke-width="1.2"/><path d="M0 -2 V-24" stroke="#17603a" stroke-width=".8" opacity=".6"/></g>`;
  }
  const branches = MEDPOS.map(([x, y]) => `<path d="M200 440 Q${(200 + x) / 2} ${(440 + y) / 2 + 24} ${x} ${y}" fill="none" stroke="#7c4a22" stroke-width="9" stroke-linecap="round"/>`).join("");
  const meds = MEDPOS.map(([x, y], i) => {
    const k = MEDKIND[i], role = CONTENT.people.find((p) => p.role === ["Бабушка", "Мама", "Папа", "Дедушка", "Брат", "Сестра"][i]);
    const nm = role && role.name ? role.name : ["Бабушка", "Мама", "Папа", "Дедушка", "Брат", "Сестра"][i];
    return `<g transform="translate(${x},${y})"><circle r="34" fill="#c9ccd8" stroke="#6a6f86" stroke-width="3"/><circle r="29" fill="#ffe6bd" stroke="#8c6a3c" stroke-width="2"/>
      <clipPath id="mc${i}"><circle r="28"/></clipPath><g clip-path="url(#mc${i})"><g transform="translate(0,${(76 * 0.62 + 6).toFixed(0)}) scale(.62)">${PERSON.face(k)}</g></g>
      <g transform="translate(0,40)"><rect x="-30" y="-9" width="60" height="17" rx="8" fill="#fff3d9" stroke="#8c6a3c" stroke-width="2"/><text y="4" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="10.5" fill="#4a2f22">${nm}</text></g></g>`;
  }).join("");
  const sevil = `<g transform="translate(200,262)"><circle r="48" fill="#ffd23f" stroke="#b7791f" stroke-width="4"/><circle r="43" fill="#fff" stroke="#b7791f" stroke-width="2"/>
    <clipPath id="mcS"><circle r="39"/></clipPath><image href="img/sevil-face.jpg" x="-39" y="-39" width="78" height="78" preserveAspectRatio="xMidYMid slice" clip-path="url(#mcS)"/>
    <g transform="translate(0,52)"><rect x="-34" y="-10" width="68" height="19" rx="9" fill="#ff5d3b" stroke="#fff" stroke-width="2"/><text y="4" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="12" fill="#fff">${CONTENT.name}</text></g></g>`;
  const ribbon = ["#e8433f", "#ffb81c", "#3dbb4f", "#2b93e6", "#9b5de5"].map((c, i) => `<path d="M${172 + i * 0.4} ${470 + i * 8} Q200 ${478 + i * 8} ${228 - i * 0.4} ${470 + i * 8} L${228 - i * 0.4} ${478 + i * 8} Q200 ${486 + i * 8} ${172 + i * 0.4} ${478 + i * 8}Z" fill="${c}"/>`).join("");
  return `<g>
    <path d="M166 596 Q176 520 184 440 L216 440 Q224 520 234 596Z" fill="url(#trunk)" stroke="#6b3f1b" stroke-width="3"/>
    <path d="M180 560 Q184 500 190 450 M214 560 Q216 500 208 450" fill="none" stroke="#6b3f1b" stroke-width="2" opacity=".5"/>
    ${ribbon}
    <path d="M166 596 Q130 620 96 606 M234 596 Q270 620 304 606 M184 600 Q178 624 150 630 M216 600 Q222 624 250 630" fill="none" stroke="#7c4a22" stroke-width="8" stroke-linecap="round"/>
    ${leaves}${branches}${meds}${sevil}</g>`;
};

// ---------- коробочки-диорамы (школа и Родина) ----------
const boxFrame = (x, y, w, h, label) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="#b9824a" stroke-width="8"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="11" fill="none" stroke="#8a5a2c" stroke-width="2" opacity=".7"/>
  <g transform="translate(${x + w / 2},${y + h - 2})"><rect x="-38" y="-13" width="76" height="22" rx="6" fill="#fff3d9" stroke="#8a5a2c" stroke-width="2.4"/><text y="3" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="13" fill="#4a2f22">${label}</text></g>`;
PAPER.boxSchool = () => `<g><clipPath id="bs"><rect x="14" y="632" width="176" height="142" rx="11"/></clipPath><g clip-path="url(#bs)">
  <rect x="14" y="632" width="176" height="142" fill="url(#morning)"/><circle cx="160" cy="662" r="13" fill="#ffe27a"/>
  <path d="M14 744 Q80 730 190 742 V776 H14Z" fill="#58c878" stroke="#2f8f4e" stroke-width="1.5"/>
  <g transform="translate(104,752) scale(.55)">${A.school(0, 0, 1, false)}</g>
  ${PERSON.make("sevil", { x: 58, y: 764, s: .42 })}${PERSON.make("pupilB", { x: 150, y: 766, s: .38 })}${PERSON.make("pupilG", { x: 176, y: 768, s: .36 })}</g>${boxFrame(10, 628, 184, 150, "ШКОЛА")}</g>`;
PAPER.boxLand = () => `<g><clipPath id="bl"><rect x="210" y="632" width="176" height="142" rx="11"/></clipPath><g clip-path="url(#bl)">
  <rect x="210" y="632" width="176" height="142" fill="url(#morning)"/><circle cx="360" cy="660" r="12" fill="#ffe27a"/>
  <g transform="translate(206,524) scale(.5)">${A.mountains(0)}</g>
  <ellipse cx="300" cy="748" rx="64" ry="10" fill="#4cc9f0" stroke="#2b93e6" stroke-width="1.5"/>
  <path d="M210 750 Q290 734 386 746 V776 H210Z" fill="#58c878" stroke="#2f8f4e" stroke-width="1.5"/>
  <g transform="translate(350,766) scale(.3)">${A.yurt(0, 0, 1, false)}</g><g transform="translate(318,772) scale(.2)">${A.yurt(0, 0, 1, false)}</g></g>${boxFrame(206, 628, 184, 150, "РОДИНА")}</g>`;
PAPER.banner = () => `<g transform="translate(0,-24)"><path d="M30 578 Q200 560 370 578 L358 606 L372 634 Q200 618 28 634 L42 606Z" fill="#fff3d9" stroke="#8a5a2c" stroke-width="3" stroke-linejoin="round"/>
  <path d="M30 578 L14 584 L26 606 L14 628 L28 634Z M370 578 L386 584 L374 606 L386 628 L372 634Z" fill="#e6c88e" stroke="#8a5a2c" stroke-width="2.4" stroke-linejoin="round"/>
  <text x="200" y="601" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="18" fill="#4a2f22">МОЙ БОЛЬШОЙ МИР</text>
  <text x="200" y="620" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="800" font-size="12" fill="#8a5a2c" letter-spacing="1.5">СЕМЬЯ · ШКОЛА · РОДИНА</text></g>`;
PAPER.wall = () => L(`<rect x="-60" y="-60" width="520" height="940" fill="url(#paper)"/>
  <rect x="0" y="0" width="400" height="22" fill="url(#orn)"/><rect x="0" y="22" width="400" height="4" fill="#8e2f3a"/>
  <g transform="translate(14,50)"><rect width="66" height="150" rx="4" fill="#8e2f3a" stroke="#5a1d25" stroke-width="3"/><rect x="6" y="6" width="54" height="138" fill="url(#orn2)" opacity=".9"/><rect x="20" y="40" width="26" height="70" fill="#ffd23f" opacity=".9"/></g>
  <g transform="translate(320,50)"><rect width="66" height="150" rx="4" fill="#2a6fd6" stroke="#173f85" stroke-width="3"/><rect x="6" y="6" width="54" height="138" fill="url(#orn)" opacity=".9"/><rect x="20" y="40" width="26" height="70" fill="#fff3d9" opacity=".9"/></g>
  <rect x="-10" y="772" width="420" height="40" fill="url(#wood)"/><path d="M-10 778 H410" stroke="#5e3a1a" stroke-width="2"/>`);
PAPER.tree = () => L(PAPER.treeArt());
PAPER.boxes = () => L(PAPER.boxSchool() + PAPER.boxLand() + PAPER.banner());
// движущиеся мелочи диорамы
PAPER.hubFx = () => L(`<g transform="translate(75,716) scale(.42)">${A.flag(0, 0, 1)}</g>
  <g transform="translate(352,690)"><g class="glide">${A.eagle(0, 0, .26)}</g></g>
  ${A.smoke(350, 766, .3)}
  <g transform="translate(66,684)"><g class="flagS">${A.flag(0, 0, .18)}</g></g>
  ${A.sparkle(60, 120, 0, 1.2)}${A.sparkle(340, 150, .7, 1)}${A.sparkle(200, 60, 1.3, 1.1)}`);

// ---------- панорама Родины 1000×800 ----------
const PV = "0 0 1000 800";
PAPER.panoSky = () => L(`<rect x="0" y="-100" width="1000" height="1000" fill="url(#morning)"/><circle cx="830" cy="190" r="200" fill="url(#sunGlow)"/><circle cx="830" cy="190" r="40" fill="#fff6c8"/>`, PV, "xMidYMid slice");
PAPER.panoClouds = () => L(`<g opacity=".95">${A.cloud(120, 160, 1.5, 1)}${A.cloud(430, 110, 1.2, 1)}${A.cloud(690, 250, 1.0, 1)}${A.cloud(930, 120, 1.1, 1)}</g>`.replace(/class="drift"/g, ""), PV, "xMidYMid slice");
PAPER.panoMid = shift(() => L(`
  <g transform="translate(-80,70) scale(1.35)">${A.mountains(0)}</g><g transform="translate(300,40) scale(1.5)">${A.mountains(0)}</g><g transform="translate(680,90) scale(1.25)">${A.mountains(0)}</g>
  <rect x="0" y="560" width="1000" height="120" fill="url(#haze)" opacity=".6"/>
  <path d="M-20 640 Q200 600 420 640 T1020 622 V820 H-20Z" fill="url(#grass2)" stroke="#2f8f4e" stroke-width="3"/>
  ${A.lake(600, 700, 300, 36)}
  <path d="M-20 720 Q260 690 520 722 T1020 706 V820 H-20Z" fill="url(#grass)" stroke="#2f8f4e" stroke-width="3"/>
  ${A.tree(60, 690, 1.5)}${A.tree(330, 700, 1.1)}${A.tree(960, 700, 1.3)}
  ${A.yurt(740, 722, 1.05, false)}${A.yurt(880, 736, .8, false)}${A.yurt(630, 738, .55, false)}
  ${A.flower(300, 790, "#ff5d73")}${A.flower(470, 796, "#ffd23f")}${A.flower(610, 792, "#ff8fd0")}${A.flower(820, 796, "#fff")}`, PV, "xMidYMid slice"), -175);
PAPER.panoFront = shift(() => L(`${A.flag(150, 740, 2.0)}${A.smoke(740, 722, 1.05)}${PERSON.make("sevil", { x: 270, y: 780, s: 2.2, cls: "bob" })}
  <g class="glide">${A.eagle(540, 250, 1.1)}</g><g class="glide" style="animation-delay:-2s">${A.eagle(760, 330, .6)}</g>
  <g transform="translate(560,704)"><g class="boat"><path d="M-30 0 H30 L22 12 H-22Z" fill="#e8433f" stroke="#4a2f22" stroke-width="2.4"/><path d="M0 0 V-40 L26 -8Z" fill="#fff" stroke="#4a2f22" stroke-width="2.4"/></g></g>
  ${A.sparkle(500, 690, 0, 1.4)}${A.sparkle(680, 705, .6, 1.2)}${A.sparkle(430, 712, 1.1, 1.1)}`, PV, "xMidYMid slice"), -175);

// ---------- семья и школа ----------
PAPER.familyMid = shift(() => L(`${A.mountains(130)}<rect x="-60" y="560" width="520" height="120" fill="url(#haze)" opacity=".5"/>
  <path d="M-60 560 Q80 520 200 556 T460 540 V1300 H-60Z" fill="url(#grass)" stroke="#2f8f4e" stroke-width="2.5"/>
  <path d="M-60 620 Q100 590 230 620 T460 604 V1300 H-60Z" fill="url(#grass2)" stroke="#2f8f4e" stroke-width="2.5"/>
  ${A.tree(60, 650, 2.5)}${A.tree(346, 640, 2.0)}<rect x="-60" y="300" width="520" height="900" fill="url(#warmTint)"/>`), -178);
PAPER.familyFront = shift((names) => {
  const nod = (i) => ({ cls: names ? "nod" : "bob", delay: names ? 0.9 + i : i * 0.3 });
  const k = (kind, o, i) => PERSON.make(kind, Object.assign({}, o, nod(i)));
  return L(`${k("grandpa", { x: 62, y: 668, s: 1.0 }, 0)}${k("granny", { x: 128, y: 668, s: 1.0 }, 1)}${k("dad", { x: 272, y: 668, s: 1.0 }, 4)}${k("mom", { x: 338, y: 668, s: 1.0 }, 5)}
    ${k("brother", { x: 138, y: 726, s: 1.35 }, 2)}${k("sister", { x: 262, y: 726, s: 1.3 }, 3)}${PERSON.make("sevil", { x: 200, y: 756, s: 1.75, cls: "bob" })}
    ${A.flower(26, 770, "#ff5d73")}${A.flower(92, 786, "#ffd23f")}${A.flower(312, 790, "#ff8fd0")}${A.flower(376, 772, "#fff")}`);
}, -178);
PAPER.familyTree = shift(() => L(`<g transform="translate(0,60) scale(1)">${PAPER.treeArt()}</g>`), -30);
PAPER.schoolMid = shift(() => L(`${A.mountains(120)}
  <path d="M-60 590 Q80 548 200 584 T460 566 V1300 H-60Z" fill="url(#grass)" stroke="#2f8f4e" stroke-width="2.5"/>
  <path d="M-60 650 Q100 620 230 650 T460 634 V1300 H-60Z" fill="url(#grass2)" stroke="#2f8f4e" stroke-width="2.5"/>
  ${A.tree(30, 660, 1.7)}${A.tree(372, 652, 1.5)}${A.school(200, 640, 1.75, false)}`), -150);
PAPER.schoolFlag = shift(() => L(`${A.schoolFlag(200, 640, 1.75)}`), -150);
PAPER.bus = shift(() => L(`${A.bus(118, 742, 1.15, true)}`), -150);
PAPER.schoolFront = shift(() => L(`${PERSON.make("sevil", { x: 250, y: 756, s: 1.8, cls: "bob" })}${PERSON.make("pupilB", { x: 322, y: 750, s: 1.5, cls: "bob", delay: .4 })}${PERSON.make("pupilG", { x: 368, y: 752, s: 1.4, cls: "bob", delay: .8 })}${PERSON.make("teacher", { x: 60, y: 752, s: 1.4, cls: "bob", delay: .2 })}
  ${A.flower(26, 770, "#ff5d73")}${A.flower(176, 790, "#ffd23f")}${A.flower(372, 790, "#ff8fd0")}`), -150);

// ---------- обложка книги ----------
PAPER.cover = () => L(`<rect width="400" height="800" fill="url(#felt)"/>
  <rect x="18" y="18" width="364" height="764" rx="10" fill="none" stroke="#ffd23f" stroke-width="3"/><rect x="28" y="28" width="344" height="744" rx="6" fill="none" stroke="#ffd23f" stroke-width="1.5" stroke-dasharray="2 8" stroke-linecap="round"/>
  <rect x="36" y="36" width="328" height="26" fill="url(#orn)" opacity=".95"/><rect x="36" y="738" width="328" height="26" fill="url(#orn)" opacity=".95"/>
  <g opacity=".9"><circle cx="200" cy="270" r="124" fill="none" stroke="#ffd23f" stroke-width="3"/><circle cx="200" cy="270" r="110" fill="none" stroke="#ffd23f" stroke-width="1.5" stroke-dasharray="3 7"/>
  ${[...Array(24)].map((_, i) => { const a = (i * 15 * Math.PI) / 180; return `<line x1="${200 + Math.cos(a) * 126}" y1="${270 + Math.sin(a) * 126}" x2="${200 + Math.cos(a) * 146}" y2="${270 + Math.sin(a) * 146}" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>`; }).join("")}</g>
  <clipPath id="cvc"><circle cx="200" cy="270" r="104"/></clipPath><image href="img/sevil.jpg" x="96" y="140" width="208" height="370" preserveAspectRatio="xMidYMin slice" clip-path="url(#cvc)"/>
  <circle cx="200" cy="270" r="104" fill="none" stroke="#fff3d9" stroke-width="5"/>
  <text x="200" y="478" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="44" fill="#ffd23f" stroke="#7a5200" stroke-width="1.2" paint-order="stroke">МОЙ БОЛЬШОЙ</text>
  <text x="200" y="530" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="58" fill="#ffd23f" stroke="#7a5200" stroke-width="1.2" paint-order="stroke">МИР</text>
  <text x="200" y="580" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="21" fill="#fff3d9">${CONTENT.name} · ${CONTENT.grade}</text>
  <text x="200" y="610" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="16" fill="#ffe9a8" opacity=".9">школа «${CONTENT.school}»</text>`);

// ---------- наборы слоёв сцен: [класс, глубина параллакса, разметка] ----------
PAPER.layers = {
  family: (o) => [["sky", 0.05, PAPER.sunset(300)], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.3, PAPER.familyMid()], ["front", 0.6, PAPER.familyFront(o.names)]],
  familyTree: () => [["sky", 0.05, PAPER.sunset(300)], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.25, PAPER.familyMid()], ["sway", 0.4, PAPER.familyTree()]],
  school: (o) => [["sky", 0.05, PAPER.morning()], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.3, PAPER.schoolMid()], ["flag", 0.3, PAPER.schoolFlag()], ...(o.bus ? [["bus", 0.45, PAPER.bus()]] : []), ["front", 0.6, PAPER.schoolFront()]],
};
PAPER.pano = () => [["sky", 0, PAPER.panoSky()], ["clouds", 0, PAPER.panoClouds()], ["mid", 0, PAPER.panoMid()], ["front", 0, PAPER.panoFront()]];

// ---------- три мира для главного экрана: школа · семья · Родина ----------
PAPER.titleMid = () => L(`${A.mountains(150)}<path d="M-60 640 Q100 600 220 636 T460 620 V1300 H-60Z" fill="url(#grass)" stroke="#2f8f4e" stroke-width="2.5"/><rect x="-60" y="300" width="520" height="900" fill="url(#warmTint)"/>`);
PAPER.landMid = () => L(`${A.mountains(60)}<rect x="-60" y="450" width="520" height="90" fill="url(#haze)" opacity=".5"/>
  <path d="M-60 520 Q80 490 200 518 T460 504 V1300 H-60Z" fill="url(#grass2)" stroke="#2f8f4e" stroke-width="2.5"/>
  ${A.lake(200, 540, 200, 26)}
  <path d="M-60 590 Q100 560 230 590 T460 574 V1300 H-60Z" fill="url(#grass)" stroke="#2f8f4e" stroke-width="2.5"/>
  ${A.tree(372, 612, 1.1)}${A.yurt(290, 634, 1.0, false)}${A.yurt(112, 648, .62, false)}
  ${A.flower(40, 690, "#ff5d73")}${A.flower(170, 706, "#ffd23f")}${A.flower(350, 700, "#ff8fd0")}`);
PAPER.landFront = () => L(`${A.flag(66, 650, 1.35)}${A.smoke(290, 634, 1.0)}${PERSON.make("sevil", { x: 196, y: 690, s: 1.45, cls: "bob" })}
  <g class="glide">${A.eagle(250, 250, .9)}</g>
  <g transform="translate(160,548)"><g class="boat"><path d="M-22 0 H22 L16 10 H-16Z" fill="#e8433f" stroke="#4a2f22" stroke-width="2.2"/><path d="M0 0 V-30 L18 -6Z" fill="#fff" stroke="#4a2f22" stroke-width="2.2"/></g></g>
  ${A.sparkle(120, 530, 0, 1.2)}${A.sparkle(250, 552, .7, 1)}`);
PAPER.cards = {
  school: () => PAPER.layers.school({ bus: true }),
  family: () => [["sky", 0.05, PAPER.wall()], ["sway", 0.3, PAPER.tree()]],
  land: () => [["sky", 0.05, PAPER.morning()], ["clouds", 0.12, PAPER.clouds()], ["mid", 0.3, PAPER.landMid()], ["front", 0.6, PAPER.landFront()]],
};

// ================= Главная как на диораме: далёкая комната сзади, в центре древо, слева школа, справа Родина =================
const komuz = (x, y, r = 0) => `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-3" y="-44" width="6" height="46" rx="3" fill="#7a4a2a" stroke="#4a2f22" stroke-width="1.6"/><path d="M0 40 C-20 40 -22 12 -9 0 L9 0 C22 12 20 40 0 40Z" fill="#d49a52" stroke="#4a2f22" stroke-width="2"/><circle cx="0" cy="18" r="5" fill="#5b3a29"/></g>`;
const pot = (x, y, c) => `<g transform="translate(${x},${y})"><path d="M-10 0 Q-14 -16 -6 -22 L6 -22 Q14 -16 10 0Z" fill="${c}" stroke="#4a2f22" stroke-width="2"/><rect x="-7" y="-26" width="14" height="5" rx="2" fill="${c}" stroke="#4a2f22" stroke-width="1.6"/></g>`;
PAPER.wall = () => L(`<rect x="-60" y="-60" width="520" height="940" fill="url(#paper)"/>
  <rect x="0" y="0" width="400" height="18" fill="url(#orn)"/><rect x="0" y="18" width="400" height="4" fill="#8e2f3a"/>
  <rect x="88" y="38" width="224" height="150" rx="4" fill="#2f6f5a" stroke="#9b6a35" stroke-width="8"/>
  <g stroke="#fff" stroke-width="2.4" opacity=".55" stroke-linecap="round" fill="none"><path d="M106 70 H200 M106 92 H250 M106 114 H170"/><circle cx="270" cy="72" r="10"/><path d="M262 130 l14 -18 l14 18Z"/></g>
  <rect x="0" y="98" width="52" height="250" fill="#c18a52" stroke="#8a5a2c" stroke-width="4"/>
  <path d="M0 168 H52 M0 238 H52 M0 308 H52" stroke="#8a5a2c" stroke-width="5"/>
  ${komuz(16, 160, -8)}${komuz(40, 160, 6)}${pot(18, 232, "#e8590c")}${pot(40, 232, "#2b93e6")}<g transform="translate(6,300)"><rect width="10" height="28" rx="2" fill="#d62839" stroke="#4a2f22" stroke-width="1.5"/><rect x="12" y="4" width="10" height="24" rx="2" fill="#2f9e5b" stroke="#4a2f22" stroke-width="1.5"/><rect x="24" width="10" height="28" rx="2" fill="#2b7de9" stroke="#4a2f22" stroke-width="1.5"/></g>
  <g transform="translate(346,44)"><rect width="62" height="260" rx="4" fill="#8e2f3a" stroke="#5a1d25" stroke-width="3"/><rect x="6" y="6" width="50" height="248" fill="url(#orn2)" opacity=".9"/><rect x="16" y="50" width="30" height="150" fill="#ffd23f" opacity=".85"/><circle cx="31" cy="125" r="22" fill="#d62839"/><circle cx="31" cy="125" r="10" fill="#fff3d9"/></g>
  <rect x="-10" y="770" width="420" height="40" fill="url(#wood)"/><rect x="26" y="778" width="348" height="12" fill="url(#orn)"/><path d="M-10 772 H410" stroke="#5e3a1a" stroke-width="2"/>`);

PAPER.treeArt0 = PAPER.treeArt;
PAPER.tree = () => L(`<g transform="translate(200,252) scale(.86) translate(-200,-262)">${PAPER.treeArt0()}</g>`);

const POLY = (x0, x1, top, base) => `${x0},${base} ${x0},${top + 70} ${(x0 + x1) / 2},${top} ${x1},${top + 70} ${x1},${base}`;
const boxFrame2 = (x0, x1, top, base, label) => `<polygon points="${POLY(x0, x1, top, base)}" fill="none" stroke="#b9824a" stroke-width="9" stroke-linejoin="round"/><polygon points="${POLY(x0 + 4, x1 - 4, top + 4, base)}" fill="none" stroke="#8a5a2c" stroke-width="2" opacity=".7" stroke-linejoin="round"/>
  <rect x="${x0 - 6}" y="${base - 18}" width="${x1 - x0 + 12}" height="26" rx="6" fill="url(#wood)" stroke="#5e3a1a" stroke-width="3"/>
  <g transform="translate(${(x0 + x1) / 2},${base - 4})"><rect x="-40" y="-13" width="80" height="22" rx="6" fill="#fff3d9" stroke="#8a5a2c" stroke-width="2.4"/><text y="3" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="13" fill="#4a2f22">${label}</text></g>`;
PAPER.boxSchool = () => `<g><clipPath id="bs"><polygon points="${POLY(8, 168, 476, 756)}"/></clipPath><g clip-path="url(#bs)">
  <rect x="0" y="470" width="180" height="300" fill="url(#morning)"/><circle cx="142" cy="550" r="11" fill="#ffe27a"/>
  <path d="M0 704 Q80 690 180 702 V770 H0Z" fill="#58c878" stroke="#2f8f4e" stroke-width="1.5"/>
  <g transform="translate(88,716) scale(.66)">${A.school(0, 0, 1, false)}</g>
  ${PERSON.make("sevil", { x: 52, y: 748, s: .52 })}${PERSON.make("teacher", { x: 126, y: 750, s: .46 })}${PERSON.make("pupilB", { x: 96, y: 752, s: .4 })}${PERSON.make("pupilG", { x: 150, y: 752, s: .38 })}</g>${boxFrame2(8, 168, 476, 756, "ШКОЛА")}</g>`;
PAPER.boxLand = () => `<g><clipPath id="bl"><polygon points="${POLY(232, 392, 476, 756)}"/></clipPath><g clip-path="url(#bl)">
  <rect x="226" y="470" width="176" height="300" fill="url(#morning)"/><circle cx="368" cy="550" r="11" fill="#ffe27a"/>
  <g transform="translate(210,450) scale(.57)">${A.mountains(0)}</g>
  <ellipse cx="312" cy="722" rx="52" ry="9" fill="#4cc9f0" stroke="#2b93e6" stroke-width="1.5"/>
  <path d="M226 724 Q312 706 402 720 V770 H226Z" fill="#58c878" stroke="#2f8f4e" stroke-width="1.5"/>
  <g transform="translate(352,748) scale(.34)">${A.yurt(0, 0, 1, false)}</g><g transform="translate(282,754) scale(.24)">${A.yurt(0, 0, 1, false)}</g>
  ${PERSON.make("sevil", { x: 318, y: 756, s: .46 })}</g>${boxFrame2(232, 392, 476, 756, "РОДИНА")}</g>`;
PAPER.banner = () => `<g transform="translate(200,742) scale(.78) translate(-200,-606)"><path d="M30 578 Q200 560 370 578 L358 606 L372 634 Q200 618 28 634 L42 606Z" fill="#fff3d9" stroke="#8a5a2c" stroke-width="3" stroke-linejoin="round"/>
  <path d="M30 578 L14 584 L26 606 L14 628 L28 634Z M370 578 L386 584 L374 606 L386 628 L372 634Z" fill="#e6c88e" stroke="#8a5a2c" stroke-width="2.4" stroke-linejoin="round"/>
  <text x="200" y="601" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="900" font-size="18" fill="#4a2f22">МОЙ БОЛЬШОЙ МИР</text>
  <text x="200" y="620" text-anchor="middle" font-family="Montserrat, Nunito, sans-serif" font-weight="800" font-size="12" fill="#8a5a2c" letter-spacing="1.5">СЕМЬЯ · ШКОЛА · РОДИНА</text></g>`;
PAPER.hubFx = () => L(`<g class="hubFlag">${A.schoolFlag(88, 716, .66)}</g><g transform="translate(262,744)"><g class="flagS">${A.flag(0, 0, .3)}</g></g>
  <g transform="translate(330,560)"><g class="glide">${A.eagle(0, 0, .26)}</g></g>${A.smoke(352, 748, .34)}
  ${A.sparkle(70, 130, 0, 1.2)}${A.sparkle(340, 150, .7, 1)}${A.sparkle(200, 60, 1.3, 1.1)}`);
PAPER.boxes = () => L(PAPER.boxSchool() + PAPER.boxLand() + PAPER.banner());
