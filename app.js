// app.js — STEP 01 時制マスター

const state = {
  queue: [],
  fullQueue: [],
  idx: 0,
  answered: false,
  scores: {},
  wrongIds: [],
  excAllWords: [],
  excUsed: new Set(),
  excAnswer: [],
  excBSelected: null,
  excBNumOK: false
};

/* ── Utility ── */
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function assembleSentence(q) {
  let s = q.prefix ? q.prefix + ' ' : '';
  s += state.excAnswer.map(x => x.word).join(' ');
  if (q.suffix) s += /^[.,?!]/.test(q.suffix) ? q.suffix : ' ' + q.suffix;
  return s.trim();
}

/* ── Section toggle ── */
document.querySelectorAll('.sec-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('on');
    $('start-btn').disabled = !document.querySelector('.sec-card.on');
  });
});

/* ── Previous score ── */
(function loadPrev() {
  try {
    const d = JSON.parse(localStorage.getItem('tense-score'));
    if (!d) return;
    $('prev-card').style.display = '';
    $('prev-val').textContent = `${d.c}/${d.t} (${d.pct}%)`;
    if (d.wrongIds && d.wrongIds.length > 0) {
      const btn = $('home-retry-wrong-btn');
      btn.textContent = `✗ 間違えた ${d.wrongIds.length} 問だけやり直す`;
      btn.style.display = '';
    }
  } catch (_) {}
})();

$('home-retry-wrong-btn').addEventListener('click', () => {
  try {
    const d = JSON.parse(localStorage.getItem('tense-score'));
    if (!d || !d.wrongIds || !d.wrongIds.length) return;
    const allQ = Object.values(QUIZ_DATA).flat();
    const wrongQ = allQ.filter(q => d.wrongIds.includes(q.id));
    if (!wrongQ.length) return;

    state.queue     = wrongQ;
    state.fullQueue = wrongQ;
    state.idx       = 0;
    state.answered  = false;
    state.wrongIds  = [];
    state.scores    = {};
    wrongQ.forEach(item => {
      if (!state.scores[item.section])
        state.scores[item.section] = { c: 0, t: 0, name: item.sectionName };
    });
    showScreen('screen-quiz');
    renderQ();
  } catch (_) {}
});

/* ── Start ── */
$('start-btn').addEventListener('click', () => {
  const q = [];
  document.querySelectorAll('.sec-card.on').forEach(c => {
    const key = c.dataset.sec;
    if (QUIZ_DATA[key]) q.push(...QUIZ_DATA[key]);
  });
  if (!q.length) return;

  state.queue = q;
  state.fullQueue = q;
  state.idx = 0;
  state.answered = false;
  state.wrongIds = [];
  state.scores = {};
  q.forEach(item => {
    if (!state.scores[item.section])
      state.scores[item.section] = { c: 0, t: 0, name: item.sectionName };
  });

  showScreen('screen-quiz');
  renderQ();
});

/* ── Navigation ── */
$('quiz-back').addEventListener('click', () => showScreen('screen-home'));
$('home-btn').addEventListener('click', () => showScreen('screen-home'));

$('retry-btn').addEventListener('click', () => {
  state.queue = [...state.fullQueue];
  state.idx = 0;
  state.answered = false;
  state.wrongIds = [];
  Object.values(state.scores).forEach(s => { s.c = 0; s.t = 0; });
  showScreen('screen-quiz');
  renderQ();
});

$('retry-wrong-btn').addEventListener('click', () => {
  const wrongQ = state.fullQueue.filter(q => state.wrongIds.includes(q.id));
  if (!wrongQ.length) return;
  state.queue = wrongQ;
  state.fullQueue = wrongQ;
  state.idx = 0;
  state.answered = false;
  state.wrongIds = [];
  state.scores = {};
  wrongQ.forEach(item => {
    if (!state.scores[item.section])
      state.scores[item.section] = { c: 0, t: 0, name: item.sectionName };
  });
  showScreen('screen-quiz');
  renderQ();
});

