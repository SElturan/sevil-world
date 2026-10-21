// Интерактивные панели: дерево, портфель, инструменты, карта, а также медали.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const mk = (x, y, t, p, inner) =>
  `<g transform="translate(${x},${y})"><g class="mk" tabindex="0" role="button" data-t="${esc(t)}" data-p="${esc(p)}" aria-label="${esc(t)}">${inner}</g></g>`;
const lab = (y, txt, c = INK) => `<text x="0" y="${y}" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="13" fill="${c}" stroke="#fff" stroke-width="3" paint-order="stroke">${esc(txt)}</text>`;

A.panel = (id, bg, inner) => `<g data-show="${id}">
  <rect x="14" y="104" width="372" height="392" rx="30" fill="${bg}" ${S(3)}/>
  <rect x="24" y="114" width="352" height="372" rx="24" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" opacity=".85"/>
  ${inner}</g>`;

// ---------- семейное дерево ----------
A.treePanel = () => {
  const P = CONTENT.people;
  const branches = P.map((p) => `<path d="M200 440 Q${(200 + p.pos[0]) / 2} ${(440 + p.pos[1]) / 2 + 20} ${p.pos[0]} ${p.pos[1]}" fill="none" stroke="#8d5a2b" stroke-width="8" stroke-linecap="round"/>`).join("");
  const nodes = P.map((p, i) => {
    const face = p.photo
      ? `<clipPath id="cpf${i}"><circle r="27"/></clipPath><image href="${esc(p.photo)}" x="-27" y="-27" width="54" height="54" preserveAspectRatio="xMidYMid slice" clip-path="url(#cpf${i})"/>`
      : `<text y="11" text-anchor="middle" font-size="31">${p.icon}</text>`;
    const nm = p.name ? `${p.role}: ${p.name}` : p.role;
    return mk(p.pos[0], p.pos[1], nm, p.story, `<circle r="31" fill="#fff7e0" stroke="#d9a400" stroke-width="4"/>${face}${lab(50, p.name || p.role)}`);
  }).join("");
  const me = mk(200, 432, `${CONTENT.name}`, "Это я! Я расту в любви своей семьи.", `<circle r="40" fill="#fff7e0" stroke="#ff5d3b" stroke-width="5"/><clipPath id="cpme"><circle r="35"/></clipPath><image href="img/sevil-face.jpg" x="-35" y="-35" width="70" height="70" preserveAspectRatio="xMidYMid slice" clip-path="url(#cpme)"/>${lab(58, CONTENT.name)}`);
  return A.panel("tree", "#dff6c8", `
    <g opacity=".9"><ellipse cx="200" cy="270" rx="170" ry="150" fill="#7ed66a" ${S(2.5)}/><circle cx="90" cy="190" r="60" fill="#8be67b"/><circle cx="310" cy="190" r="60" fill="#8be67b"/><circle cx="200" cy="170" r="70" fill="#9bef8a"/></g>
    <path d="M178 496 L188 440 L212 440 L222 496Z" fill="#9a6232" ${S(2.5)}/>
    ${branches}${nodes}${me}`);
};

