/* Engine for practice-question-bank/ — deliberately separate from
   assets/exam-quiz.js (own data files under practice-question-bank/data/) so the two
   banks never share progress. Each question set runs in one of two modes:

   - "exam" (the default): pick answers freely, then one "Submit exam" button
     at the end of the set grades everything at once. "Reveal answer" and
     "Mark for review" only appear on each question after submitting.
   - "reveal": the exam-question-bank behaviour — reveal each question's
     answer as you go.

   Every question also has a Flag button (top-right) that works in both modes
   and is stored separately from "marked for review".

   Progress lives in one JSON file per set (part-1.html -> data/part-1.json),
   written through server.js (npm start) — that file is
   the source of truth:
   { mode, submitted, questions: { id: { answered, displayNumber, marked, flagged, comment } } } */
(function () {
  const MODES = ['exam', 'reveal'];
  const DEFAULT_MODE = 'exam';
  const MODE_LABELS = { exam: '📝 Exam', reveal: '👁 Reveal each question' };

  // part-1.html -> data/part-1.json, resolved relative to the page.
  function dataFileUrl() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return new URL('data/' + page.replace(/\.html?$/, '') + '.json', window.location.href).href;
  }

  function showStoreError(message) {
    let banner = document.querySelector('.exam-store-error');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'exam-store-error';
      const set = document.querySelector('.exam-set');
      if (set) set.insertAdjacentElement('beforebegin', banner);
      else document.body.prepend(banner);
    }
    banner.textContent = message;
  }

  // Resolves to { data, writable }. A missing file (404) is a fresh set; any
  // other failure leaves the page usable but read-only so a bad load can
  // never overwrite the existing file with empty state.
  function loadStore() {
    if (window.location.protocol === 'file:') {
      showStoreError(
        'Progress is NOT being saved — this page was opened as a file. ' +
        'Run "npm start" in the workspace root and open it via http://127.0.0.1:8000/ instead.'
      );
      return Promise.resolve({ data: {}, writable: false });
    }
    return fetch(dataFileUrl(), { cache: 'no-store' })
      .then(function (res) {
        if (res.status === 404) return {};
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        return { data: data && typeof data === 'object' && !Array.isArray(data) ? data : {}, writable: true };
      })
      .catch(function (err) {
        showStoreError('Could not load ' + dataFileUrl() + ' (' + err.message + ') — progress is NOT being saved.');
        return { data: {}, writable: false };
      });
  }

  // PUTs are chained so a slow earlier save can never land after a newer one.
  let saveChain = Promise.resolve();
  function saveStore(store) {
    if (!store.writable) return Promise.resolve(false);
    const body = JSON.stringify(store.data);
    saveChain = saveChain.then(function () {
      return fetch(dataFileUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return true;
      }).catch(function (err) {
        showStoreError('Saving to ' + dataFileUrl() + ' failed (' + err.message + '). Is "npm start" running?');
        return false;
      });
    });
    return saveChain;
  }

  function optionLetter(li) {
    const letterEl = li.querySelector('.opt-letter');
    return letterEl ? letterEl.textContent.trim().replace('.', '') : '';
  }

  function domainName(block) {
    const el = block.querySelector('.answer-topic');
    if (!el) return 'Unlabeled';
    return el.textContent.replace(/^Domain:\s*/, '').trim() || 'Unlabeled';
  }

  function letterSet(str) {
    if (!str) return new Set();
    return new Set(String(str).split(',').map(function (s) { return s.trim(); }).filter(Boolean));
  }

  function setsEqual(a, b) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }

  function shuffledPositions(n) {
    const positions = [];
    for (let i = 1; i <= n; i++) positions.push(i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = positions[i];
      positions[i] = positions[j];
      positions[j] = tmp;
    }
    return positions;
  }

  // Fills in mode/submitted/questions and every per-question field so older
  // or hand-edited files keep working. Returns true if anything was added.
  function normalizeStore(data, blocks) {
    let dirty = false;
    if (MODES.indexOf(data.mode) === -1) { data.mode = DEFAULT_MODE; dirty = true; }
    if (typeof data.submitted !== 'boolean') { data.submitted = false; dirty = true; }
    if (!data.questions || typeof data.questions !== 'object' || Array.isArray(data.questions)) {
      data.questions = {};
      dirty = true;
    }
    const questions = data.questions;
    let maxDisplay = 0;
    Object.keys(questions).forEach(function (key) {
      if (questions[key] && typeof questions[key].displayNumber === 'number') {
        maxDisplay = Math.max(maxDisplay, questions[key].displayNumber);
      }
    });
    blocks.forEach(function (block) {
      const entry = questions[block.id];
      if (!entry || typeof entry !== 'object') {
        maxDisplay++;
        questions[block.id] = { answered: null, displayNumber: maxDisplay, marked: false, flagged: false, comment: '' };
        dirty = true;
        return;
      }
      if (typeof entry.answered !== 'string' || !entry.answered) {
        if (entry.answered !== null) dirty = true;
        entry.answered = null;
      }
      if (typeof entry.displayNumber !== 'number') { maxDisplay++; entry.displayNumber = maxDisplay; dirty = true; }
      if (typeof entry.marked !== 'boolean') { entry.marked = false; dirty = true; }
      if (typeof entry.flagged !== 'boolean') { entry.flagged = false; dirty = true; }
      if (typeof entry.comment !== 'string') { entry.comment = ''; dirty = true; }
    });
    return dirty;
  }

  function initPracticeQuestions(containerSelector, store) {
    const container = document.querySelector(containerSelector || '.exam-set');
    if (!container) return;

    const blocks = Array.from(container.querySelectorAll('.exam-block'));

    // A set covering questions 66-130 (part-2.html) sets
    // data-start-number="66" on .exam-set so block ids, #anchors and JSON
    // keys read practice-66..practice-130, matching the source PDF's numbers.
    const startNumber = parseInt(container.dataset.startNumber, 10) || 1;
    blocks.forEach(function (block, idx) {
      if (!block.id) block.id = 'practice-' + (startNumber + idx);
    });

    const data = store.data;
    const dirty = normalizeStore(data, blocks);
    const selections = data.questions;
    const pendingPicks = {};
    const blockApis = [];

    const reviewPanel = container.querySelector('.review-list-panel');
    const flagPanel = container.querySelector('.flag-list-panel');
    const submitPanel = container.querySelector('.submit-panel');
    const submitBtn = submitPanel ? submitPanel.querySelector('.submit-exam-btn') : null;
    const submitProgressEl = submitPanel ? submitPanel.querySelector('.submit-progress') : null;
    const submitResultEl = submitPanel ? submitPanel.querySelector('.submit-result') : null;

    const resultsPanel = container.querySelector('.results-panel');
    const resultsToggleBtn = resultsPanel ? resultsPanel.querySelector('.show-results-btn') : null;
    const resultsBody = resultsPanel ? resultsPanel.querySelector('.results-body') : null;
    const scoreValueEl = resultsPanel ? resultsPanel.querySelector('.results-score-value') : null;
    const progressEl = resultsPanel ? resultsPanel.querySelector('.results-progress') : null;
    const topicsListEl = resultsPanel ? resultsPanel.querySelector('.results-topics-list') : null;
    const suggestionEl = resultsPanel ? resultsPanel.querySelector('.results-suggestion') : null;

    let completionAnnounced = false;

    function isExamInProgress() { return data.mode === 'exam' && !data.submitted; }
    function isGraded() { return data.mode === 'exam' && data.submitted; }

    function isMarked(blockId) { return !!selections[blockId].marked; }
    function isFlagged(blockId) { return !!selections[blockId].flagged; }
    function isAnswered(blockId) { return !!selections[blockId].answered; }

    function countAnswered() {
      return blocks.filter(function (block) { return isAnswered(block.id); }).length;
    }

    function correctSetOf(block) {
      const revealBtn = block.querySelector('.reveal-btn');
      return letterSet(revealBtn ? revealBtn.dataset.answer : '');
    }

    function isAnsweredCorrectly(block) {
      return isAnswered(block.id) && setsEqual(correctSetOf(block), letterSet(selections[block.id].answered));
    }

    function examLabel(block) {
      const label = block.querySelector('.tag-label');
      return label ? label.textContent.trim() : block.id;
    }

    function currentDisplayOrder() {
      return blocks.slice().sort(function (a, b) {
        return selections[a.id].displayNumber - selections[b.id].displayNumber;
      });
    }

    // "Question N" is read straight from the stored displayNumber, so the
    // number on screen always matches the JSON file. Blocks are moved before
    // the submit panel so it stays at the end of the set.
    function applyDisplayOrder() {
      currentDisplayOrder().forEach(function (block) {
        container.insertBefore(block, submitPanel && submitPanel.parentNode === container ? submitPanel : null);
        const label = block.querySelector('.tag-label');
        if (label) label.textContent = 'Question ' + selections[block.id].displayNumber;
      });
    }

    // Clears answers and the submitted flag; review marks, flags and notes
    // survive. displayNumber lands in the set's real range (e.g. 66..130).
    function reshuffle() {
      const positions = shuffledPositions(blocks.length);
      blocks.forEach(function (block, i) {
        const entry = selections[block.id];
        entry.answered = null;
        entry.displayNumber = positions[i] + startNumber - 1;
      });
      data.submitted = false;
      Object.keys(pendingPicks).forEach(function (key) { delete pendingPicks[key]; });
      completionAnnounced = false;
      return saveStore(store);
    }

    function hasProgress() {
      return data.submitted || countAnswered() > 0 || Object.keys(pendingPicks).length > 0;
    }

    function closeAllAnswers() {
      blockApis.forEach(function (api) { api.setOpen(false); });
    }

    function setResultsOpen(open) {
      if (!resultsBody) return;
      if (open) renderResults();
      resultsBody.style.display = open ? 'block' : 'none';
      if (resultsToggleBtn) resultsToggleBtn.textContent = open ? 'Hide my results' : 'Show my results';
    }

    // Starts the set over in the current mode, then redraws everything.
    function restart() {
      reshuffle();
      applyDisplayOrder();
      closeAllAnswers();
      setResultsOpen(false);
      renderAll();
    }

    function resetPractice() {
      const ok = window.confirm(
        'Reset your answers so you can practice this set again?\n\n' +
        'Marked-for-review, flags and your notes will be kept.'
      );
      if (ok) restart();
    }

    // ── Mode switch (injected under .exam-count) ──
    const modeSwitch = document.createElement('div');
    modeSwitch.className = 'mode-switch';
    const modeLabel = document.createElement('span');
    modeLabel.className = 'mode-switch-label';
    modeLabel.textContent = 'Mode';
    const modeOptions = document.createElement('div');
    modeOptions.className = 'mode-switch-options';
    modeOptions.setAttribute('role', 'radiogroup');
    modeOptions.setAttribute('aria-label', 'Question set mode');
    const modeButtons = {};
    MODES.forEach(function (mode) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.dataset.mode = mode;
      btn.textContent = MODE_LABELS[mode];
      btn.addEventListener('click', function () { setMode(mode); });
      modeButtons[mode] = btn;
      modeOptions.appendChild(btn);
    });
    const modeHint = document.createElement('p');
    modeHint.className = 'mode-switch-hint';
    modeSwitch.appendChild(modeLabel);
    modeSwitch.appendChild(modeOptions);
    modeSwitch.appendChild(modeHint);

    const examCount = container.querySelector('.exam-count');
    if (examCount) examCount.insertAdjacentElement('afterend', modeSwitch);
    else container.prepend(modeSwitch);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-practice-btn';
    resetBtn.textContent = '↺ Reset My Answer';
    resetBtn.addEventListener('click', resetPractice);
    modeSwitch.insertAdjacentElement('afterend', resetBtn);

    function renderModeSwitch() {
      MODES.forEach(function (mode) {
        modeButtons[mode].setAttribute('aria-checked', data.mode === mode ? 'true' : 'false');
      });
      if (isExamInProgress()) {
        modeHint.textContent =
          'Exam mode: answer every question, then press "Submit exam" at the bottom. ' +
          'You can change answers until you submit. Your score, the correct answers, "Reveal answer" ' +
          'and "Mark for review" appear after submitting.';
      } else if (isGraded()) {
        modeHint.textContent =
          'Exam submitted — answers are locked. Green = correct answer, blue outline = your correct pick, ' +
          'red = your wrong pick. Use "Reveal answer" on any question for the explanations, or ' +
          '"Reset My Answer" to retake the set.';
      } else {
        modeHint.textContent =
          'Reveal mode: pick an answer, then press "Reveal answer" to check it straight away. ' +
          'Your pick locks once revealed.';
      }
    }

    function setMode(mode) {
      if (mode === data.mode) return;
      if (hasProgress()) {
        const ok = window.confirm(
          'Switch to ' + MODE_LABELS[mode].replace(/^\S+\s/, '') + ' mode?\n\n' +
          'This clears your current answers so the set starts fresh. ' +
          'Marked-for-review, flags and your notes will be kept.'
        );
        if (!ok) return;
        data.mode = mode;
        restart();
        return;
      }
      data.mode = mode;
      saveStore(store);
      closeAllAnswers();
      setResultsOpen(false);
      renderAll();
    }

    // ── Marked-for-review and flagged lists ──
    function renderList(panel, predicate) {
      if (!panel) return;
      const list = panel.querySelector('ul');
      const empty = panel.querySelector('.review-list-empty, .flag-list-empty');
      if (!list) return;
      list.innerHTML = '';
      const hits = currentDisplayOrder().filter(function (block) { return predicate(block.id); });
      if (empty) empty.style.display = hits.length ? 'none' : 'block';
      hits.forEach(function (block) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + block.id;
        a.textContent = examLabel(block);
        li.appendChild(a);
        list.appendChild(li);
      });
    }

    function renderReviewList() { renderList(reviewPanel, isMarked); }
    function renderFlagList() { renderList(flagPanel, isFlagged); }

    // ── Results ──
    // Reveal mode scores only answered questions; a submitted exam scores the
    // whole set, counting unanswered questions as wrong (like the real exam).
    function computeResults() {
      const graded = isGraded();
      let counted = 0;
      let correct = 0;
      const topics = {};
      blocks.forEach(function (block) {
        if (!graded && !isAnswered(block.id)) return;
        const ok = isAnsweredCorrectly(block);
        counted++;
        if (ok) correct++;
        const topic = domainName(block);
        if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
        topics[topic].total++;
        if (ok) topics[topic].correct++;
      });
      return { counted: counted, correct: correct, answered: countAnswered(), total: blocks.length, topics: topics };
    }

    function scoreText(results) {
      const pct = results.counted ? Math.round((100 * results.correct) / results.counted) : 0;
      return results.correct + ' / ' + results.counted + ' (' + pct + '%)';
    }

    function renderResults() {
      if (!resultsPanel) return;
      const results = computeResults();
      const graded = isGraded();
      if (scoreValueEl) scoreValueEl.textContent = scoreText(results);
      if (progressEl) {
        const unanswered = results.total - results.answered;
        progressEl.textContent = 'Answered ' + results.answered + ' of ' + results.total + ' questions' +
          (graded && unanswered ? ' · ' + unanswered + ' unanswered (scored as wrong)' : '');
      }
      if (!topicsListEl) return;
      topicsListEl.innerHTML = '';
      const topicEntries = Object.keys(results.topics).map(function (name) {
        const t = results.topics[name];
        return { name: name, correct: t.correct, total: t.total, pct: Math.round((100 * t.correct) / t.total) };
      });
      topicEntries.sort(function (a, b) { return a.pct - b.pct; });
      topicEntries.forEach(function (t) {
        const li = document.createElement('li');
        li.className = 'results-topic-item' + (t.pct < 70 ? ' is-weak' : '');
        li.textContent = t.name + ' — ' + t.correct + '/' + t.total + ' (' + t.pct + '%)';
        topicsListEl.appendChild(li);
      });
      if (!suggestionEl) return;
      if (results.counted === 0) {
        suggestionEl.textContent = 'Answer questions and reveal them to build up your results.';
        return;
      }
      const weakTopics = topicEntries.filter(function (t) { return t.pct < 70; });
      suggestionEl.textContent = weakTopics.length === 0
        ? 'Strong across every domain' + (graded ? '' : ' answered so far') + ' — no domain below 70%.'
        : 'Study these domains again: ' + weakTopics.map(function (t) { return t.name; }).join(', ') + '.';
    }

    function renderResultsPanel() {
      if (!resultsPanel) return;
      // Mid-exam, the score would leak which answers are right.
      resultsPanel.hidden = isExamInProgress();
      if (resultsPanel.hidden) return;
      const complete = isGraded() || (blocks.length > 0 && countAnswered() >= blocks.length);
      resultsPanel.classList.toggle('is-complete', complete);
      if (resultsBody && resultsBody.style.display === 'block') renderResults();
    }

    function maybeAnnounceCompletion() {
      if (!resultsPanel || completionAnnounced || data.mode !== 'reveal') return;
      if (countAnswered() < blocks.length) return;
      completionAnnounced = true;
      renderResultsPanel();
      setResultsOpen(true);
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (resultsToggleBtn && resultsBody) {
      resultsToggleBtn.addEventListener('click', function () {
        setResultsOpen(resultsBody.style.display !== 'block');
      });
    }

    // ── Submit panel (exam mode only) ──
    function renderSubmitPanel() {
      if (!submitPanel) return;
      submitPanel.hidden = data.mode !== 'exam';
      if (submitPanel.hidden) return;
      const answered = countAnswered();
      submitPanel.classList.toggle('is-submitted', data.submitted);
      if (submitBtn) submitBtn.hidden = data.submitted;
      if (submitProgressEl) {
        submitProgressEl.textContent = data.submitted
          ? 'Exam submitted'
          : 'Answered ' + answered + ' of ' + blocks.length + ' questions';
      }
      if (submitResultEl) {
        submitResultEl.hidden = !data.submitted;
        if (data.submitted) {
          submitResultEl.textContent = 'Score: ' + scoreText(computeResults()) +
            ' — see "Your results" at the top of the set for the per-domain breakdown.';
        }
      }
    }

    function submitExam() {
      if (!isExamInProgress()) return;
      const unanswered = blocks.length - countAnswered();
      const ok = window.confirm(unanswered
        ? 'You have ' + unanswered + ' unanswered question' + (unanswered === 1 ? '' : 's') +
          '. Unanswered questions are scored as wrong.\n\nSubmit the exam now?'
        : 'Submit the exam? Your answers lock once submitted.');
      if (!ok) return;
      data.submitted = true;
      // Same rule as reveal mode: a missed question is never left unmarked.
      blocks.forEach(function (block) {
        if (!isAnsweredCorrectly(block)) selections[block.id].marked = true;
      });
      saveStore(store);
      renderAll();
      setResultsOpen(true);
      if (resultsPanel) resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (submitBtn) submitBtn.addEventListener('click', submitExam);

    function renderAll() {
      renderModeSwitch();
      blockApis.forEach(function (api) { api.paint(); });
      renderReviewList();
      renderFlagList();
      renderResultsPanel();
      renderSubmitPanel();
    }

    // ── Per-question wiring ──
    blocks.forEach(function (block) {
      const revealBtn = block.querySelector('.reveal-btn');
      const answerPanel = block.querySelector('.answer-panel');
      const actions = block.querySelector('.exam-actions');
      const options = Array.from(block.querySelectorAll('.exam-options li'));
      const markBtn = block.querySelector('.mark-review-btn');
      const flagBtn = block.querySelector('.flag-btn');
      const tag = block.querySelector('.exam-tag');
      const isMulti = block.dataset.multi === 'true';
      const correctSet = correctSetOf(block);

      function applyMarkState() {
        const marked = isMarked(block.id);
        block.classList.toggle('marked-for-review', marked);
        if (!markBtn) return;
        markBtn.textContent = marked ? '✕ Unmark' : '🔖 Mark for review';
        markBtn.classList.toggle('is-marked', marked);
        markBtn.setAttribute('aria-pressed', marked ? 'true' : 'false');
      }

      function applyFlagState() {
        const flagged = isFlagged(block.id);
        block.classList.toggle('is-flagged', flagged);
        if (!flagBtn) return;
        flagBtn.textContent = flagged ? '🚩 Flagged' : '⚑ Flag';
        flagBtn.classList.toggle('is-flagged', flagged);
        flagBtn.setAttribute('aria-pressed', flagged ? 'true' : 'false');
        flagBtn.title = flagged ? 'Remove the flag from this question' : 'Flag this question to come back to it';
      }

      if (markBtn) {
        markBtn.addEventListener('click', function () {
          selections[block.id].marked = !isMarked(block.id);
          saveStore(store);
          applyMarkState();
          renderReviewList();
        });
      }

      if (flagBtn) {
        flagBtn.addEventListener('click', function () {
          selections[block.id].flagged = !isFlagged(block.id);
          saveStore(store);
          applyFlagState();
          renderFlagList();
        });
      }

      // "Select N" on multi-select questions, plus a ✓/✗ badge after submitting.
      let resultFlag = null;
      if (tag) {
        if (isMulti && !tag.querySelector('.multi-flag')) {
          const badge = document.createElement('span');
          badge.className = 'multi-flag';
          badge.textContent = 'Select ' + correctSet.size;
          tag.appendChild(badge);
        }
        resultFlag = document.createElement('span');
        resultFlag.className = 'result-flag';
        resultFlag.hidden = true;
        tag.appendChild(resultFlag);
      }

      // ○/● for single-select, ☐/☑ for multi-select, and a "Your answer"
      // tag that shows on each picked option once the exam is graded.
      options.forEach(function (li) {
        if (!li.querySelector('.opt-marker')) {
          const marker = document.createElement('span');
          marker.className = 'opt-marker';
          marker.textContent = isMulti ? '☐' : '○';
          const letterEl = li.querySelector('.opt-letter');
          if (letterEl) li.insertBefore(marker, letterEl);
        }
        if (!li.querySelector('.pick-tag')) {
          const pickTag = document.createElement('span');
          pickTag.className = 'pick-tag';
          pickTag.textContent = 'Your answer';
          li.appendChild(pickTag);
        }
      });

      if (answerPanel && !answerPanel.querySelector('.scenario-comment')) {
        const commentWrap = document.createElement('div');
        commentWrap.className = 'scenario-comment';

        const commentLabel = document.createElement('label');
        commentLabel.className = 'comment-label';
        commentLabel.htmlFor = block.id + '-comment';
        commentLabel.textContent = '📝 My notes (optional, saved to this set\'s JSON file)';

        const commentInput = document.createElement('textarea');
        commentInput.className = 'comment-input';
        commentInput.id = block.id + '-comment';
        commentInput.placeholder = 'Add a note about this question…';
        commentInput.value = selections[block.id].comment || '';

        const commentActions = document.createElement('div');
        commentActions.className = 'comment-actions';

        const commentAddBtn = document.createElement('button');
        commentAddBtn.type = 'button';
        commentAddBtn.className = 'comment-add-btn';
        commentAddBtn.textContent = 'Add';

        const commentStatus = document.createElement('span');
        commentStatus.className = 'comment-status';

        // Typing only edits the textarea; nothing is written until "Add",
        // which overwrites whatever comment the file held before.
        commentInput.addEventListener('input', function () {
          const saved = selections[block.id].comment || '';
          commentStatus.textContent = commentInput.value === saved ? '' : 'Unsaved changes';
        });

        commentAddBtn.addEventListener('click', function () {
          selections[block.id].comment = commentInput.value.trim();
          commentInput.value = selections[block.id].comment;
          commentStatus.textContent = 'Saving…';
          saveStore(store).then(function (ok) {
            commentStatus.textContent = ok ? 'Saved ✓' : 'Not saved';
          });
        });

        commentActions.appendChild(commentAddBtn);
        commentActions.appendChild(commentStatus);
        commentWrap.appendChild(commentLabel);
        commentWrap.appendChild(commentInput);
        commentWrap.appendChild(commentActions);
        answerPanel.appendChild(commentWrap);
      }

      function isOpen() {
        return !!answerPanel && answerPanel.classList.contains('visible');
      }

      function setOpen(open) {
        if (!answerPanel) return;
        answerPanel.classList.toggle('visible', open);
        if (revealBtn) revealBtn.textContent = open ? 'Hide answer' : 'Reveal answer';
      }

      // Reveal mode: records the pick and, if it's wrong, flags the question
      // for review in the same write so a missed question is never left unmarked.
      function commitAnswer(set) {
        selections[block.id].answered = Array.from(set).sort().join(',');
        if (!setsEqual(set, correctSet)) {
          selections[block.id].marked = true;
          applyMarkState();
          renderReviewList();
        }
        saveStore(store);
      }

      function paint() {
        const entry = selections[block.id];
        const committed = entry.answered ? letterSet(entry.answered) : null;
        const graded = isGraded();
        const inExam = isExamInProgress();
        const open = isOpen();
        const pending = pendingPicks[block.id];
        const pickable = graded ? false : inExam ? true : !committed;

        if (actions) actions.hidden = inExam;

        options.forEach(function (li) {
          const letter = optionLetter(li);
          const chosen = !!(committed && committed.has(letter));
          let selectedStyle = false;
          let correctStyle = false;
          let wrongStyle = false;
          let markerActive = false;

          if (graded) {
            correctStyle = correctSet.has(letter);
            wrongStyle = chosen && !correctSet.has(letter);
            markerActive = chosen;
          } else if (inExam) {
            selectedStyle = chosen;
            markerActive = chosen;
          } else if (committed) {
            if (open) {
              correctStyle = correctSet.has(letter);
              wrongStyle = chosen && !correctSet.has(letter);
            } else {
              selectedStyle = chosen;
            }
            markerActive = chosen;
          } else if (!open && pending && pending.has(letter)) {
            selectedStyle = true;
            markerActive = true;
          }

          li.classList.toggle('is-selected', selectedStyle);
          li.classList.toggle('is-correct', correctStyle);
          li.classList.toggle('is-wrong-selected', wrongStyle);
          li.classList.toggle('is-picked', graded && chosen);
          li.classList.toggle('selectable-option', pickable);
          li.setAttribute('tabindex', pickable ? '0' : '-1');
          li.setAttribute('aria-checked', markerActive ? 'true' : 'false');

          const marker = li.querySelector('.opt-marker');
          if (marker) {
            marker.textContent = isMulti
              ? (markerActive ? '☑' : '☐')
              : (markerActive ? '●' : '○');
          }
        });

        if (resultFlag) {
          resultFlag.hidden = !graded;
          if (graded) {
            const outcome = !committed ? 'unanswered' : setsEqual(committed, correctSet) ? 'correct' : 'wrong';
            resultFlag.className = 'result-flag is-' + outcome;
            resultFlag.textContent = { correct: '✓ Correct', wrong: '✗ Incorrect', unanswered: '– Not answered' }[outcome];
          }
        }

        applyMarkState();
        applyFlagState();
      }

      function pick(li) {
        const letter = optionLetter(li);
        const entry = selections[block.id];
        if (isGraded()) return; // locked once submitted — use Reset to retake

        if (isExamInProgress()) {
          // Exam mode: picks stay editable until the set is submitted.
          let set = letterSet(entry.answered);
          if (isMulti) {
            if (set.has(letter)) set.delete(letter); else set.add(letter);
          } else {
            set = new Set([letter]);
          }
          entry.answered = set.size ? Array.from(set).sort().join(',') : null;
          saveStore(store);
          paint();
          renderSubmitPanel();
          return;
        }

        if (isAnswered(block.id)) return; // locked once answered — use Reset to change it
        let set = pendingPicks[block.id] || new Set();
        if (isMulti) {
          if (set.has(letter)) set.delete(letter); else set.add(letter);
        } else {
          set = new Set([letter]);
        }
        pendingPicks[block.id] = set;

        if (isOpen()) {
          // Answer already open: commit immediately.
          commitAnswer(set);
          renderResultsPanel();
          maybeAnnounceCompletion();
        }
        paint();
      }

      options.forEach(function (li) {
        li.setAttribute('role', isMulti ? 'checkbox' : 'radio');
        li.addEventListener('click', function () { pick(li); });
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick(li);
          }
        });
      });

      if (revealBtn && answerPanel) {
        revealBtn.addEventListener('click', function () {
          if (isExamInProgress()) return;
          const willOpen = !isOpen();

          if (willOpen && data.mode === 'reveal' && !isAnswered(block.id)) {
            const set = pendingPicks[block.id];
            if (set && set.size > 0) commitAnswer(set);
          }

          setOpen(willOpen);
          paint();

          if (willOpen) {
            answerPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            renderResultsPanel();
            maybeAnnounceCompletion();
          }
        });
      }

      blockApis.push({ paint: paint, setOpen: setOpen });
    });

    // A fresh set (nothing answered, not submitted) gets a new question order.
    if (!hasProgress()) reshuffle();
    else if (dirty) saveStore(store);
    applyDisplayOrder();

    // Re-open the results on load if the set was already finished.
    if (isGraded() || (data.mode === 'reveal' && blocks.length > 0 && countAnswered() >= blocks.length)) {
      completionAnnounced = true;
      setResultsOpen(true);
    }
    renderAll();
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadStore().then(function (store) {
      initPracticeQuestions('.exam-set', store);
    });
  });

  window.initPracticeQuestions = initPracticeQuestions;
})();