/* ── Render question ── */
function renderQ() {
  const q     = state.queue[state.idx];
  const total = state.queue.length;
  const cur   = state.idx + 1;

  $('prog-txt').textContent  = `${cur} / ${total}`;
  $('prog-fill').style.width = `${(cur / total) * 100}%`;

  const tag = $('q-tag');
  tag.textContent = q.label;
  tag.className   = 'q-tag ' + q.tagClass;
  $('q-src').textContent = q.source ? `〈${q.source}〉` : '';

  $('opts').innerHTML = '';
  $('opts').style.display     = 'none';
  $('exb-zone').style.display = 'none';
  $('exc-zone').style.display = 'none';
  $('fb-card').className = 'fb-card';
  $('next-btn').className = 'next-btn';
  $('q-ja').style.display = 'none';
  state.answered = false;

  if (q.type === 'exB') {
    renderExBQ(q);
  } else if (q.type === 'exC') {
    renderExCQ(q);
  } else {
    $('opts').style.display = '';
    renderChoiceQ(q);
  }
}

/* ── Choice (FRAME / ExA) ── */
function renderChoiceQ(q) {
  const html = q.question.replace(/(\(\s*\))/g, '<span class="blank">(　　　)</span>');
  $('q-text').innerHTML = html;

  const NUMS = ['①', '②', '③', '④'];
  const container = $('opts');
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-num">${NUMS[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => selectOption(i));
    container.appendChild(btn);
  });
}

function selectOption(chosen) {
  if (state.answered) return;
  state.answered = true;

  const q    = state.queue[state.idx];
  const isOK = chosen === q.answer;
  const NUMS = ['①', '②', '③', '④'];

  state.scores[q.section].t++;
  if (isOK) state.scores[q.section].c++;
  else      state.wrongIds.push(q.id);

  const btns = $('opts').querySelectorAll('.opt-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer)    btn.classList.add('correct');
    else if (i === chosen) btn.classList.add('wrong');
  });

  showFeedback({
    isOK,
    headText:      isOK ? '✓ 正解！' : `✗ 不正解　正解: ${NUMS[q.answer]}`,
    fixText:       null,
    correctedText: null,
    traText:  q.translation ? `[訳] ${q.translation}` : null,
    expText:  q.explanation
  });
}

/* ── ExB ── */
function renderExBQ(q) {
  const NUMS = ['①', '②', '③', '④'];
  const parts = q.question.split(/([①②③④])/);

  let html = '';
  parts.forEach(part => {
    const numIdx = NUMS.indexOf(part);
    if (numIdx >= 0) {
      html += `<button class="exb-num-btn" data-idx="${numIdx}">${part}</button>`;
    } else {
      html += part;
    }
  });
  $('q-text').innerHTML = html;

  $('q-text').querySelectorAll('.exb-num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.answered) return;
      state.excBSelected = parseInt(btn.dataset.idx);
      $('q-text').querySelectorAll('.exb-num-btn').forEach(b => {
        b.classList.toggle('selected', parseInt(b.dataset.idx) === state.excBSelected);
      });
      $('exb-input-wrap').style.display = '';
      $('exb-input').focus();
      $('exb-check-btn').disabled = $('exb-input').value.trim().length === 0;
    });
  });

  state.excBSelected = null;
  state.excBNumOK   = false;
  $('exb-input-wrap').style.display = 'none';
  $('exb-input').value = '';
  $('exb-input').disabled = false;
  $('exb-phase1').style.display = '';
  $('exb-phase2').style.display = 'none';
  $('exb-check-btn').disabled = true;
  $('exb-reveal-btn').style.display = '';
  $('exb-zone').style.display = '';
}

$('exb-input').addEventListener('input', () => {
  if (state.excBSelected !== null)
    $('exb-check-btn').disabled = $('exb-input').value.trim().length === 0;
});
$('exb-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !$('exb-check-btn').disabled) $('exb-check-btn').click();
});

$('exb-check-btn').addEventListener('click', () => {
  if (state.excBSelected === null) return;

  const q          = state.queue[state.idx];
  const NUMS       = ['①', '②', '③', '④'];
  const correctNum = q.answer;
  const numOK      = state.excBSelected === correctNum;
  const correctForm = (q.correction.split('→')[1] || '').trim();

  state.excBNumOK = numOK;

  // Lock number buttons, highlight correct one
  $('q-text').querySelectorAll('.exb-num-btn').forEach(btn => {
    btn.disabled = true;
    if (parseInt(btn.dataset.idx) === correctNum) btn.classList.add('correct-ans');
  });
  $('exb-input').disabled = true;

  // Show number result
  const numResult = $('exb-num-result');
  if (numOK) {
    numResult.textContent = `✓ 番号正解: ${NUMS[state.excBSelected]}`;
    numResult.className   = 'exb-num-result ok';
  } else {
    numResult.textContent = `✗ 番号不正解（正解: ${NUMS[correctNum]}）`;
    numResult.className   = 'exb-num-result ng';
  }

  // Show comparison
  $('exb-typed-val').textContent = $('exb-input').value.trim() || '（未入力）';
  $('exb-correct-val').textContent = correctForm;

  $('exb-phase1').style.display = 'none';
  $('exb-phase2').style.display = '';
});