// ---------- школьный портфель ----------
A.bagPanel = () => {
  const B = CONTENT.bag;
  const book = `<rect x="-27" y="-33" width="54" height="66" rx="5" fill="#3a86ff" ${S(2.4)}/><rect x="-27" y="-33" width="9" height="66" fill="#2563c9"/><rect x="-10" y="-20" width="30" height="20" rx="3" fill="#fff"/><path d="M-5 -12 h20 M-5 -6 h14" stroke="#3a86ff" stroke-width="2.4" stroke-linecap="round"/>`;
  const globe = `<circle r="31" fill="#4cc9f0" ${S(2.4)}/><path d="M-18 -14 Q-6 -24 4 -14 Q8 -4 -4 0 Q-14 4 -18 -6Z M8 6 Q22 2 24 14 Q16 24 8 16Z" fill="#6fd16a"/><path d="M-24 40 Q0 28 24 40" fill="none" ${S(3)}/><path d="M0 31 V38" ${S(3)}/>`;
  const note = `<rect x="-27" y="-33" width="54" height="66" rx="5" fill="#ffe066" ${S(2.4)}/><g fill="${INK}"><circle cx="-27" cy="-22" r="3"/><circle cx="-27" cy="-8" r="3"/><circle cx="-27" cy="6" r="3"/><circle cx="-27" cy="20" r="3"/></g><path d="M-14 -18 H20 M-14 -6 H20 M-14 6 H20 M-14 18 H10" stroke="#c9a227" stroke-width="2.4" stroke-linecap="round"/>`;
  const brush = `<g transform="rotate(-35)"><rect x="-5" y="-6" width="10" height="46" rx="5" fill="#c2761f" ${S(2.2)}/><rect x="-6" y="-16" width="12" height="12" fill="#c9ced6" ${S(2)}/><path d="M-6 -16 Q0 -42 6 -16Z" fill="#e8433f" ${S(2.2)}/></g><ellipse cx="22" cy="30" rx="15" ry="9" fill="#ffd23f" ${S(2.2)}/><ellipse cx="26" cy="30" rx="6" ry="3.5" fill="#fff" opacity=".6"/>`;
  const bag = `<g transform="translate(200,325)">
    <path d="M-20 -80 Q0 -108 20 -80" fill="none" ${S(6)}/>
    <path d="M-58 -64 Q0 -96 58 -64 L66 72 Q0 90 -66 72Z" fill="#ff7a1a" ${S(3)}/>
    <path d="M-58 -64 Q0 -30 58 -64" fill="#ff9a45" ${S(2.6)}/>
    <rect x="-44" y="-4" width="88" height="58" rx="14" fill="#ff9a45" ${S(2.6)}/>
    <circle cx="0" cy="22" r="13" fill="#2b6fd6" ${S(2.2)}/><circle cx="-4" cy="18" r="3" fill="#9b5de5"/><circle cx="3" cy="17" r="3" fill="#3dbb4f"/><circle cx="0" cy="25" r="3" fill="#fff"/>
    <path d="M-44 -4 H44" ${S(2)}/></g>`;
  const items = [[96, 226, book], [304, 226, globe], [96, 412, note], [304, 412, brush]]
    .map(([x, y, g], i) => mk(x, y, B[i].t, B[i].p, g + lab(52, B[i].t))).join("");
  return A.panel("bag", "#d6efff", `${bag}${items}`);
};

// ---------- комуз и кыл кыяк ----------
A.musicPanel = () => {
  const I = CONTENT.instruments;
  const komuz = `<g transform="translate(0,-18)"><rect x="-6" y="-96" width="12" height="100" rx="5" fill="#7a4a2a" ${S(2.4)}/>
    <rect x="-10" y="-112" width="20" height="22" rx="8" fill="#a8641f" ${S(2.4)}/><circle cx="-12" cy="-102" r="3" fill="#ffd23f"/><circle cx="12" cy="-102" r="3" fill="#ffd23f"/>
    <path d="M0 80 C-40 80 -44 24 -18 2 L18 2 C44 24 40 80 0 80Z" fill="#c07b3d" ${S(2.8)}/><circle cx="0" cy="44" r="11" fill="#5b3a29"/>
    <path d="M-2 -92 V70 M0 -92 V70 M2 -92 V70" stroke="#fff" stroke-width="1.2"/></g>`;
  const kyl = `<g transform="translate(0,-18)"><rect x="-5" y="-100" width="10" height="110" rx="5" fill="#7a4a2a" ${S(2.4)}/>
    <circle cx="0" cy="-108" r="10" fill="#a8641f" ${S(2.4)}/>
    <ellipse cx="0" cy="48" rx="34" ry="38" fill="#d49a52" ${S(2.8)}/><ellipse cx="0" cy="48" rx="20" ry="24" fill="#f2cf94" ${S(1.8)}/>
    <path d="M-1.5 -96 V50 M1.5 -96 V50" stroke="#fff" stroke-width="1.2"/>
    <path d="M-70 38 Q-16 -30 66 6" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/><path d="M-70 38 Q-16 -26 66 10" fill="none" stroke="#fff" stroke-width="1.6"/></g>`;
  const notes = `<g class="float" font-size="26"><text x="40" y="150">♪</text><text x="330" y="170" style="animation-delay:.7s">♫</text><text x="200" y="136">♪</text></g>`;
  return A.panel("music", "#ffe8c2", `${notes}${mk(115, 330, I[0].t, I[0].p, komuz + lab(100, I[0].t))}${mk(285, 330, I[1].t, I[1].p, kyl + lab(100, I[1].t))}`);
};

