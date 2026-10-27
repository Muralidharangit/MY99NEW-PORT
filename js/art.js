/* ==========================================================================
   MY99EXCH – illustration set
   Inline SVG artwork in the brand palette, used for game cards, hero tiles and
   promo panels until real photography is added. Each drawing gets its own id
   prefix so gradients never clash when the same art appears more than once.
   Usage: <div class="art" data-illustration="slots"></div> + renderIllustrations()
   Suit and plane shapes are filled versions of Lucide icons (ISC licence).
   ========================================================================== */

const SUIT_PATHS = {
  spade: 'M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7ZM10.4 22.5h3.2L12 17.5Z',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  diamond: 'M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z',
};
const PLANE_PATH = 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';

const GOLD_STOPS = '<stop offset="0" stop-color="#FFE98A"/><stop offset=".45" stop-color="#FFD21C"/><stop offset="1" stop-color="#FFB000"/>';
const fmt = n => n.toFixed(1);
const polar = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];

/* ---------- Shared pieces ---------- */

// 300×300 canvas with the brand background, a purple glow and common gradients.
// `slice` lets the art fill any card ratio – keep key shapes inside x 30–270.
function artFrame(p, body, { glow = [150, 150], defs = '' } = {}) {
  return `<svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<defs>
<radialGradient id="${p}bg" cx="50%" cy="42%" r="78%"><stop offset="0" stop-color="#3B1078"/><stop offset=".55" stop-color="#1A0840"/><stop offset="1" stop-color="#08031D"/></radialGradient>
<linearGradient id="${p}gold" x1="0" y1="0" x2="0" y2="1">${GOLD_STOPS}</linearGradient>
<linearGradient id="${p}goldd" x1="0" y1="0" x2="1" y2="1">${GOLD_STOPS}</linearGradient>
<filter id="${p}blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="${p}soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
${defs}
</defs>
<rect width="300" height="300" fill="url(#${p}bg)"/>
<circle cx="${glow[0]}" cy="${glow[1]}" r="96" fill="#8B2BFF" opacity=".5" filter="url(#${p}blur)"/>
${body}
</svg>`;
}

const sparkle = (x, y, s = 1, o = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0-10C1-3 3-1 10 0 3 1 1 3 0 10-1 3-3 1-10 0-3-1-1-3 0-10Z" fill="#FFE98A" opacity="${o}"/>`;

const coin = (p, x, y, r = 12) =>
  `<ellipse cx="${x}" cy="${fmt(y + r * 0.24)}" rx="${r}" ry="${fmt(r * 0.42)}" fill="#9A6200"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${fmt(r * 0.42)}" fill="url(#${p}goldd)"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${fmt(r * 0.6)}" ry="${fmt(r * 0.24)}" fill="none" stroke="#FFF3B8" stroke-opacity=".7"/>`;

function chips(x, y, count, face, edge) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const cy = y - i * 7;
    out += `<ellipse cx="${x}" cy="${cy + 4}" rx="22" ry="8.5" fill="#0B0420"/>` +
           `<ellipse cx="${x}" cy="${cy}" rx="22" ry="8.5" fill="${face}" stroke="${edge}" stroke-width="3" stroke-dasharray="6 5"/>`;
  }
  return out + `<ellipse cx="${x}" cy="${y - (count - 1) * 7}" rx="12" ry="4.5" fill="none" stroke="${edge}" stroke-opacity=".85" stroke-width="1.5"/>`;
}

const suit = (name, x, y, size, fill) =>
  `<path transform="translate(${fmt(x - size / 2)} ${fmt(y - size / 2)}) scale(${(size / 24).toFixed(3)})" d="${SUIT_PATHS[name]}" fill="${fill}"/>`;