function resolveExB(textOK) {
  if (state.answered) return;
  state.answered = true;

  const q    = state.queue[state.idx];
  const isOK = state.excBNumOK && textOK;
  const NUMS = ['①', '②', '③', '④'];

  state.scores[q.section].t++;
  if (isOK) state.scores[q.section].c++;
  else      state.wrongIds.push(q.id);

  $('exb-phase2').style.display = 'none';

  showFeedback({
    isOK,
    headText:      isOK ? '✓ 正解！' : `✗ 不正解　正解: ${NUMS[q.answer]}`,
    fixText:       q.correction,
    correctedText: q.corrected,
    traText:  q.translation ? `[訳] ${q.translation}` : null,
    expText:  q.explanation
  });
}

$('exb-self-ok').addEventListener('click', () => resolveExB(true));
$('exb-self-ng').addEventListener('click', () => resolveExB(false));

$('exb-reveal-btn').addEventListener('click', () => {
  if (state.answered) return;
  state.answered = true;

  const q    = state.queue[state.idx];
  const NUMS = ['①', '②', '③', '④'];

  state.scores[q.section].t++;
  state.wrongIds.push(q.id);

  $('q-text').querySelectorAll('.exb-num-btn').forEach(btn => {
    btn.disabled = true;
    if (parseInt(btn.dataset.idx) === q.answer) btn.classList.add('correct-ans');
  });
  $('exb-phase1').style.display = 'none';
  $('exb-phase2').style.display = 'none';

  showFeedback({
    isOK:          false,
    headText:      `答え: ${NUMS[q.answer]}`,
    fixText:       q.correction,
    correctedText: q.corrected,
    traText:  q.translation ? `[訳] ${q.translation}` : null,
    expText:  q.explanation
  });
});

/* ── ExC ── */
function renderExCQ(q) {
  $('q-text').innerHTML = q.japanese || '語句を並べかえて英文を完成させなさい。';

  if (!q.japanese && q.translation) {
    $('q-ja').textContent   = `[意味] ${q.translation}`;
    $('q-ja').style.display = '';
  }

  $('exc-zone').style.display = '';

  let ctxHtml = '';
  if (q.prefix) ctxHtml += `${q.prefix} `;
  ctxHtml += '<span class="ctx-blank">（　　　　　　）</span>';
  if (q.suffix) ctxHtml += /^[.,?!]/.test(q.suffix) ? q.suffix : ` ${q.suffix}`;
  $('exc-ctx').innerHTML = ctxHtml;

  state.excAllWords = shuffle(q.words.map((w, i) => ({ word: w, i })));
  state.excUsed     = new Set();
  state.excAnswer   = [];

  $('check-btn').disabled = true;
  renderExCChips();
}

/* ── ExC chip rendering ── */
function renderExCChips() {
  const buildEl = $('build-area');
  const poolEl  = $('pool-area');
  const hintEl  = $('build-hint');

  [...buildEl.querySelectorAll('.wchip-ans')].forEach(el => el.remove());
  hintEl.style.display = state.excAnswer.length ? 'none' : '';

  state.excAnswer.forEach(({ word, i }, pos) => {
    const btn = makeAnswerChip(word, i, pos);
    buildEl.appendChild(btn);
  });

  poolEl.innerHTML = '';
  state.excAllWords.forEach(({ word, i }) => {
    const btn = document.createElement('button');
    btn.className   = 'wchip wchip-pool';
    btn.textContent = word;
    if (state.excUsed.has(i)) {
      btn.style.visibility = 'hidden';
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => pickWord(i));
    }
    poolEl.appendChild(btn);
  });
}

