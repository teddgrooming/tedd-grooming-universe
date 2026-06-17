# Product Recommendation Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single self-contained `quiz.html` that guides new Tedd Grooming customers through 5 questions and recommends their ideal product.

**Architecture:** One HTML file with inline CSS and JS — no build step, no dependencies, no server. State lives in JS variables. A scoring weight table maps each answer to score deltas across all 9 products; highest total wins. Screens are CSS-shown/hidden `<div>` sections; transitions are JS-driven opacity fades.

**Tech Stack:** Vanilla HTML5 / CSS3 / ES6 JavaScript. No frameworks, no libraries.

## Global Constraints

- File: `C:\Claude\Game\quiz.html`
- No external dependencies (no CDN, no fonts, no images)
- Must work on mobile (touch) and desktop (mouse)
- No localStorage, no server calls
- Background: `#0a0a0a` · Primary text: `#ffffff` · Accent: `#b5a97a` · Button text: `#000000`
- Corner radius: `10px` · Card bg: `#141410` · Card border: `0.5px solid #2e2c24`
- Wordmark: `· TEDD GROOMING ·` — white, letter-spacing 2px, uppercase, 11px
- "Next" and "Retake quiz" buttons: gold bg `#b5a97a`, black text `#000`
- Product name on result: olive-gold `#b5a97a`
- "Why this works for you" label: grey `#aaa`
- All other text: white `#ffffff`

---

## File Structure

| File | Role |
|---|---|
| `C:\Claude\Game\quiz.html` | Entire quiz — HTML structure, CSS, JS all inline |

Single file. All tasks modify this one file, built up incrementally.

---

### Task 1: HTML skeleton + CSS design system

Stand up the file with all three screen containers and the complete CSS. No JS yet — screens are just visible stacked divs at this stage.

**Files:**
- Create: `C:\Claude\Game\quiz.html`

**Interfaces:**
- Produces: `#screen-intro`, `#screen-question`, `#screen-result` divs; CSS classes used by all later tasks