/* ---------- Drawings ---------- */
const ART = {
  slots(p) {
    const reels = [0, 1, 2].map(i => {
      const x = 76 + i * 52;
      return `<rect x="${x}" y="104" width="44" height="76" rx="9" fill="url(#${p}reel)"/>` +
             `<text x="${x + 22}" y="160" text-anchor="middle" font-family="Outfit, sans-serif" font-size="50" font-weight="800" fill="url(#${p}gold)" stroke="#4A148C" stroke-width="3" paint-order="stroke">7</text>`;
    }).join('');
    return artFrame(p, `
${sparkle(52, 72, 1.1)}${sparkle(250, 58, 0.8, 0.85)}${sparkle(258, 206, 0.9, 0.7)}${sparkle(40, 198, 0.6, 0.6)}
<rect x="52" y="76" width="196" height="150" rx="26" fill="url(#${p}body)" stroke="url(#${p}gold)" stroke-width="4"/>
<rect x="80" y="46" width="140" height="36" rx="18" fill="url(#${p}goldd)"/>
<text x="150" y="70" text-anchor="middle" font-family="Outfit, sans-serif" font-size="15" font-weight="800" letter-spacing="2.5" fill="#2A1500">JACKPOT</text>
<rect x="68" y="96" width="164" height="92" rx="14" fill="#0B0420" stroke="#FFD21C" stroke-opacity=".35"/>
${reels}
<line x1="70" y1="142" x2="230" y2="142" stroke="#FFD21C" stroke-width="2" stroke-dasharray="5 5" opacity=".55"/>
<rect x="92" y="198" width="116" height="12" rx="6" fill="#0B0420" stroke="#FFD21C" stroke-opacity=".3"/>
<path d="M248 132q24-6 22-46" fill="none" stroke="url(#${p}gold)" stroke-width="6" stroke-linecap="round"/>
<circle cx="270" cy="80" r="11" fill="url(#${p}goldd)"/>
<rect x="60" y="226" width="180" height="20" rx="8" fill="#1A0840" stroke="url(#${p}gold)" stroke-width="2"/>
${coin(p, 92, 262, 15)}${coin(p, 122, 274, 12)}${coin(p, 206, 266, 14)}${coin(p, 232, 282, 10)}`, {
      glow: [150, 140],
      defs: `<linearGradient id="${p}body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A1276"/><stop offset="1" stop-color="#14062B"/></linearGradient>
<linearGradient id="${p}reel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A6EE"/><stop offset=".25" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B9A6EE"/></linearGradient>`,
    });
  },

  sports(p) {
    const cx = 150, cy = 148, R = 64;
    const pentagon = (ox, oy, r, rot) =>
      'M' + [0, 1, 2, 3, 4].map(k => polar(ox, oy, r, rot + k * 72).map(fmt).join(' ')).join('L') + 'Z';
    const angles = [-90, -18, 54, 126, 198];
    const spokes = angles.map(a => {
      const [x1, y1] = polar(cx, cy, 21, a);
      const [x2, y2] = polar(cx, cy, 44, a);
      return `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`;
    }).join('');
    const patches = angles.map(a => {
      const [ox, oy] = polar(cx, cy, 62, a);
      return pentagon(ox, oy, 18, a + 180);
    }).join('');
    return artFrame(p, `
<polygon points="0,0 44,0 170,300 96,300" fill="url(#${p}beam)" opacity=".35"/>
<polygon points="300,0 256,0 130,300 204,300" fill="url(#${p}beam)" opacity=".35"/>
<circle cx="16" cy="12" r="9" fill="#FFF5CC" filter="url(#${p}soft)"/><circle cx="284" cy="12" r="9" fill="#FFF5CC" filter="url(#${p}soft)"/>
<ellipse cx="150" cy="322" rx="214" ry="92" fill="#1F0A45" stroke="#8B2BFF" stroke-opacity=".55" stroke-width="2"/>
<ellipse cx="150" cy="322" rx="72" ry="32" fill="none" stroke="#8B2BFF" stroke-opacity=".4" stroke-width="2"/>
<path d="M40 126h46M26 148h54M44 170h40" stroke="url(#${p}trail)" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="150" cy="230" rx="50" ry="9" fill="#000" opacity=".55" filter="url(#${p}soft)"/>
<g clip-path="url(#${p}clip)">
<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${p}ball)"/>
<path d="${pentagon(cx, cy, 21, -90)}${patches}" fill="#1A0B3A"/>
<path d="${spokes}" stroke="#1A0B3A" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${p}shade)"/>
</g>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#FFD21C" stroke-opacity=".45" stroke-width="1.5"/>
<ellipse cx="128" cy="116" rx="20" ry="11" fill="#FFFFFF" opacity=".35" filter="url(#${p}soft)"/>
<rect x="110" y="44" width="80" height="26" rx="13" fill="#17072F" stroke="#FFD21C" stroke-opacity=".55"/>
<circle cx="127" cy="57" r="4" fill="#FF4D6D"/>
<text x="158" y="61.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="#F8F5FF">LIVE</text>
${sparkle(250, 92, 0.7, 0.8)}${sparkle(56, 230, 0.6, 0.6)}`, {
      glow: [150, 150],
      defs: `<linearGradient id="${p}beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF5CC" stop-opacity=".9"/><stop offset="1" stop-color="#FFF5CC" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFD21C" stop-opacity="0"/><stop offset="1" stop-color="#FFD21C"/></linearGradient>
<radialGradient id="${p}ball" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E6DEFA"/><stop offset="1" stop-color="#9F8ED6"/></radialGradient>
<radialGradient id="${p}shade" cx="40%" cy="35%" r="70%"><stop offset=".55" stop-color="#2A0D55" stop-opacity="0"/><stop offset="1" stop-color="#2A0D55" stop-opacity=".75"/></radialGradient>
<clipPath id="${p}clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`,
    });
  },

  live(p) {
    const n = 37;
    let wedges = '';
    for (let i = 0; i < n; i++) {
      const a0 = (i * 360) / n - 90;
      const a1 = ((i + 1) * 360) / n - 90;
      const [x0, y0] = polar(150, 150, 90, a0);
      const [x1, y1] = polar(150, 150, 90, a1);
      const [x2, y2] = polar(150, 150, 60, a1);
      const [x3, y3] = polar(150, 150, 60, a0);
      const fill = i === 0 ? '#FFB000' : i % 2 ? '#4A1495' : '#0E0620';
      wedges += `<path d="M${fmt(x0)} ${fmt(y0)}A90 90 0 0 1 ${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}A60 60 0 0 0 ${fmt(x3)} ${fmt(y3)}Z" fill="${fill}" stroke="#FFD21C" stroke-opacity=".35" stroke-width=".6"/>`;
    }
    const spokes = [45, 135, 225, 315].map(a => {
      const [x, y] = polar(150, 150, 36, a);
      return `<line x1="150" y1="150" x2="${fmt(x)}" y2="${fmt(y)}" stroke="url(#${p}goldd)" stroke-width="5" stroke-linecap="round"/><circle cx="${fmt(x)}" cy="${fmt(y)}" r="5.5" fill="url(#${p}goldd)"/>`;
    }).join('');
    const [bx, by] = polar(150, 150, 97, 24);
    return artFrame(p, `
${sparkle(40, 128, 0.7, 0.8)}${sparkle(254, 54, 1.1, 0.85)}${sparkle(268, 168, 0.6, 0.7)}
<ellipse cx="150" cy="252" rx="124" ry="18" fill="#000" opacity=".5" filter="url(#${p}soft)"/>
<ellipse cx="150" cy="176" rx="112" ry="72" fill="#5A3A05"/>
<g transform="translate(150 162) scale(1 .64) translate(-150 -150)">
<circle cx="150" cy="150" r="112" fill="url(#${p}rim)"/>
<circle cx="150" cy="150" r="104" fill="#1D0A3D" stroke="#FFD21C" stroke-opacity=".5" stroke-width="1.5"/>
${wedges}
<circle cx="150" cy="150" r="60" fill="url(#${p}cone)" stroke="#FFD21C" stroke-opacity=".6" stroke-width="1.5"/>
${spokes}
<circle cx="150" cy="150" r="16" fill="url(#${p}goldd)"/>
<circle cx="${fmt(bx)}" cy="${fmt(by)}" r="7" fill="#FFFFFF"/>
</g>
${chips(246, 272, 4, '#8B2BFF', '#FFD21C')}${chips(54, 276, 3, '#FFD21C', '#5B1FB0')}`, {
      glow: [150, 160],
      defs: `<radialGradient id="${p}rim"><stop offset=".86" stop-color="#7A4E00"/><stop offset=".93" stop-color="#FFD21C"/><stop offset="1" stop-color="#B07800"/></radialGradient>
<radialGradient id="${p}cone" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#6A2BD0"/><stop offset="1" stop-color="#1A0B3A"/></radialGradient>`,
    });
  },

  cards(p) {
    const card = (rot, rank, suitName, color) => {
      const corner = `<text x="115" y="101" font-family="Outfit, sans-serif" font-size="21" font-weight="800" fill="${color}">${rank}</text>${suit(suitName, 121, 115, 13, color)}`;
      return `<g transform="rotate(${rot} 150 262)">
<rect x="102" y="74" width="96" height="136" rx="11" fill="url(#${p}face)" stroke="url(#${p}gold)" stroke-width="2.5"/>
${corner}${suit(suitName, 150, 146, 46, color)}
<g transform="rotate(180 150 142)">${corner}</g>
</g>`;
    };
    return artFrame(p, `
${sparkle(48, 64, 1)}${sparkle(256, 70, 0.8, 0.85)}${sparkle(262, 196, 0.6, 0.7)}
<ellipse cx="150" cy="330" rx="232" ry="112" fill="#1F0A45" stroke="#FFD21C" stroke-opacity=".25" stroke-width="2"/>
<ellipse cx="150" cy="226" rx="96" ry="12" fill="#000" opacity=".45" filter="url(#${p}soft)"/>
${card(-20, 'K', 'heart', '#D61F69')}${card(20, 'Q', 'diamond', '#D61F69')}${card(0, 'A', 'spade', '#1A0B3A')}
${chips(58, 272, 5, '#8B2BFF', '#FFD21C')}${chips(246, 276, 3, '#FFD21C', '#5B1FB0')}${coin(p, 96, 284, 11)}`, {
      glow: [150, 140],
      defs: `<linearGradient id="${p}face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9E1FF"/></linearGradient>`,
    });
  },

  aviator(p) {
    let grid = '';
    for (let x = 30; x <= 270; x += 40) grid += `M${x} 40V262`;
    for (let y = 62; y <= 262; y += 40) grid += `M20 ${y}H280`;
    const curve = 'M24 252C110 250 178 214 228 122';
    return artFrame(p, `
<path d="${grid}" stroke="#FFFFFF" stroke-opacity=".06"/>
<path d="${curve}L228 262L24 262Z" fill="url(#${p}area)"/>
<path d="${curve}" fill="none" stroke="#FFB000" stroke-width="10" stroke-linecap="round" opacity=".35" filter="url(#${p}soft)"/>
<path d="${curve}" fill="none" stroke="url(#${p}goldd)" stroke-width="4" stroke-linecap="round"/>
<circle cx="228" cy="122" r="6" fill="#FFE98A"/>
<g transform="translate(240 102) rotate(-17) scale(2.3) translate(-12 -12)"><path d="${PLANE_PATH}" fill="#F8F5FF" stroke="#FFD21C" stroke-width=".7" stroke-linejoin="round"/></g>
<text x="36" y="92" font-family="Outfit, sans-serif" font-size="46" font-weight="800" fill="url(#${p}gold)">2.45x</text>
<rect x="38" y="106" width="94" height="24" rx="12" fill="#FFD21C" fill-opacity=".12" stroke="#FFD21C" stroke-opacity=".5"/>
<text x="85" y="122" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="#FFD21C">CASH OUT</text>
<circle cx="200" cy="56" r="1.6" fill="#fff" opacity=".7"/><circle cx="256" cy="168" r="1.4" fill="#fff" opacity=".6"/><circle cx="150" cy="40" r="1.2" fill="#fff" opacity=".5"/>
${sparkle(262, 52, 0.7, 0.8)}`, {
      glow: [190, 170],
      defs: `<linearGradient id="${p}area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B2BFF" stop-opacity=".55"/><stop offset="1" stop-color="#8B2BFF" stop-opacity="0"/></linearGradient>`,
    });
  },

  gift(p) {
    return artFrame(p, `
${sparkle(54, 92, 1.1)}${sparkle(248, 86, 0.9, 0.85)}${sparkle(264, 186, 0.7, 0.7)}${sparkle(38, 176, 0.6, 0.6)}
<circle cx="150" cy="176" r="70" fill="#FFB000" opacity=".22" filter="url(#${p}blur)"/>
<ellipse cx="150" cy="254" rx="84" ry="12" fill="#000" opacity=".5" filter="url(#${p}soft)"/>
<rect x="86" y="150" width="128" height="100" rx="12" fill="url(#${p}box)"/>
<rect x="86" y="188" width="128" height="16" fill="url(#${p}goldd)"/>
<rect x="74" y="120" width="152" height="38" rx="10" fill="url(#${p}lid)"/>
<rect x="139" y="120" width="22" height="130" fill="url(#${p}gold)"/>
<path d="M150 120c-18-30-58-34-54-10 3 16 32 14 54 10Z" fill="none" stroke="url(#${p}goldd)" stroke-width="8" stroke-linejoin="round"/>
<path d="M150 120c18-30 58-34 54-10-3 16-32 14-54 10Z" fill="none" stroke="url(#${p}goldd)" stroke-width="8" stroke-linejoin="round"/>
<circle cx="150" cy="119" r="10" fill="url(#${p}goldd)"/>
${coin(p, 62, 256, 16)}${coin(p, 90, 274, 12)}${coin(p, 236, 260, 17)}${coin(p, 214, 280, 11)}`, {
      glow: [150, 170],
      defs: `<linearGradient id="${p}box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7B2BE0"/><stop offset=".5" stop-color="#3A0F7A"/><stop offset="1" stop-color="#1E0846"/></linearGradient>
<linearGradient id="${p}lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A45CFF"/><stop offset="1" stop-color="#5B1FB0"/></linearGradient>`,
    });
  },
};

let illustrationCount = 0;

/* Fill every [data-illustration] placeholder inside root with its drawing */
function renderIllustrations(root = document) {
  root.querySelectorAll('[data-illustration]').forEach(el => {
    const draw = ART[el.dataset.illustration];
    if (draw) el.innerHTML = draw(`ill${++illustrationCount}-`);
  });
}