/* ── Answer chip factory with long-press drag ── */
function makeAnswerChip(word, wordI, pos) {
  const btn = document.createElement('button');
  btn.className      = 'wchip wchip-ans';
  btn.textContent    = word;
  btn.dataset.ansPos = pos;

  let timer    = null;
  let dragging = false;
  let ghost    = null;
  let startX, startY, capturedId;

  function cleanup() {
    clearTimeout(timer);
    dragging = false;
    if (ghost) { ghost.remove(); ghost = null; }
    btn.classList.remove('dragging');
  }

  btn.addEventListener('pointerdown', e => {
    if (state.answered) return;
    startX     = e.clientX;
    startY     = e.clientY;
    capturedId = e.pointerId;

    timer = setTimeout(() => {
      dragging = true;
      btn.setPointerCapture(capturedId);
      if (navigator.vibrate) navigator.vibrate(25);

      const rect = btn.getBoundingClientRect();
      ghost = document.createElement('span');
      ghost.className   = 'drag-ghost';
      ghost.textContent = word;
      ghost.style.left  = `${rect.left}px`;
      ghost.style.top   = `${rect.top}px`;
      document.body.appendChild(ghost);
      btn.classList.add('dragging');
    }, 380);
  });

  btn.addEventListener('pointermove', e => {
    if (!dragging) {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 8) clearTimeout(timer);
      return;
    }
    if (ghost) {
      ghost.style.left = `${e.clientX - ghost.offsetWidth / 2}px`;
      ghost.style.top  = `${e.clientY - ghost.offsetHeight / 2}px`;
    }
  });

  btn.addEventListener('pointerup', e => {
    if (!dragging) {
      cleanup();
      returnWord(wordI);
      return;
    }

    const fromPos = parseInt(btn.dataset.ansPos);
    const dropX   = e.clientX;
    const dropY   = e.clientY;
    cleanup();

    // getBoundingClientRect scan avoids pointer-capture hit-testing issues
    const chips = [...document.querySelectorAll('.wchip-ans')];
    let targetChip = null;

    for (const chip of chips) {
      if (chip === btn) continue;
      const r = chip.getBoundingClientRect();
      if (dropX >= r.left && dropX <= r.right && dropY >= r.top && dropY <= r.bottom) {
        targetChip = chip;
        break;
      }
    }

    // Fallback: nearest chip center within 80px
    if (!targetChip) {
      let minDist = 80;
      for (const chip of chips) {
        if (chip === btn) continue;
        const r  = chip.getBoundingClientRect();
        const cx = (r.left + r.right) / 2;
        const cy = (r.top  + r.bottom) / 2;
        const d  = Math.hypot(dropX - cx, dropY - cy);
        if (d < minDist) { minDist = d; targetChip = chip; }
      }
    }

    if (targetChip) {
      const toPos = parseInt(targetChip.dataset.ansPos);
      if (!isNaN(toPos) && fromPos !== toPos) {
        const [item] = state.excAnswer.splice(fromPos, 1);
        state.excAnswer.splice(toPos > fromPos ? toPos - 1 : toPos, 0, item);
        renderExCChips();
      }
    }
  });

  btn.addEventListener('pointercancel', cleanup);
  btn.addEventListener('contextmenu', e => e.preventDefault());

  return btn;
}

function pickWord(i) {
  if (state.excUsed.has(i)) return;
  const item = state.excAllWords.find(x => x.i === i);
  state.excUsed.add(i);
  state.excAnswer.push({ word: item.word, i });
  renderExCChips();
  $('check-btn').disabled = false;
}

function returnWord(i) {
  state.excUsed.delete(i);
  state.excAnswer = state.excAnswer.filter(x => x.i !== i);
  renderExCChips();
  if (state.excAnswer.length === 0) $('check-btn').disabled = true;
}

$('check-btn').addEventListener('click', () => {
  if (state.answered) return;
  state.answered = true;
  $('check-btn').disabled = true;

  const q         = state.queue[state.idx];
  const assembled = assembleSentence(q);
  const isOK      = normalize(assembled) === normalize(q.answer);

  state.scores[q.section].t++;
  if (isOK) state.scores[q.section].c++;
  else      state.wrongIds.push(q.id);

  showFeedback({
    isOK,
    headText:      isOK ? '✓ 正解！' : '✗ 不正解',
    fixText:       q.answer,
    correctedText: null,
    traText:       q.translation ? `[訳] ${q.translation}` : null,
    expText:       q.explanation
  });
});