- [ ] **Step 1: Create `quiz.html` with this exact content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Find Your Tedd Product</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  .card {
    background: #141410;
    border: 0.5px solid #2e2c24;
    border-radius: 20px;
    padding: 28px 24px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .wordmark {
    text-align: center;
    font-size: 11px;
    color: #fff;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Progress bar */
  .prog-track {
    background: #1e1e1a;
    border-radius: 99px;
    height: 3px;
    width: 100%;
  }
  .prog-fill {
    background: #b5a97a;
    border-radius: 99px;
    height: 3px;
    width: 0%;
    transition: width 0.3s ease;
  }
  .prog-label {
    font-size: 11px;
    color: #fff;
    text-align: right;
    margin-top: 4px;
  }

  /* Question */
  .question-text {
    font-size: 17px;
    font-weight: 500;
    color: #fff;
    line-height: 1.4;
  }

  /* Options */
  .options { display: flex; flex-direction: column; gap: 10px; }
  .opt {
    background: #0e0e0b;
    border: 0.5px solid #2e2c24;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .opt.selected {
    border-color: #b5a97a;
    background: #1c1a12;
    color: #fff;
  }
  .opt:hover:not(.selected) { border-color: #4a4438; }

  /* Buttons */
  .btn {
    background: #b5a97a;
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    letter-spacing: 0.3px;
    transition: opacity 0.15s;
  }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn:not(:disabled):hover { opacity: 0.88; }

  .btn-ghost {
    background: transparent;
    color: #fff;
    border: 0.5px solid #2e2c24;
    border-radius: 10px;
    padding: 11px;
    font-size: 13px;
    cursor: pointer;
    width: 100%;
    transition: border-color 0.15s;
  }
  .btn-ghost:hover { border-color: #b5a97a; }

  /* Intro screen */
  .intro-headline {
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    text-align: center;
    line-height: 1.3;
  }
  .intro-sub {
    font-size: 14px;
    color: #aaa;
    text-align: center;
    line-height: 1.6;
  }

  /* Result screen */
  .result-badge {
    font-size: 10px;
    color: #fff;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .result-name {
    font-size: 22px;
    font-weight: 500;
    color: #b5a97a;
    margin-top: 4px;
    line-height: 1.2;
  }
  .result-detail {
    font-size: 13px;
    color: #fff;
    margin-top: 4px;
  }
  .scent-pill {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 99px;
    margin-top: 8px;
  }
  .result-divider {
    height: 0.5px;
    background: #222;
  }
  .why-label {
    font-size: 10px;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .why-text {
    font-size: 14px;
    color: #fff;
    line-height: 1.6;
    margin-top: 6px;
  }

  /* Screen visibility */
  .screen { display: none; }
  .screen.active { display: flex; flex-direction: column; gap: 20px; }

  /* Fade transition */
  .card { transition: opacity 0.2s ease; }
  .card.fading { opacity: 0; }
</style>
</head>
<body>
<div class="card">

  <!-- Intro screen -->
  <div id="screen-intro" class="screen active">
    <div class="wordmark">· TEDD GROOMING ·</div>
    <div>
      <p class="intro-headline">Find your perfect product</p>
      <p class="intro-sub" style="margin-top:10px">5 quick questions. We'll match you to the right Tedd product for your hair.</p>
    </div>
    <button class="btn" id="btn-start">Start →</button>
  </div>

  <!-- Question screen -->
  <div id="screen-question" class="screen">
    <div class="wordmark">· TEDD GROOMING ·</div>
    <div>
      <div class="prog-track"><div class="prog-fill" id="prog-fill"></div></div>
      <p class="prog-label" id="prog-label">1 of 5</p>
    </div>
    <p class="question-text" id="question-text"></p>
    <div class="options" id="options-container"></div>
    <button class="btn" id="btn-next" disabled>Next →</button>
  </div>

  <!-- Result screen -->
  <div id="screen-result" class="screen">
    <div class="wordmark">· TEDD GROOMING ·</div>
    <div id="result-content"></div>
    <button class="btn" id="btn-retake">Retake quiz</button>
  </div>

</div>
<script>
  // JS goes here in Task 2
</script>
</body>
</html>
```

- [ ] **Step 2: Open `quiz.html` in a browser and verify**

Open the file directly in Chrome/Edge. Expected:
- Dark `#0a0a0a` page background
- Gold card visible (`#141410` with gold border)
- `· TEDD GROOMING ·` wordmark at top
- "Find your perfect product" headline
- "Start →" gold button with black text
- Question and result screens are hidden (not visible)

- [ ] **Step 3: Commit**

```bash
git add C:/Claude/Game/quiz.html
git commit -m "feat: quiz HTML skeleton and CSS design system"
```

---

### Task 2: Question engine — state, navigation, progress bar

Wire up the JS state machine: questions data, answer selection, Next button, progress bar, and screen transitions.

**Files:**
- Modify: `C:\Claude\Game\quiz.html` — replace `// JS goes here in Task 2` with the JS below

**Interfaces:**
- Consumes: `#screen-intro`, `#screen-question`, `#screen-result`, `#btn-start`, `#btn-next`, `#btn-retake`, `#prog-fill`, `#prog-label`, `#question-text`, `#options-container`
- Produces: `showResult(scores)` — called after Q5 answered; `answers[]` array of selected option indices; `QUESTIONS` data structure used by Task 3 scoring

- [ ] **Step 1: Replace the `// JS goes here in Task 2` comment with this script**

```javascript
const QUESTIONS = [
  {
    text: 'How would you describe your hair thickness?',
    options: ['Thin', 'Medium', 'Thick']
  },
  {
    text: 'How does your hair behave naturally?',
    options: ['Straight & smooth', 'Wavy & a bit frizzy', 'Curly or coily']
  },
  {
    text: 'What kind of hold do you want?',
    options: ['Soft & anti-frizz (no hold)', 'Light & flexible', 'Medium — firm by end of day', 'Strong all-day hold']
  },
  {
    text: 'What finish do you prefer?',
    options: ['Natural', 'Matte', 'Wet look', 'High shine']
  },
  {
    text: "What's your biggest hair concern?",
    options: ['Dryness & frizzy', 'Volume', 'Styling']
  }
];

// State
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);

// DOM refs
const card = document.querySelector('.card');
const screens = {
  intro: document.getElementById('screen-intro'),
  question: document.getElementById('screen-question'),
  result: document.getElementById('screen-result')
};
const progFill = document.getElementById('prog-fill');
const progLabel = document.getElementById('prog-label');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const btnNext = document.getElementById('btn-next');

function showScreen(name) {
  card.classList.add('fading');
  setTimeout(() => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    card.classList.remove('fading');
  }, 200);
}

function renderQuestion(index) {
  const q = QUESTIONS[index];
  progFill.style.width = ((index / QUESTIONS.length) * 100) + '%';
  progLabel.textContent = (index + 1) + ' of ' + QUESTIONS.length;
  questionText.textContent = q.text;

  optionsContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt' + (answers[index] === i ? ' selected' : '');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectOption(index, i));
    optionsContainer.appendChild(btn);
  });

  btnNext.disabled = answers[index] === null;
}

function selectOption(qIndex, optIndex) {
  answers[qIndex] = optIndex;
  document.querySelectorAll('.opt').forEach((btn, i) => {
    btn.classList.toggle('selected', i === optIndex);
  });
  btnNext.disabled = false;
}

function advance() {
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion(currentQ);
  } else {
    // All questions answered — compute scores
    const scores = computeScores(answers);
    showResult(scores);
  }
}

function reset() {
  currentQ = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  renderQuestion(0);
  showScreen('question');
}

// Stub — implemented in Task 3
function computeScores(answers) { return new Array(9).fill(0); }
// Stub — implemented in Task 4
function showResult(scores) { showScreen('result'); }

// Event listeners
document.getElementById('btn-start').addEventListener('click', () => {
  renderQuestion(0);
  showScreen('question');
});
btnNext.addEventListener('click', advance);
document.getElementById('btn-retake').addEventListener('click', reset);
```

- [ ] **Step 2: Open `quiz.html` in browser and verify**

- Click "Start →" — fades to question screen, Q1 shown, progress bar at 0%, "1 of 5"
- Click an option — it highlights gold, Next button becomes active
- Click Next — advances to Q2, progress bar grows, "2 of 5"
- Go through all 5 — after Q5 Next, fades to result screen (blank for now)
- "Retake quiz" button resets to Q1

- [ ] **Step 3: Commit**

```bash
git add C:/Claude/Game/quiz.html
git commit -m "feat: quiz question engine with state and navigation"
```

---

### Task 3: Scoring system

Implement `computeScores(answers)` — the weight table that maps every answer to score deltas across all 9 products. Replace the stub from Task 2.

**Files:**
- Modify: `C:\Claude\Game\quiz.html` — replace `function computeScores(answers) { return new Array(9).fill(0); }`

**Interfaces:**
- Consumes: `answers[]` — array of 5 selected option indices (0-based per question)
- Produces: `computeScores(answers)` returns `scores[]` — array of 9 numbers, index matches PRODUCTS order defined in Task 4

Product index order (must match PRODUCTS in Task 4):
```
0 = Classic Pomade
1 = Moisturizing Fixer
2 = Hair Mousse
3 = Grooming Fixer
4 = Styling Clay
5 = Hairspray
6 = Mattifying Dust
7 = Fixing Pomade (parfum)
8 = Fixing Pomade (mixfruit)
```

- [ ] **Step 1: Replace the `computeScores` stub with this implementation**

```javascript
// Weight table: WEIGHTS[questionIndex][optionIndex] = [p0,p1,p2,p3,p4,p5,p6,p7,p8]
// Products:      0=ClassicPomade 1=MoisturizingFixer 2=HairMousse 3=GroomingFixer
//                4=StylingClay 5=Hairspray 6=MattifyingDust 7=FixingPomadeParf 8=FixingPomadeMix
const WEIGHTS = [
  // Q1: Hair thickness — Thin / Medium / Thick
  [
    [1, 2, 0, 2, 0, 0, 0, 0, 1],  // Thin
    [1, 1, 1, 1, 1, 1, 1, 1, 1],  // Medium
    [0, 0, 2, 0, 3, 2, 3, 2, 1]   // Thick
  ],
  // Q2: Natural behaviour — Straight & smooth / Wavy & frizzy / Curly or coily
  [
    [2, 0, 0, 1, 1, 1, 1, 2, 2],  // Straight & smooth
    [0, 2, 1, 2, 1, 0, 0, 0, 1],  // Wavy & a bit frizzy
    [0, 3, 2, 1, 0, 0, 0, 0, 0]   // Curly or coily
  ],
  // Q3: Hold — Soft & anti-frizz / Light & flexible / Medium / Strong all-day
  [
    [0, 3, 0, 2, 0, 0, 0, 0, 0],  // Soft & anti-frizz (no hold)
    [1, 2, 0, 3, 0, 0, 0, 0, 1],  // Light & flexible
    [2, 1, 1, 1, 0, 0, 0, 0, 3],  // Medium
    [0, 0, 2, 0, 3, 3, 3, 3, 0]   // Strong all-day
  ],
  // Q4: Finish — Natural / Matte / Wet look / High shine
  [
    [0, 3, 2, 2, 0, 0, 0, 0, 0],  // Natural
    [0, 0, 0, 2, 3, 0, 3, 0, 0],  // Matte
    [2, 0, 0, 0, 0, 3, 0, 3, 3],  // Wet look
    [3, 0, 0, 0, 0, 1, 0, 1, 0]   // High shine
  ],
  // Q5: Concern — Dryness & frizzy / Volume / Styling
  [
    [0, 3, 1, 2, 0, 0, 0, 0, 0],  // Dryness & frizzy
    [0, 0, 3, 0, 0, 2, 1, 0, 0],  // Volume
    [1, 0, 0, 1, 3, 1, 2, 2, 2]   // Styling
  ]
];

function computeScores(answers) {
  const scores = new Array(9).fill(0);
  answers.forEach((optIndex, qIndex) => {
    if (optIndex === null) return;
    const deltas = WEIGHTS[qIndex][optIndex];
    deltas.forEach((delta, productIndex) => {
      scores[productIndex] += delta;
    });
  });
  return scores;
}
```

- [ ] **Step 2: Open browser console and verify scores manually**

Open `quiz.html`, open DevTools console, paste and run:

```javascript
// Simulate: Thick hair, wavy, strong hold, wet look, styling
// Expected winner: Hairspray (5) or Fixing Pomade parfum (7)
console.table(computeScores([2, 1, 3, 2, 2]));

// Simulate: Thin hair, straight, light hold, natural, dryness
// Expected winner: Moisturizing Fixer (1) or Grooming Fixer (3)
console.table(computeScores([0, 0, 1, 0, 0]));

// Simulate: Medium, wavy, no hold, natural, dryness
// Expected winner: Moisturizing Fixer (1)
console.table(computeScores([1, 1, 0, 0, 0]));
```

Check that no product is stuck at 0 across different realistic answer combos. All 9 products should be reachable as a winner with some combination.

- [ ] **Step 3: Commit**

```bash
git add C:/Claude/Game/quiz.html
git commit -m "feat: quiz scoring weight table"
```

---

### Task 4: Result screen

Implement `showResult(scores)` and `PRODUCTS` data — renders the result card with product name in gold, detail line, scent pill, personalised "why" text, and handles the Fixing Pomade tie case.

**Files:**
- Modify: `C:\Claude\Game\quiz.html` — replace `function showResult(scores) { showScreen('result'); }`

**Interfaces:**
- Consumes: `scores[]` from `computeScores()`, `answers[]` global, `QUESTIONS` global
- Produces: populated `#result-content` div; calls `showScreen('result')`

- [ ] **Step 1: Replace the `showResult` stub with this implementation**

```javascript
const PRODUCTS = [
  {
    name: 'Classic Pomade',
    detail: 'Control hold · High shine · Wet look',
    scent: 'Grapeberry',
    scentBg: '#3d0d0d',
    scentColor: '#c0392b'
  },
  {
    name: 'Moisturizing Fixer',
    detail: 'Medium hold · Natural finish · 150ml pump',
    scent: 'Appleberry',
    scentBg: '#2a0f1f',
    scentColor: '#9b4f7a'
  },
  {
    name: 'Hair Mousse',
    detail: 'Firm hold · Natural finish · 160ml pump',
    scent: 'Parfum',
    scentBg: '#0a2624',
    scentColor: '#2a9d8f'
  },
  {
    name: 'Grooming Fixer',
    detail: 'Medium hold · Natural matte · 120ml spray',
    scent: 'Apple spearmint',
    scentBg: '#0f2416',
    scentColor: '#4a9e5c'
  },
  {
    name: 'Styling Clay',
    detail: 'Firm hold · Matte finish',
    scent: 'Vanilla musk',
    scentBg: '#1c1a12',
    scentColor: '#b5a97a'
  },
  {
    name: 'Hairspray',
    detail: 'Strong hold · Wet look · Finisher',
    scent: 'Parfum',
    scentBg: '#0a2624',
    scentColor: '#2a9d8f'
  },
  {
    name: 'Mattifying Dust',
    detail: 'Firm hold · Matte finish',
    scent: 'Plain vanilla',
    scentBg: '#1e1e1a',
    scentColor: '#d6cfc0'
  },
  {
    name: 'Fixing Pomade',
    detail: 'Strong hold · Fiber · Wet look',
    scent: 'Parfum',
    scentBg: '#0a2624',
    scentColor: '#2a9d8f'
  },
  {
    name: 'Fixing Pomade',
    detail: 'Medium hold · Fiber · Wet look',
    scent: 'Mixfruit',
    scentBg: '#2d1900',
    scentColor: '#e8921a'
  }
];

// Personalised "why" text — keyed by winning product index
function buildWhy(productIndex, answers) {
  const holdLabels = ['no hold needed', 'a light flexible hold', 'medium hold', 'strong all-day hold'];
  const finishLabels = ['a natural finish', 'a matte finish', 'a wet look', 'high shine'];
  const concernLabels = ['keeping hair moisturised and frizz-free', 'adding volume', 'styling and control'];

  const hold = holdLabels[answers[2]] || 'the right hold';
  const finish = finishLabels[answers[3]] || 'the right finish';
  const concern = concernLabels[answers[4]] || 'your hair concern';

  const whys = [
    `Your preference for ${finish} and classic control makes the Pomade the right call — reliable hold with a polished wet look.`,
    `With ${hold} and a focus on ${concern}, the Moisturizing Fixer keeps hair nourished and manageable without weighing it down.`,
    `You're after ${hold} and care about ${concern} — the Mousse builds structure and volume while staying soft to touch.`,
    `Light to medium hold with ${finish} suits your hair perfectly. The Grooming Fixer gives a clean, flexible finish without stiffness.`,
    `You want strong hold and a matte finish. The Styling Clay gives all-day texture and control with zero shine.`,
    `Strong hold, wet look, and finishing power — Hairspray locks your style in place and keeps it there all day.`,
    `Firm hold with a matte finish and your concern for ${concern} — Mattifying Dust absorbs oil and adds grip with no shine.`,
    `Strong hold with a fiber texture and wet look finish. The Fixing Pomade (parfum) gives serious hold with a sleek result.`,
    `Medium hold with a fiber texture and wet look finish. The Fixing Pomade (mixfruit) keeps things flexible with a defined, shiny result.`
  ];
  return whys[productIndex];
}

function productCard(p, why) {
  return `
    <div>
      <p class="result-badge">Your match</p>
      <p class="result-name">${p.name}</p>
      <p class="result-detail">${p.detail}</p>
      <span class="scent-pill" style="background:${p.scentBg};color:${p.scentColor}">${p.scent}</span>
    </div>
    <div class="result-divider"></div>
    <div>
      <p class="why-label">Why this works for you</p>
      <p class="why-text">${why}</p>
    </div>
  `;
}

function showResult(scores) {
  const resultContent = document.getElementById('result-content');
  const PARFUM_IDX = 7;
  const MIXFRUIT_IDX = 8;

  // Find winner
  const maxScore = Math.max(...scores);
  const winners = scores.map((s, i) => s === maxScore ? i : -1).filter(i => i >= 0);

  // Special tie case: both Fixing Pomades tied
  if (winners.length === 2 && winners.includes(PARFUM_IDX) && winners.includes(MIXFRUIT_IDX)) {
    resultContent.innerHTML = `
      <p class="result-badge">Your match</p>
      <p class="result-name">Fixing Pomade</p>
      <p class="result-detail">Strong fiber hold · Wet look · Pick your scent</p>
      <div style="display:flex;gap:10px;margin-top:10px">
        <span class="scent-pill" style="background:#0a2624;color:#2a9d8f">Parfum</span>
        <span class="scent-pill" style="background:#2d1900;color:#e8921a">Mixfruit</span>
      </div>
      <div class="result-divider" style="margin-top:16px"></div>
      <div>
        <p class="why-label">Why this works for you</p>
        <p class="why-text">Both Fixing Pomades suit your hair profile perfectly — same strong fiber hold and wet look finish. Pick the scent that appeals to you most.</p>
      </div>
    `;
  } else {
    // Single winner (or first among non-pomade ties)
    const idx = winners[0];
    resultContent.innerHTML = productCard(PRODUCTS[idx], buildWhy(idx, answers));
  }

  showScreen('result');
}
```

- [ ] **Step 2: Open browser and run through full quiz — verify each product is reachable**

Test these answer paths and confirm the correct product appears on the result screen:

| Answers (Q1,Q2,Q3,Q4,Q5) | Expected product |
|---|---|
| Thin, Straight, Light, Natural, Dryness | Moisturizing Fixer or Grooming Fixer |
| Medium, Straight, Medium, High shine, Styling | Classic Pomade |
| Thick, Wavy, Strong, Matte, Styling | Styling Clay |
| Thick, Straight, Strong, Wet look, Styling | Hairspray or Fixing Pomade parfum |
| Medium, Wavy, Soft anti-frizz, Natural, Dryness | Moisturizing Fixer |
| Thick, Wavy, Strong, Matte, Volume | Mattifying Dust |
| Thick, Curly, Strong, Natural, Volume | Hair Mousse |
| Medium, Straight, Medium, Wet look, Styling | Fixing Pomade mixfruit |

Click "Retake quiz" after each — confirm reset works.

- [ ] **Step 3: Commit**

```bash
git add C:/Claude/Game/quiz.html
git commit -m "feat: quiz result screen with product cards and scent pills"
```

---

### Task 5: Polish — progress bar completion, mobile, final QA

Complete the progress bar (100% on result), ensure touch works on mobile, and do a final pass.

**Files:**
- Modify: `C:\Claude\Game\quiz.html`

**Interfaces:**
- Consumes: all previous tasks
- Produces: shippable `quiz.html`

- [ ] **Step 1: Set progress bar to 100% when result shows**

In the `showResult` function, before `showScreen('result')`, add:

```javascript
progFill.style.width = '100%';
progLabel.textContent = '5 of 5';
```

- [ ] **Step 2: Add `touch-action` fix for option buttons**

In the `.opt` CSS rule, add:

```css
touch-action: manipulation;
```

This prevents the 300ms tap delay on iOS.

Also add the same to `.btn` and `.btn-ghost`.

- [ ] **Step 3: Open on mobile (or DevTools mobile emulation) and verify**

- Enable Chrome DevTools → Toggle device toolbar → iPhone 14 Pro
- Run through full quiz: tap options, tap Next, see result
- Confirm no double-tap needed, no layout overflow, text readable

- [ ] **Step 4: Final desktop QA checklist**

Walk through this checklist in the browser:

- [ ] Intro screen: wordmark, headline, sub text, Start button all visible
- [ ] Q1–Q5: each question shows correct options, progress bar advances, label updates
- [ ] Selecting a different option before Next: new option becomes gold, old deselects
- [ ] Back to Q1 after going to Q2: previous answer is still selected (state preserved)
- [ ] Result screen: product name in gold, scent pill colored correctly, why text present
- [ ] Retake: resets to Q1 with no previous answers selected
- [ ] Fixing Pomade tie case: run `answers = [1,0,2,2,2]` in console then `showResult(computeScores(answers))` — verify dual scent pills appear

- [ ] **Step 5: Commit**

```bash
git add C:/Claude/Game/quiz.html
git commit -m "feat: quiz polish — progress bar completion, mobile touch fix"
```

---

## Self-Review

**Spec coverage:**
- ✅ 5 questions with correct options (Q1 Thin/Medium/Thick, Q3 includes Soft anti-frizz, Q4 Natural/Matte/Wet look/High shine, Q5 3 options)
- ✅ 9 products with scent colors
- ✅ Result screen: badge, product name gold, detail, scent pill, why label grey, why text white, retake button gold/black
- ✅ Visual design: all color tokens correct
- ✅ Fixing Pomade tie rule: dual pill display
- ✅ Single HTML file, no dependencies
- ✅ Mobile touch support
- ✅ Fade transition between screens
- ✅ Intro screen with wordmark and headline

**Placeholder scan:** No TBDs. All code is complete. All test steps have exact verification criteria.

**Type consistency:** `computeScores` returns `number[]` of length 9. `showResult` consumes it. `PRODUCTS[idx]` index matches WEIGHTS column order — documented in both tasks.