// ---------- карта (схема) ----------
A.mapPanel = () => {
  const R = CONTENT.regions;
  const outline = "M60 190 L110 160 L170 150 L205 138 L252 150 L312 140 L352 168 L372 204 L342 238 L300 252 L262 272 L232 302 L200 312 L172 332 L132 354 L96 368 L60 352 L40 322 L70 302 L96 286 L80 260 L50 236Z";
  const dots = R.map((r, i) => mk(r.pos[0], r.pos[1], r.t, r.p,
    `<circle r="15" fill="#fff" stroke="#e8112d" stroke-width="3.5"/><text y="5" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="15" fill="#e8112d">${i + 1}</text>${lab(30, r.t.replace(" область", ""))}`)).join("");
  return A.panel("map", "#fff3d6", `
    <text x="200" y="146" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="19" fill="#d93f20">Кыргызстан</text>
    <path d="${outline}" fill="#bfe6a0" stroke="#5b8f3a" stroke-width="4" stroke-linejoin="round"/>
    <path d="M120 232 Q170 218 214 238 Q250 260 232 290" fill="none" stroke="#9bd07a" stroke-width="22" stroke-linecap="round" opacity=".6"/>
    <ellipse cx="300" cy="216" rx="30" ry="8" fill="url(#lake)" stroke="#2b93e6" stroke-width="2"/>
    ${dots}
    <text x="200" y="478" text-anchor="middle" font-family="Nunito, system-ui, sans-serif" font-weight="700" font-size="11" fill="#7a5a3a">Схема, области показаны приблизительно</text>`);
};

// ---------- учитель и доска ----------
A.teacherGroup = () => `<g data-show="teachers" class="pop">
  <g transform="translate(318,440)"><rect x="-34" y="-26" width="68" height="46" rx="5" fill="#2f6f5a" ${S(2.4)}/><rect x="-38" y="18" width="76" height="6" rx="3" fill="#c07b3d" ${S(2)}/>
    <text x="0" y="3" text-anchor="middle" font-family="Nunito, system-ui" font-weight="900" font-size="16" fill="#fff">2+2=4</text></g>
  ${A.kid({ x: 262, y: 528, s: 1.0, kind: "teacher", cls: "hop" })}${A.kid({ x: 190, y: 540, s: 0.85, kind: "pupilB", cls: "hop", delay: .2 })}${A.kid({ x: 150, y: 544, s: 0.85, kind: "pupilG", cls: "hop", delay: .4 })}</g>`;

// ---------- медаль ----------
let medalId = 0;
A.medal = (m) => {
  const id = "md" + medalId++;
  return `<svg viewBox="0 0 160 200" width="150" height="188" aria-hidden="true">
  <defs><radialGradient id="${id}" cx=".35" cy=".3"><stop offset="0" stop-color="#fff6a8"/><stop offset=".6" stop-color="#ffc62b"/><stop offset="1" stop-color="#e09a00"/></radialGradient></defs>
  <path d="M40 0 L80 70 L60 78 L22 12Z" fill="${m.c1}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M120 0 L80 70 L100 78 L138 12Z" fill="${m.c2}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="80" cy="118" r="56" fill="url(#${id})" stroke="${INK}" stroke-width="4"/><circle cx="80" cy="118" r="43" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>
  <text x="80" y="134" text-anchor="middle" font-size="46">${m.icon}</text></svg>`;
};