/* ── Shared feedback ── */
function showFeedback({ isOK, headText, fixText, correctedText, traText, expText }) {
  const fb   = $('fb-card');
  const head = $('fb-head');
  const fix  = $('fb-fix');
  const cor  = $('fb-corrected');
  const tra  = $('fb-tra');
  const exp  = $('fb-exp');

  fb.className     = `fb-card show ${isOK ? 'ok' : 'ng'}`;
  head.className   = `fb-head ${isOK ? 'ok' : 'ng'}`;
  head.textContent = headText;

  if (fixText)       { fix.textContent = fixText; fix.style.display = 'block'; }
  else                 fix.style.display = 'none';

  if (correctedText) { cor.textContent = '✓ ' + correctedText; cor.style.display = 'block'; }
  else                 cor.style.display = 'none';

  if (traText)       { tra.textContent = traText; tra.style.display = 'block'; }
  else                 tra.style.display = 'none';

  exp.textContent = expText;
  $('next-btn').className = 'next-btn show';
  saveProgress();
}

function saveProgress() {
  try {
    const totalC = Object.values(state.scores).reduce((s, v) => s + v.c, 0);
    const totalT = Object.values(state.scores).reduce((s, v) => s + v.t, 0);
    const pct = totalT ? Math.round(totalC / totalT * 100) : 0;
    localStorage.setItem('tense-score', JSON.stringify({ c: totalC, t: totalT, pct, wrongIds: state.wrongIds }));
    $('prev-card').style.display = '';
    $('prev-val').textContent = `${totalC}/${totalT} (${pct}%)`;
    const btn = $('home-retry-wrong-btn');
    if (state.wrongIds.length > 0) {
      btn.textContent = `✗ 間違えた ${state.wrongIds.length} 問だけやり直す`;
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  } catch (_) {}
}

/* ── Next ── */
$('next-btn').addEventListener('click', () => {
  state.idx++;
  if (state.idx >= state.queue.length) {
    showResults();
  } else {
    renderQ();
    window.scrollTo(0, 0);
  }
});

/* ── Results ── */
function showResults() {
  let totalC = 0, totalT = 0;
  Object.values(state.scores).forEach(s => { totalC += s.c; totalT += s.t; });

  const pct = totalT ? Math.round(totalC / totalT * 100) : 0;
  $('score-big').textContent = `${totalC}/${totalT}`;
  $('score-pct').textContent = `${pct}%`;

  if      (pct >= 80) $('res-h2').textContent = 'クイズ完了！ 🎉';
  else if (pct >= 60) $('res-h2').textContent = 'クイズ完了！ 👍';
  else                $('res-h2').textContent = 'クイズ完了！';

  const SEC_NAMES = {
    frames: 'FRAME（例題）',
    exA:    'Exercise A（空所補充）',
    exB:    'Exercise B（誤文訂正）',
    exC:    'Exercise C（整序英作文）'
  };

  const container = $('sec-results');
  container.innerHTML = '';
  ['frames', 'exA', 'exB', 'exC'].forEach(key => {
    const s = state.scores[key];
    if (!s || s.t === 0) return;
    const p    = Math.round(s.c / s.t * 100);
    const card = document.createElement('div');
    card.className = 'sec-res';
    card.innerHTML = `
      <span class="sec-res-name">${SEC_NAMES[key]}</span>
      <div class="mini-bar"><div class="mini-fill" style="width:${p}%"></div></div>
      <span class="sec-res-score">${s.c}/${s.t}</span>`;
    container.appendChild(card);
  });

  const wrongBtn = $('retry-wrong-btn');
  if (state.wrongIds.length > 0) {
    wrongBtn.textContent   = `✗ 間違えた ${state.wrongIds.length} 問だけもう一度`;
    wrongBtn.style.display = '';
  } else {
    wrongBtn.style.display = 'none';
  }


  showScreen('screen-results');
}

/* ── Hamburger menu ── */
function openMenu() { $('menu-overlay').classList.add('show'); }
function closeMenu() { $('menu-overlay').classList.remove('show'); }

['hamburger-btn', 'hamburger-quiz', 'hamburger-res', 'hamburger-eigo'].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener('click', openMenu);
});
$('menu-close-area').addEventListener('click', closeMenu);

