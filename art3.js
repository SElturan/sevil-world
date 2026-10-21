// Иллюстрации новой версии: большие картинки разделов и картинки карточек.
// Рисуем из деталей art.js. Здесь всё статично, двигаются только самые заметные мелочи.

// интерактивные картинки (дерево, портфель, карта, инструменты) без рамки-слайда
A.panel = (id, bg, inner) => `<g><rect x="14" y="104" width="372" height="392" rx="26" fill="${bg}"/>${inner}</g>`;
const PANEL_VIEW = "14 104 372 392";

const sky = (id, y = 100, h = 520) => `<rect x="-50" y="${y}" width="500" height="${h}" fill="url(#${id})"/>`;
const svg = (view, inner, cls = "") => `<svg class="${cls}" viewBox="${view}" preserveAspectRatio="xMidYMax slice" role="img" aria-hidden="true">${inner}</svg>`;
const grass = (y = 470) => `<path d="M-50 ${y} Q80 ${y - 40} 200 ${y - 5} T450 ${y - 20} V900 H-50Z" fill="url(#grass)" ${S(2.5)}/><path d="M-50 ${y + 50} Q100 ${y + 20} 230 ${y + 50} T450 ${y + 35} V900 H-50Z" fill="url(#grass2)" ${S(2.5)}/>`;
const SV = (o) => A.kid(Object.assign({ kind: "girl", cls: "bob" }, o));

const ART = {};

// ---------- большие картинки разделов ----------
ART.heroHome = () => svg("0 140 400 430", `${sky("sky", 100, 560)}${A.sun(70, 200, 28)}${A.cloud(250, 230, 1)}${A.cloud(130, 300, .7)}
  ${A.mountains(-10)}${grass(500)}${A.tree(40, 560, 1.1)}${A.tree(372, 548, 1)}`, "heroSvg");

ART.heroLand = () => svg("0 250 400 390", `${sky("sky", 100, 560)}${A.sun(335, 300, 24)}${A.cloud(70, 280, .9)}${A.cloud(250, 340, .7)}
  ${A.mountains(0)}
  <path d="M-50 470 Q80 440 200 468 T450 456 V900 H-50Z" fill="url(#grass2)" ${S(2.5)}/>${A.lake(200, 474, 190, 20)}
  <path d="M-50 520 Q100 490 230 520 T450 505 V900 H-50Z" fill="url(#grass)" ${S(2.5)}/>
  ${A.yurt(306, 556, 0.62, true)}${A.flag(66, 566, 1.05)}
  <g class="eagleFly">${A.eagle(190, 292, .55)}</g>
  ${SV({ x: 190, y: 566, s: 1.25 })}
  ${A.flower(30, 585, "#ff5d73")}${A.flower(120, 598, "#ffd23f")}${A.flower(262, 598, "#ff8fd0")}${A.flower(372, 580, "#fff")}`, "heroSvg");

ART.heroFamily = () => svg("0 250 400 390", `${sky("skyWarm", 100, 560)}${A.sun(335, 300, 24)}${A.cloud(80, 285, .9)}
  ${A.mountains(80)}${grass(480)}${A.tree(56, 550, 1.5)}${A.tree(352, 548, 1.25)}
  ${A.kid({ x: 70, y: 566, s: .8, kind: "grandpa" })}${A.kid({ x: 114, y: 566, s: .8, kind: "granny" })}${A.kid({ x: 286, y: 566, s: .8, kind: "dad" })}${A.kid({ x: 330, y: 566, s: .8, kind: "mom" })}
  ${A.kid({ x: 148, y: 590, s: 1.0, kind: "boy" })}${A.kid({ x: 252, y: 590, s: 1.0, kind: "sister" })}
  ${SV({ x: 200, y: 592, s: 1.3 })}
  ${A.heart(150, 440, 0)}${A.heart(250, 430, 1)}${A.heart(200, 400, 2)}
  ${A.flower(30, 590, "#ff5d73")}${A.flower(110, 600, "#ffd23f")}${A.flower(300, 600, "#ff8fd0")}${A.flower(372, 590, "#fff")}`, "heroSvg");

ART.heroSchool = () => svg("0 250 400 390", `${sky("sky", 100, 560)}${A.sun(335, 300, 24)}${A.cloud(70, 282, .9)}${A.cloud(250, 330, .6)}
  ${A.mountains(70)}${grass(480)}${A.tree(30, 548, 1)}${A.tree(376, 540, 1)}
  ${A.school(200, 545, 1.25, true)}
  ${A.bus(84, 584, .66)}
  ${SV({ x: 244, y: 588, s: 1.25 })}${A.kid({ x: 292, y: 590, s: 1.05, kind: "pupilB", cls: "bob", delay: .4 })}${A.kid({ x: 332, y: 588, s: 1.05, kind: "pupilG", cls: "bob", delay: .8 })}
  ${A.flower(150, 600, "#ffd23f")}${A.flower(366, 596, "#ff8fd0")}`, "heroSvg");

// ---------- картинки карточек (формат 400 × 200) ----------
const card = (inner, bg = "sky") => svg("0 0 400 200", `<rect width="400" height="200" fill="url(#${bg})"/>${inner}`, "artSvg");
ART.mountains = () => card(`${A.sun(335, 52, 22)}${A.cloud(80, 50, .8)}${A.mountains(-200)}${A.eagle(160, 90, .6)}
  <path d="M-10 196 Q100 168 200 190 T410 178 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>`);
