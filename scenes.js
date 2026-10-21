// Нарисованные сцены (семья, школа, заставка). Каждая сцена — набор слоёв: небо, облака, дали, передний план.
// Слои двигаются отдельно (параллакс), поэтому рисуются один раз и не перерисовываются.
const EXTRA_DEFS = `<defs>
  <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4766d1"/><stop offset=".4" stop-color="#b27bc9"/><stop offset=".62" stop-color="#ff9d7a"/><stop offset=".82" stop-color="#ffd89a"/><stop offset="1" stop-color="#fff0c9"/></linearGradient>
  <linearGradient id="morning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8fe8"/><stop offset=".55" stop-color="#7fd0ff"/><stop offset="1" stop-color="#eafaff"/></linearGradient>
  <radialGradient id="sunGlow"><stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".25" stop-color="#ffe27a" stop-opacity=".9"/><stop offset=".6" stop-color="#ffb347" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
  <linearGradient id="warmTint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a4c" stop-opacity="0"/><stop offset="1" stop-color="#ff7a3a" stop-opacity=".38"/></linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
</defs>`;

const L = (html) => `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${html}</svg>`;
const SCENE = {};

// положение подписей над головами (в координатах рисунка 400×800)
SCENE.anchors = [[62, 372], [128, 372], [138, 430], [262, 430], [270, 372], [338, 372]];

SCENE.sunset = (sy = 470) => L(`<rect x="-60" y="-100" width="520" height="1000" fill="url(#dusk)"/>
  <circle cx="200" cy="${sy}" r="190" fill="url(#sunGlow)"/><circle cx="200" cy="${sy}" r="52" fill="#fff6c8"/>`);
SCENE.morning = () => L(`<rect x="-60" y="-100" width="520" height="1000" fill="url(#morning)"/>
  <circle cx="320" cy="170" r="150" fill="url(#sunGlow)"/><circle cx="320" cy="170" r="34" fill="#fff6c8"/>`);
SCENE.clouds = (n = 3) => L(`<g opacity=".92">${A.cloud(70, 190, 1.5, 1)}${A.cloud(300, 120, 1.1, 1)}${A.cloud(210, 300, .9, 1)}${n > 3 ? A.cloud(40, 360, .8, 1) : ""}</g>`.replace(/class="drift"/g, ""));

SCENE.familyMid = () => L(`${A.mountains(130)}<rect x="-60" y="560" width="520" height="120" fill="url(#haze)" opacity=".5"/>
  <path d="M-60 560 Q80 520 200 556 T460 540 V1300 H-60Z" fill="url(#grass)" ${S(2.5)}/>
  <path d="M-60 620 Q100 590 230 620 T460 604 V1300 H-60Z" fill="url(#grass2)" ${S(2.5)}/>
  ${A.tree(60, 650, 2.5)}${A.tree(346, 640, 2.0)}
  <rect x="-60" y="300" width="520" height="600" fill="url(#warmTint)"/>`);
SCENE.familyFront = (names) => {
  const nod = (i) => ({ cls: names ? "nod" : "bob", delay: names ? 0.9 + i : i * 0.3 });
  const k = (o, i) => A.kid(Object.assign({}, o, nod(i)));
  return L(`${k({ x: 62, y: 668, s: 1.0, kind: "grandpa" }, 0)}${k({ x: 128, y: 668, s: 1.0, kind: "granny" }, 1)}
    ${k({ x: 270, y: 668, s: 1.0, kind: "dad" }, 4)}${k({ x: 338, y: 668, s: 1.0, kind: "mom" }, 5)}
    ${k({ x: 138, y: 726, s: 1.4, kind: "boy" }, 2)}${k({ x: 262, y: 726, s: 1.35, kind: "sister" }, 3)}
    ${A.kid({ x: 200, y: 752, s: 1.9, kind: "girl", cls: "bob" })}
    ${A.flower(26, 770, "#ff5d73")}${A.flower(92, 786, "#ffd23f")}${A.flower(312, 790, "#ff8fd0")}${A.flower(376, 772, "#fff")}`);
};

SCENE.schoolMid = () => L(`${A.mountains(120)}
  <path d="M-60 590 Q80 548 200 584 T460 566 V1300 H-60Z" fill="url(#grass)" ${S(2.5)}/>
  <path d="M-60 650 Q100 620 230 650 T460 634 V1300 H-60Z" fill="url(#grass2)" ${S(2.5)}/>
  ${A.tree(30, 660, 1.7)}${A.tree(372, 652, 1.5)}${A.school(200, 640, 1.75, false)}`);
SCENE.schoolFlag = () => L(`${A.schoolFlag(200, 640, 1.75)}`);
SCENE.bus = () => L(`${A.bus(118, 742, 1.15, true)}`);
SCENE.schoolFront = () => L(`${A.kid({ x: 250, y: 752, s: 1.9, kind: "girl", cls: "bob" })}${A.kid({ x: 318, y: 746, s: 1.4, kind: "pupilB", cls: "bob", delay: .4 })}${A.kid({ x: 366, y: 748, s: 1.3, kind: "pupilG", cls: "bob", delay: .8 })}
  ${A.flower(26, 770, "#ff5d73")}${A.flower(176, 790, "#ffd23f")}${A.flower(372, 790, "#ff8fd0")}`);

// заставка: горы на закате
SCENE.titleMid = () => L(`${A.mountains(150)}<path d="M-60 640 Q100 600 220 636 T460 620 V1300 H-60Z" fill="url(#grass)" ${S(2.5)}/><rect x="-60" y="300" width="520" height="600" fill="url(#warmTint)"/>`);

const shift = (f, dy) => (...a) => f(...a).replace('aria-hidden="true">', `aria-hidden="true"><g transform="translate(0,${dy})">`).replace(/<\/svg>\s*$/, "</g></svg>");
SCENE.familyMid = shift(SCENE.familyMid, -178); SCENE.familyFront = shift(SCENE.familyFront, -178);
SCENE.schoolMid = shift(SCENE.schoolMid, -150); SCENE.schoolFlag = shift(SCENE.schoolFlag, -150); SCENE.bus = shift(SCENE.bus, -150); SCENE.schoolFront = shift(SCENE.schoolFront, -150);

// наборы слоёв: [класс, глубина параллакса, разметка]
SCENE.layers = {
  family: (o) => [["sky", 0.05, SCENE.sunset(300)], ["clouds", 0.12, SCENE.clouds()], ["mid", 0.3, SCENE.familyMid()], ["front", 0.6, SCENE.familyFront(o.names)]],
  school: (o) => [["sky", 0.05, SCENE.morning()], ["clouds", 0.12, SCENE.clouds()], ["mid", 0.3, SCENE.schoolMid()], ["flag", 0.3, SCENE.schoolFlag()],
    ...(o.bus ? [["bus", 0.45, SCENE.bus()]] : []), ["front", 0.6, SCENE.schoolFront()]],
  title: () => [["sky", 0.05, SCENE.sunset()], ["clouds", 0.12, SCENE.clouds()], ["mid", 0.3, SCENE.titleMid()]],
};
