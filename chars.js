// Персонажи: тёплые мультяшные куклы с лицами, руками, одеждой и национальными деталями.
// Начало координат — под ногами, рост около 100 единиц.
const PERSON = {};
const OUT = (w = 2.2) => `stroke="#4a2f22" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const SKIN = "#f6c79a", SKIN_D = "#e8a97a";

const LOOK = {
  sevil:  { hair: "#6b4630", style: "bob",    hat: "cap",    outfit: "sevil",  shoes: "#fff" },
  mom:    { hair: "#2b1b12", style: "long",   hat: null,     outfit: "dress",  main: "#c2408a", trim: "#ffd23f", shoes: "#5a2d2d" },
  dad:    { hair: "#2b1b12", style: "short",  hat: "kalpak", outfit: "chapan", main: "#2f6f5a", trim: "#ffd23f", shoes: "#2a2a35" },
  granny: { hair: "#d7d7df", style: "scarf",  hat: "scarf",  outfit: "dress",  main: "#8e5de0", trim: "#fff", shoes: "#5a2d2d" },
  grandpa:{ hair: "#d7d7df", style: "short",  hat: "kalpak", outfit: "chapan", main: "#3d5a99", trim: "#ffd23f", shoes: "#2a2a35", beard: true },
  brother:{ hair: "#3a2416", style: "short",  hat: "kalpak", outfit: "vest",   main: "#2f8fe0", trim: "#fff", shoes: "#2a2a35", small: true },
  sister: { hair: "#2b1b12", style: "braids", hat: null,     outfit: "dress",  main: "#f06595", trim: "#fff", shoes: "#5a2d2d", small: true },
  teacher:{ hair: "#3a2416", style: "bun",    hat: null,     outfit: "dress",  main: "#2f9e8f", trim: "#fff", shoes: "#2a2a35", glasses: true },
  pupilB: { hair: "#2b1b12", style: "short",  hat: null,     outfit: "uniform",main: "#ff7a1a", trim: "#fff", shoes: "#2a2a35", small: true },
  pupilG: { hair: "#2b1b12", style: "braids", hat: null,     outfit: "uniformG",main: "#ff7a1a", trim: "#fff", shoes: "#2a2a35", small: true },
};

const hairBack = (L) => ({
  bob:    `<path d="M-20 -78 Q-22 -100 0 -100 Q22 -100 20 -78 L20 -60 Q15 -63 13 -72 L-13 -72 Q-15 -63 -20 -60Z" fill="${L.hair}" ${OUT()}/>`,
  long:   `<path d="M-20 -78 Q-22 -100 0 -100 Q22 -100 20 -78 L22 -42 Q12 -38 8 -52 L-8 -52 Q-12 -38 -22 -42Z" fill="${L.hair}" ${OUT()}/>`,
  braids: `<path d="M-19 -80 Q-20 -98 0 -98 Q20 -98 19 -80Z" fill="${L.hair}" ${OUT()}/><path d="M-18 -74 Q-26 -62 -20 -46" fill="none" stroke="${L.hair}" stroke-width="7" stroke-linecap="round"/><path d="M18 -74 Q26 -62 20 -46" fill="none" stroke="${L.hair}" stroke-width="7" stroke-linecap="round"/><circle cx="-20" cy="-44" r="4" fill="#ff5d73"/><circle cx="20" cy="-44" r="4" fill="#ff5d73"/>`,
  short:  `<path d="M-19 -80 Q-20 -98 0 -98 Q20 -98 19 -80 Q10 -88 0 -86 Q-10 -88 -19 -80Z" fill="${L.hair}" ${OUT()}/>`,
  bun:    `<circle cx="0" cy="-102" r="8" fill="${L.hair}" ${OUT()}/><path d="M-19 -80 Q-20 -98 0 -98 Q20 -98 19 -80 Q10 -88 0 -86 Q-10 -88 -19 -80Z" fill="${L.hair}" ${OUT()}/>`,
  scarf:  `<path d="M-21 -78 Q-23 -104 0 -104 Q23 -104 21 -78 L23 -50 Q0 -44 -23 -50Z" fill="#fff" ${OUT()}/>`,
}[L.style] || "");

const hat = (L) => ({
  cap:    `<path d="M-19 -84 Q-18 -104 0 -104 Q18 -104 19 -84Z" fill="#ffe066" ${OUT()}/><path d="M-19 -84 Q8 -78 30 -84 Q22 -91 0 -90Z" fill="#f5c933" ${OUT()}/><path d="M-3 -97 l-8 -6 l2 11Z M-3 -97 l8 -6 l-2 11Z" fill="#fff3a0" ${OUT(1.4)}/>`,
  kalpak: `<path d="M-17 -88 Q-15 -112 0 -116 Q15 -112 17 -88Z" fill="#fff" ${OUT()}/><path d="M-19 -84 Q0 -78 19 -84 L17 -92 Q0 -87 -17 -92Z" fill="#26262e" ${OUT()}/><path d="M0 -108 l4 5 l-4 5 l-4 -5Z" fill="#d62839"/>`,
  scarf:  `<path d="M-18 -88 Q0 -98 18 -88 Q10 -84 0 -86 Q-10 -84 -18 -88Z" fill="#fff" ${OUT(1.6)}/><path d="M-18 -90 Q0 -82 18 -90" fill="none" stroke="#e8433f" stroke-width="3" stroke-linecap="round"/>`,
}[L.hat] || "");

const head = (L, mood) => `
  <ellipse cx="-17" cy="-74" rx="3" ry="4.5" fill="${SKIN}" ${OUT(1.6)}/><ellipse cx="17" cy="-74" rx="3" ry="4.5" fill="${SKIN}" ${OUT(1.6)}/>
  <rect x="-4.5" y="-64" width="9" height="9" fill="${SKIN_D}"/>
  <ellipse cx="0" cy="-76" rx="17" ry="18.5" fill="${SKIN}" ${OUT()}/>
  <g class="eyes"><ellipse cx="-6.2" cy="-76" rx="3.6" ry="4.2" fill="#fff"/><ellipse cx="6.2" cy="-76" rx="3.6" ry="4.2" fill="#fff"/>
  <circle cx="-5.8" cy="-75.5" r="2.5" fill="#3a2416"/><circle cx="6.6" cy="-75.5" r="2.5" fill="#3a2416"/>
  <circle cx="-5" cy="-76.6" r=".9" fill="#fff"/><circle cx="7.4" cy="-76.6" r=".9" fill="#fff"/></g>
  <path d="M-10 -82 Q-6 -84.5 -2.5 -82.5 M2.5 -82.5 Q6 -84.5 10 -82" fill="none" stroke="#4a2f22" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M0 -73 q-1.6 3.5 0 4.2" fill="none" stroke="${SKIN_D}" stroke-width="1.5" stroke-linecap="round"/>
  <path class="smile" d="M-5 -67.5 Q0 -63 5 -67.5" fill="none" stroke="#a8453a" stroke-width="2" stroke-linecap="round"/>
  <g class="mouthO" opacity="0"><path d="M-6 -68.5 Q0 -67.4 6 -68.5 Q5 -61.5 0 -61.5 Q-5 -61.5 -6 -68.5Z" fill="#8a2b2b" stroke="#4a2f22" stroke-width="1.4" stroke-linejoin="round"/><path d="M-3.4 -63.2 Q0 -65.4 3.4 -63.2 Q0 -61.8 -3.4 -63.2Z" fill="#ff8fa3"/><path d="M-4.6 -68.2 H4.6 V-66.8 H-4.6Z" fill="#fff"/></g>
  <ellipse cx="-11" cy="-69" rx="3.6" ry="2.2" fill="#ff8a8a" opacity=".55"/><ellipse cx="11" cy="-69" rx="3.6" ry="2.2" fill="#ff8a8a" opacity=".55"/>
  ${L.glasses ? `<circle cx="-6.2" cy="-76" r="5.4" fill="none" stroke="#4a2f22" stroke-width="1.5"/><circle cx="6.2" cy="-76" r="5.4" fill="none" stroke="#4a2f22" stroke-width="1.5"/><path d="M-0.8 -76 h1.6" stroke="#4a2f22" stroke-width="1.5"/>` : ""}
  ${L.beard ? `<path d="M-14 -68 Q0 -52 14 -68 Q10 -60 0 -58 Q-10 -60 -14 -68Z" fill="#e6e6ee" ${OUT(1.6)}/>` : ""}`;

const body = (L) => {
  const m = L.main, t = L.trim, sh = L.shoes;
  const legs = (col) => `<g class="legL"><rect x="-9" y="-30" width="7.5" height="26" rx="3" fill="${col}" ${OUT(1.8)}/><ellipse cx="-5.5" cy="-2" rx="7.5" ry="4" fill="${sh}" ${OUT(1.8)}/></g>
    <g class="legR"><rect x="1.5" y="-30" width="7.5" height="26" rx="3" fill="${col}" ${OUT(1.8)}/><ellipse cx="5.5" cy="-2" rx="7.5" ry="4" fill="${sh}" ${OUT(1.8)}/></g>`;
  const arm = (col, hand = SKIN) => `<g class="armL"><path d="M-13 -56 Q-21 -44 -17 -33" fill="none" stroke="${col}" stroke-width="7.5" stroke-linecap="round"/><circle cx="-17" cy="-31" r="4" fill="${hand}" ${OUT(1.6)}/></g>
    <g class="armR"><path d="M13 -56 Q21 -44 17 -33" fill="none" stroke="${col}" stroke-width="7.5" stroke-linecap="round"/><circle cx="17" cy="-31" r="4" fill="${hand}" ${OUT(1.6)}/></g>`;
  switch (L.outfit) {
    case "sevil": return `${legs(SKIN)}
      <path d="M-11 -34 L11 -34 L18 -6 Q0 0 -18 -6Z" fill="#b98cff" ${OUT()}/><path d="M-12 -34 H12 L13 -40 H-13Z" fill="#9ad8f5" ${OUT(1.8)}/>
      <path d="M-14 -26 Q-9 -22 -4 -26 Q1 -22 6 -26 Q11 -22 15 -26 M-15 -18 Q-9 -14 -4 -18 Q1 -14 6 -18 Q11 -14 16 -18" fill="none" stroke="#7fe0f5" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M-12 -58 Q0 -62 12 -58 L14 -40 L-14 -40Z" fill="#fff" ${OUT()}/><circle cx="0" cy="-48" r="4.4" fill="none" stroke="#ff7a1a" stroke-width="1.8"/><circle cx="0" cy="-50" r="1.4" fill="#ff7a1a"/><circle cx="-1.8" cy="-47" r="1.2" fill="#9b5de5"/><circle cx="1.8" cy="-47" r="1.2" fill="#3dbb4f"/>
      ${arm("#fff")}`;
    case "dress": return `${legs(SKIN)}
      <path d="M-13 -58 Q0 -63 13 -58 L19 -8 Q0 -2 -19 -8Z" fill="${m}" ${OUT()}/><path d="M-18 -13 Q0 -7 18 -13" fill="none" stroke="${t}" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/>
      <path d="M-12 -46 Q0 -42 12 -46" fill="none" stroke="${t}" stroke-width="2.4"/>${arm(m)}`;
    case "chapan": return `${legs("#33405e")}
      <path d="M-14 -58 Q0 -63 14 -58 L17 -14 L-17 -14Z" fill="${m}" ${OUT()}/><path d="M-3 -60 L0 -14 L3 -60Z" fill="#fff" opacity=".9"/><path d="M-17 -30 H17" stroke="${t}" stroke-width="4"/><rect x="-3" y="-33" width="6" height="6" fill="${t}" ${OUT(1.2)}/>
      <path d="M-17 -16 H17" stroke="${t}" stroke-width="2.4" stroke-dasharray="3 3"/>${arm(m)}`;
    case "vest": return `${legs("#2f4a8a")}
      <path d="M-12 -58 Q0 -62 12 -58 L13 -32 L-13 -32Z" fill="#fff" ${OUT()}/><path d="M-12 -58 L-3 -58 L-3 -32 L-13 -32Z M12 -58 L3 -58 L3 -32 L13 -32Z" fill="${m}" ${OUT(1.6)}/>${arm("#fff")}`;
    case "uniform": return `${legs("#2b2f3a")}
      <path d="M-12 -58 Q0 -62 12 -58 L13 -30 L-13 -30Z" fill="${m}" ${OUT()}/><path d="M-4 -60 L0 -54 L4 -60Z" fill="#fff" ${OUT(1.4)}/>${arm(m)}`;
    case "uniformG": return `${legs(SKIN)}
      <path d="M-12 -58 Q0 -62 12 -58 L13 -36 L-13 -36Z" fill="${m}" ${OUT()}/><path d="M-13 -36 L13 -36 L17 -8 Q0 -2 -17 -8Z" fill="#2b2f3a" ${OUT()}/><path d="M-4 -60 L0 -54 L4 -60Z" fill="#fff" ${OUT(1.4)}/>${arm(m)}`;
  }
  return "";
};

const BAG = `<rect x="-16" y="-60" width="32" height="30" rx="8" fill="#ff7a1a" ${OUT()}/><rect x="-10" y="-46" width="20" height="12" rx="4" fill="#ff9a45" ${OUT(1.6)}/>`;
// kind: sevil | mom | dad | granny | grandpa | brother | sister | teacher | pupilB | pupilG
PERSON.make = (kind, o = {}) => {
  const { x = 0, y = 0, s = 1, cls = "", delay = 0, shadow = true } = o, L = LOOK[kind], k = L.small ? 0.86 : 1;
  return `<g transform="translate(${x},${y}) scale(${s * k})">
    ${shadow ? `<ellipse cx="0" cy="0" rx="22" ry="5" fill="rgba(40,20,0,.28)"/>` : ""}
    <g class="${cls}" style="animation-delay:${delay}s">${hairBack(L)}${o.bag ? BAG : ""}${body(L)}<g class="headG">${head(L)}${L.style === "bob" ? `<path d="M-17 -82 Q-8 -92 0 -90 Q10 -92 17 -82 Q9 -86 0 -86 Q-9 -86 -17 -82Z" fill="${L.hair}" ${OUT(1.6)}/>` : ""}${hat(L)}</g></g></g>`;
};
// только голова — для медальонов семейного дерева
PERSON.face = (kind) => { const L = LOOK[kind]; return `${hairBack(L)}${head(L)}${L.style === "bob" ? `<path d="M-17 -82 Q-8 -92 0 -90 Q10 -92 17 -82 Q9 -86 0 -86 Q-9 -86 -17 -82Z" fill="${L.hair}" ${OUT(1.6)}/>` : ""}${hat(L)}`; };