let currentSubject = 'grammar';

function setMenuActive(subject) {
  ['menu-grammar', 'menu-eigo', 'menu-vocab', 'menu-reading'].forEach(id => {
    $(id).classList.toggle('active', id === 'menu-' + subject);
  });
  currentSubject = subject;
}

$('menu-grammar').addEventListener('click', () => {
  setMenuActive('grammar');
  closeMenu();
  showScreen('screen-home');
});

$('menu-eigo').addEventListener('click', () => {
  setMenuActive('eigo');
  closeMenu();
  renderEigo();
  showScreen('screen-eigo');
});

$('menu-vocab').addEventListener('click', () => {
  setMenuActive('vocab');
  closeMenu();
  window.location.href = 'vocab/index.html';
});

$('eigo-back').addEventListener('click', () => showScreen('screen-home'));

/* ── Eigo screen ── */
function renderEigo() {
  const body = $('eigo-body');
  if (body.children.length > 0) return;
  EIGO_SENTENCES.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'sen-card';
    card.innerHTML = `
      <div class="sen-num">${i + 1} / ${EIGO_SENTENCES.length}</div>
      <div class="sen-en">🇬🇧 ${s.en}</div>
      <div class="sen-ja">🇯🇵 ${s.ja}</div>
      <div class="sen-grammar">📘 文法：${s.grammar}</div>`;
    body.appendChild(card);
  });
}

/* ── Reading Player (絶滅危惧種) ── */
const READING_PARAS = [
  { num: 1, text: '絶滅危惧種とは、近い将来に絶滅する可能性がある動植物のグループのことです。その種の最後の動物が死に、それ以上存在しなくなったとき、絶滅が起こります。多くの種が絶滅寸前であり、私たちが何も対策をしなければ、地球上から消えてしまうかもしれません。種が絶滅危惧種になる理由は多くありますが、最も害をもたらすのは、生息地の破壊・狩猟・乱獲といった人間の活動です。' },
  { num: 2, text: '生息地の破壊は、動物が絶滅危惧種になる主な原因です。これは二つの形で起こります。まず、人間が新しい地域に移り住む際、家や農地を建てるために木を伐採します。これにより動物の生息地、つまり植物や動物が通常生活する自然環境が破壊され、食べ物がなくなってしまいます。また、化学物質を含む工場からの汚水が川に流れ込んだり、農地で使われる農薬がその地域に住む動物を死に至らしめることもあります。' },
  { num: 3, text: '絶滅危惧種は、狩猟や漁業の結果でもあります。アラビアオリックスのような動物は、肉の高い値段のために絶滅寸前です。毛皮・骨・皮のため、またはスポーツのために殺される動物もいます。例えば、一部のアザラシはコートを作るための毛皮目的で殺され、ほぼ絶滅しかけています。トラは薬やお茶を作るために撃たれ、ワニは靴やバッグのために捕獲されます。クジラ・マグロ・サメなどの大型海洋生物は乱獲によって絶滅危惧種になっています。フカヒレスープや寿司など、人々が好む特別な料理を作るために大量に捕獲されるためです。' },
  { num: 4, text: '個人や政府は、より多くの動植物が絶滅危惧種になるのを防ぐためにどのような措置を取れるでしょうか。私たちは自然環境を汚染しないよう努め、動物の生息地を破壊する農家や企業には財政的な罰則を設けるべきです。一般市民は、アザラシの毛皮やワニ皮のバッグなど、動物の体から作られた製品を買わないことで協力できます。政府も、絶滅危惧種の狩猟・漁業・取引を法律で禁止することができます。また、より多くの絶滅危惧動物を繁殖させ、後に野生に放つ動物保護区や動物園への資金提供も可能です。私たち全員がこれらの取り組みに協力すれば、子どもたちやその子孫もこの地球を楽しめるよう、地球を守ることができます。' }
];

const rdState = {
  playing: false,
  loop: false,
  rate: 1.0,
  current: -1,
  jaVoice: null,
  voicesReady: false
};