ART.lake = () => card(`${A.sun(335, 44, 20)}${A.mountains(-220)}${A.lake(200, 156, 210, 38)}
  <g transform="translate(250,156)"><path d="M-22 0 H22 L16 10 H-16Z" fill="#e8433f" ${S(2)}/><path d="M0 0 V-30 L18 -6Z" fill="#fff" ${S(2)}/></g>${A.sparkle(110, 150, 0, 1.2)}${A.sparkle(310, 170, 0, 1)}
  <path d="M-10 196 Q100 182 200 192 T410 186 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>`);
ART.yurt = () => card(`${A.sun(340, 44, 22)}${A.cloud(70, 50, .8)}${A.mountains(-215)}
  <path d="M-10 168 Q100 148 200 164 T410 156 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>${A.yurt(200, 190, 1.12, true)}
  ${A.flower(40, 190, "#ff5d73")}${A.flower(360, 192, "#ffd23f")}`, "skyWarm");
ART.flag = () => card(`${A.sun(340, 44, 20)}${A.cloud(300, 80, .7)}${A.flag(110, 196, 1.35)}
  <path d="M-10 190 Q100 176 200 188 T410 182 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>`);
ART.table = () => card(`${A.table(200, 128, 1.6)}${A.heart(90, 90, 0)}${A.heart(310, 90, 1)}`, "skyWarm");
ART.values = () => card(`${A.sun(340, 44, 20)}${A.tree(60, 196, .9)}${A.tree(344, 196, .8)}
  <path d="M-10 190 Q100 176 200 188 T410 182 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>
  ${A.kid({ x: 150, y: 196, s: 1.1, kind: "mom" })}${A.kid({ x: 250, y: 196, s: 1.1, kind: "dad" })}${SV({ x: 200, y: 198, s: 1.3 })}${A.heart(200, 70, 0)}`, "skyWarm");
ART.school = () => card(`${A.sun(345, 40, 20)}${A.cloud(60, 48, .8)}${A.school(200, 190, .95, true)}${A.bus(76, 196, .5)}
  ${SV({ x: 300, y: 198, s: .95 })}${A.kid({ x: 340, y: 198, s: .9, kind: "pupilB" })}
  <path d="M-10 192 Q100 184 200 192 T410 188 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>`);
ART.lessons = () => card(`<g font-family="Nunito, system-ui" font-weight="900">
    <text x="42" y="70" font-size="40" fill="#e8433f">А</text><text x="290" y="64" font-size="38" fill="#2b93e6">2+3</text>
    <text x="70" y="140" font-size="30" fill="#26a69a">ABC</text><text x="330" y="136" font-size="40" fill="#f59f00">π</text></g>
  <g transform="translate(200,110)"><rect x="-48" y="-34" width="96" height="66" rx="8" fill="#dfe6f2" ${S(3)}/><rect x="-41" y="-27" width="82" height="52" rx="4" fill="#2b4a7a"/><path d="M-24 -10 l12 8 l-12 8 M0 14 h22" stroke="#7dffa1" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-62 32 H62 L54 44 H-54Z" fill="#c4cbd9" ${S(2.4)}/></g>`);
ART.teachers = () => card(`<g transform="translate(60,40)"><rect width="150" height="96" rx="8" fill="#2f6f5a" ${S(3)}/><rect x="-6" y="92" width="162" height="10" rx="5" fill="#c07b3d" ${S(2.4)}/>
    <text x="75" y="58" text-anchor="middle" font-family="Nunito, system-ui" font-weight="900" font-size="30" fill="#fff">2+2=4</text></g>
  ${A.kid({ x: 262, y: 194, s: 1.0, kind: "teacher" })}${A.kid({ x: 320, y: 196, s: .8, kind: "pupilB" })}${SV({ x: 360, y: 196, s: .8 })}
  <path d="M-10 196 Q100 190 200 196 T410 192 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>`);
ART.friends = () => card(`${A.sun(345, 40, 20)}<path d="M-10 168 Q100 150 200 166 T410 158 V210 H-10Z" fill="url(#grass)" ${S(2.5)}/>
  ${A.kid({ x: 100, y: 196, s: 1.1, kind: "pupilB" })}${SV({ x: 170, y: 198, s: 1.25 })}${A.kid({ x: 240, y: 196, s: 1.1, kind: "pupilG" })}${A.kid({ x: 304, y: 196, s: 1.1, kind: "pupilB" })}
  <circle cx="204" cy="96" r="12" fill="#ff5d73" ${S(2.4)}/>${A.sparkle(60, 80, 0, 1.2)}${A.sparkle(350, 100, 0, 1)}`);

// ---------- интерактивные картинки ----------
ART.tree = () => svg(PANEL_VIEW, A.treePanel(), "figSvg");
ART.bag = () => svg(PANEL_VIEW, A.bagPanel(), "figSvg");
ART.music = () => svg(PANEL_VIEW, A.musicPanel(), "figSvg");
ART.map = () => svg(PANEL_VIEW, A.mapPanel(), "figSvg");

// ---------- значки вкладок ----------
const ICON = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  land: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
  family: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/>',
  school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>',
  awards: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
  sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
};
const icon = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