function rdInitVoices() {
  if (typeof speechSynthesis === 'undefined') return Promise.resolve();
  if (rdState.voicesReady) return Promise.resolve();
  return new Promise(resolve => {
    const pick = () => {
      const vs = speechSynthesis.getVoices();
      rdState.jaVoice = vs.find(v => v.lang === 'ja-JP') || vs.find(v => v.lang.startsWith('ja')) || null;
      rdState.voicesReady = true;
      resolve();
    };
    const vs = speechSynthesis.getVoices();
    if (vs.length) { pick(); return; }
    speechSynthesis.addEventListener('voiceschanged', pick, { once: true });
    setTimeout(pick, 1500);
  });
}

function rdSpeak(idx) {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();

  if (idx < 0 || idx >= READING_PARAS.length) {
    if (rdState.loop) { rdSpeak(0); return; }
    rdStop(); return;
  }

  rdState.current = idx;
  rdUpdateUI();

  const u = new SpeechSynthesisUtterance(READING_PARAS[idx].text);
  u.lang = 'ja-JP';
  u.rate = rdState.rate;
  if (rdState.jaVoice) u.voice = rdState.jaVoice;

  u.onend   = () => { if (rdState.playing) rdSpeak(idx + 1); };
  u.onerror = () => { if (rdState.playing) rdSpeak(idx + 1); };
  speechSynthesis.speak(u);
}

function rdStop() {
  rdState.playing = false;
  rdState.current = -1;
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  rdUpdateUI();
}

function rdUpdateUI() {
  const playBtn = $('rd-play-btn');
  const stopBtn = $('rd-stop-btn');
  const loopBtn = $('rd-loop-btn');
  const status  = $('rd-status');
  if (!playBtn) return;

  playBtn.textContent = rdState.playing ? '▶ 再生中...' : '▶ 全文再生';
  playBtn.disabled    = rdState.playing;
  stopBtn.disabled    = !rdState.playing;
  loopBtn.classList.toggle('active', rdState.loop);
  loopBtn.textContent = rdState.loop ? '🔁 リピート ON' : '🔁 リピート';

  if (rdState.playing && rdState.current >= 0) {
    status.textContent = `段落 ${rdState.current + 1} / ${READING_PARAS.length} 読み上げ中...`;
  } else {
    status.textContent = 'タップして再生してください';
  }

  document.querySelectorAll('.para-card').forEach((el, i) => {
    el.classList.toggle('playing', rdState.playing && i === rdState.current);
    const btn = el.querySelector('.para-play-btn');
    if (!btn) return;
    const isThis = rdState.playing && i === rdState.current;
    btn.textContent = isThis ? '⏹ 停止' : '▶';
    btn.classList.toggle('stop', isThis);
  });
}

function renderReading() {
  const list = $('rd-para-list');
  if (!list) return;
  if (list.children.length > 0) { rdUpdateUI(); return; }

  READING_PARAS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'para-card';
    card.innerHTML = `
      <div class="para-header">
        <span class="para-num">段落 ${p.num}</span>
        <button class="para-play-btn">▶</button>
      </div>
      <div class="para-text">${p.text}</div>`;
    card.querySelector('.para-play-btn').addEventListener('click', async () => {
      await rdInitVoices();
      if (rdState.playing && rdState.current === i) { rdStop(); return; }
      rdState.playing = true;
      rdSpeak(i);
    });
    list.appendChild(card);
  });
}

$('reading-back').addEventListener('click', () => { rdStop(); showScreen('screen-home'); });

$('rd-play-btn').addEventListener('click', async () => {
  await rdInitVoices();
  rdState.playing = true;
  rdSpeak(0);
});

$('rd-stop-btn').addEventListener('click', rdStop);

$('rd-loop-btn').addEventListener('click', () => {
  rdState.loop = !rdState.loop;
  rdUpdateUI();
});

document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    rdState.rate = parseFloat(btn.dataset.rate);
    if (rdState.playing) {
      const cur = rdState.current;
      rdState.playing = true;
      rdSpeak(cur);
    }
  });
});

$('hamburger-reading').addEventListener('click', openMenu);

$('menu-reading').addEventListener('click', () => {
  setMenuActive('reading');
  closeMenu();
  renderReading();
  showScreen('screen-reading');
});

/* ── Handle deep-link from vocab app ── */
const _p = new URLSearchParams(location.search).get('screen');
if (_p === 'eigo') {
  renderEigo();
  showScreen('screen-eigo');
  setMenuActive('eigo');
  history.replaceState(null, '', location.pathname);
}

/* ── Service Worker ── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
