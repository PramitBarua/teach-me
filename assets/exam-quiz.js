/* Reusable exam-question-bank engine – supports single- AND multi-select
   questions with per-option explanations. Deliberately separate from
   assets/scenario-quiz.js (different container/class names, different
   storage) so exam-bank practice never mixes with the per-module
   scenarios.html sets.

   Answers, display order, review flags and comments live in one JSON file
   per question set (part-1.html -> data/part-1.json), written through
   server.js (npm start) — that file is the source of truth. */
(function () {
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
        return { data: data && typeof data === 'object' ? data : {}, writable: true };
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

  function examLabel(block) {
    const tag = block.querySelector('.exam-tag');
    return tag ? tag.textContent.split('·')[0].trim() : block.id;
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

  // { blockId: { answered: 'A' | 'A,E' | null, displayNumber, marked, comment } }
  function loadSelections(blocks, store) {
    const raw = store.data;
    let dirty = false;
    let maxDisplay = 0;
    Object.keys(raw).forEach(function (key) {
      if (raw[key] && typeof raw[key].displayNumber === 'number') {
        maxDisplay = Math.max(maxDisplay, raw[key].displayNumber);
      }
    });
    blocks.forEach(function (block) {
      if (!raw[block.id]) {
        maxDisplay++;
        raw[block.id] = { answered: null, displayNumber: maxDisplay, marked: false, comment: '' };
        dirty = true;
      } else {
        if (typeof raw[block.id].marked !== 'boolean') {
          raw[block.id].marked = false;
          dirty = true;
        }
        if (typeof raw[block.id].comment !== 'string') {
          raw[block.id].comment = '';
          dirty = true;
        }
      }
    });
    if (dirty) saveStore(store);
    return raw;
  }

  function initExamQuestions(containerSelector, store) {
    const container = document.querySelector(containerSelector || '.exam-set');
    if (!container) return;

    const blocks = Array.from(container.querySelectorAll('.exam-block'));

    // A file covering questions 26-50 (e.g. part-2.html) sets
    // data-start-number="26" on .exam-set so block ids, #anchors, and
    // JSON keys read exam-26..exam-50 (matching the source images'
    // question numbers) instead of restarting at exam-1. Blocks are always
    // in original document order here (a fresh page load re-parses the
    // static HTML before any shuffle-driven reordering happens), so idx
    // reliably maps to each question's position in the source file.
    const startNumber = parseInt(container.dataset.startNumber, 10) || 1;

    blocks.forEach(function (block, idx) {
      if (!block.id) block.id = 'exam-' + (startNumber + idx);
    });

    const selections = loadSelections(blocks, store);
    const pendingPicks = {};

    const reviewPanel = container.querySelector('.review-list-panel');
    const reviewList = reviewPanel ? reviewPanel.querySelector('.review-list-items') : null;
    const reviewEmpty = reviewPanel ? reviewPanel.querySelector('.review-list-empty') : null;

    const resultsPanel = container.querySelector('.results-panel');
    const resultsToggleBtn = resultsPanel ? resultsPanel.querySelector('.show-results-btn') : null;
    const resultsBody = resultsPanel ? resultsPanel.querySelector('.results-body') : null;
    const scoreValueEl = resultsPanel ? resultsPanel.querySelector('.results-score-value') : null;
    const progressEl = resultsPanel ? resultsPanel.querySelector('.results-progress') : null;
    const topicsListEl = resultsPanel ? resultsPanel.querySelector('.results-topics-list') : null;
    const suggestionEl = resultsPanel ? resultsPanel.querySelector('.results-suggestion') : null;

    let completionAnnounced = false;
    const blockPainters = [];

    function isMarked(blockId) {
      const entry = selections[blockId];
      return !!(entry && entry.marked);
    }

    function isAnswered(blockId) {
      const entry = selections[blockId];
      return !!(entry && entry.answered);
    }

    function countAnswered() {
      return blocks.filter(function (block) { return isAnswered(block.id); }).length;
    }

    function currentDisplayOrder() {
      return blocks.slice().sort(function (a, b) {
        const da = selections[a.id] ? selections[a.id].displayNumber : 0;
        const db = selections[b.id] ? selections[b.id].displayNumber : 0;
        return da - db;
      });
    }

    // The rendered "Question N" label is read directly from each block's
    // stored displayNumber (not recomputed from its position), so the
    // number on screen always matches what's actually persisted in the
    // JSON file.
    function applyDisplayOrder() {
      const ordered = currentDisplayOrder();
      ordered.forEach(function (block) {
        container.appendChild(block);
        const tag = block.querySelector('.exam-tag');
        if (tag) {
          const badge = tag.querySelector('.multi-flag');
          const num = selections[block.id] ? selections[block.id].displayNumber : '?';
          tag.firstChild.textContent = 'Question ' + num + ' ';
          if (badge) tag.appendChild(badge);
        }
      });
      return ordered;
    }

    // shuffledPositions always returns a 1..n permutation; offsetting by
    // startNumber here means the persisted displayNumber itself lands in
    // the file's real question-number range (e.g. 26..50 for part-2.html)
    // instead of always being a file-relative 1..n rank.
    function reshuffle() {
      const positions = shuffledPositions(blocks.length);
      blocks.forEach(function (block, i) {
        const prev = selections[block.id];
        selections[block.id] = {
          answered: null,
          displayNumber: positions[i] + startNumber - 1,
          marked: !!(prev && prev.marked),
          comment: prev && prev.comment ? prev.comment : ''
        };
      });
      saveStore(store);
    }

    if (countAnswered() === 0) {
      reshuffle();
    }
    applyDisplayOrder();

    function resetPractice() {
      const ok = window.confirm(
        'Reset your selections so you can practice this set again?\n\n' +
        'Marked-for-review flags and your notes will be kept.'
      );
      if (!ok) return;

      reshuffle();
      Object.keys(pendingPicks).forEach(function (key) { delete pendingPicks[key]; });
      completionAnnounced = false;

      applyDisplayOrder();

      blocks.forEach(function (block) {
        const answerPanel = block.querySelector('.answer-panel');
        const revealBtn = block.querySelector('.reveal-btn');
        if (answerPanel) answerPanel.classList.remove('visible');
        if (revealBtn) revealBtn.textContent = 'Reveal answer';
      });
      blockPainters.forEach(function (paint) { paint(); });
      renderReviewList();

      if (resultsPanel) {
        resultsPanel.classList.remove('is-complete');
        if (resultsBody) resultsBody.style.display = 'none';
        if (resultsToggleBtn) resultsToggleBtn.textContent = 'Show my results';
      }
    }

    const examCount = container.querySelector('.exam-count');
    if (examCount && !container.querySelector('.reset-practice-btn')) {
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'reset-practice-btn';
      resetBtn.textContent = '↺ Reset My Answer';
      resetBtn.addEventListener('click', resetPractice);
      examCount.insertAdjacentElement('afterend', resetBtn);
    }

    function renderReviewList() {
      if (!reviewList) return;
      reviewList.innerHTML = '';

      if (!blocks.some(function (block) { return isMarked(block.id); })) {
        if (reviewEmpty) reviewEmpty.style.display = 'block';
        return;
      }
      if (reviewEmpty) reviewEmpty.style.display = 'none';

      currentDisplayOrder().forEach(function (block) {
        if (!isMarked(block.id)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + block.id;
        a.textContent = examLabel(block);
        li.appendChild(a);
        reviewList.appendChild(li);
      });
    }

    function applyMarkState(block, markBtn) {
      const marked = isMarked(block.id);
      block.classList.toggle('marked-for-review', marked);
      if (!markBtn) return;
      markBtn.textContent = marked ? '✕ Unmark' : '🔖 Mark for review';
      markBtn.classList.toggle('is-marked', marked);
      markBtn.setAttribute('aria-pressed', marked ? 'true' : 'false');
    }

    function computeResults() {
      let totalAnswered = 0;
      let totalCorrect = 0;
      const topics = {};

      blocks.forEach(function (block) {
        if (!isAnswered(block.id)) return;
        const revealBtn = block.querySelector('.reveal-btn');
        const correctSet = letterSet(revealBtn ? revealBtn.dataset.answer : '');
        const pickedSet = letterSet(selections[block.id].answered);

        totalAnswered++;
        const isCorrect = setsEqual(correctSet, pickedSet);
        if (isCorrect) totalCorrect++;

        const topic = domainName(block);
        if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
        topics[topic].total++;
        if (isCorrect) topics[topic].correct++;
      });

      return {
        totalAnswered: totalAnswered,
        totalCorrect: totalCorrect,
        totalBlocks: blocks.length,
        topics: topics
      };
    }

    function renderResults() {
      if (!resultsPanel) return;
      const results = computeResults();
      const pct = results.totalAnswered ? Math.round((100 * results.totalCorrect) / results.totalAnswered) : 0;

      if (scoreValueEl) {
        scoreValueEl.textContent = results.totalCorrect + ' / ' + results.totalAnswered + ' (' + pct + '%)';
      }
      if (progressEl) {
        progressEl.textContent = 'Answered ' + results.totalAnswered + ' of ' + results.totalBlocks + ' questions';
      }

      if (topicsListEl) {
        topicsListEl.innerHTML = '';
        const topicEntries = Object.keys(results.topics).map(function (name) {
          const t = results.topics[name];
          return {
            name: name,
            correct: t.correct,
            total: t.total,
            pct: Math.round((100 * t.correct) / t.total)
          };
        });
        topicEntries.sort(function (a, b) { return a.pct - b.pct; });
        topicEntries.forEach(function (t) {
          const li = document.createElement('li');
          li.className = 'results-topic-item' + (t.pct < 70 ? ' is-weak' : '');
          li.textContent = t.name + ' — ' + t.correct + '/' + t.total + ' (' + t.pct + '%)';
          topicsListEl.appendChild(li);
        });

        if (suggestionEl) {
          if (results.totalAnswered === 0) {
            suggestionEl.textContent = 'Answer questions and reveal them to build up your results.';
          } else {
            const weakTopics = topicEntries.filter(function (t) { return t.pct < 70; });
            if (weakTopics.length === 0) {
              suggestionEl.textContent = 'Strong across every domain answered so far — no domain below 70%.';
            } else {
              suggestionEl.textContent =
                'Study these domains again: ' + weakTopics.map(function (t) { return t.name; }).join(', ') + '.';
            }
          }
        }
      }
    }

    function maybeAnnounceCompletion() {
      if (!resultsPanel || completionAnnounced) return;
      if (countAnswered() < blocks.length) return;
      completionAnnounced = true;
      renderResults();
      resultsBody.style.display = 'block';
      resultsPanel.classList.add('is-complete');
      if (resultsToggleBtn) resultsToggleBtn.textContent = 'Hide my results';
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (resultsToggleBtn && resultsBody) {
      const allAnswered = blocks.length > 0 && countAnswered() >= blocks.length;
      resultsPanel.classList.toggle('is-complete', allAnswered);
      if (allAnswered) {
        renderResults();
        resultsBody.style.display = 'block';
        resultsToggleBtn.textContent = 'Hide my results';
        completionAnnounced = true;
      }
      resultsToggleBtn.addEventListener('click', function () {
        const isOpen = resultsBody.style.display === 'block';
        if (isOpen) {
          resultsBody.style.display = 'none';
          resultsToggleBtn.textContent = 'Show my results';
        } else {
          renderResults();
          resultsBody.style.display = 'block';
          resultsToggleBtn.textContent = 'Hide my results';
        }
      });
    }

    blocks.forEach(function (block) {
      const revealBtn = block.querySelector('.reveal-btn');
      const answerPanel = block.querySelector('.answer-panel');
      const options = block.querySelectorAll('.exam-options li');
      const markBtn = block.querySelector('.mark-review-btn');
      const isMulti = block.dataset.multi === 'true';

      applyMarkState(block, markBtn);

      if (markBtn) {
        markBtn.addEventListener('click', function () {
          selections[block.id].marked = !isMarked(block.id);
          saveStore(store);
          applyMarkState(block, markBtn);
          renderReviewList();
        });
      }

      if (!revealBtn || !answerPanel) return;
      const correctSet = letterSet(revealBtn.dataset.answer);

      // Auto-inject a "Select N" badge on multi-select questions so the
      // interaction (checkbox vs. single-pick) is obvious before reading
      // the full question text.
      if (isMulti) {
        const tag = block.querySelector('.exam-tag');
        if (tag && !tag.querySelector('.multi-flag')) {
          const badge = document.createElement('span');
          badge.className = 'multi-flag';
          badge.textContent = 'Select ' + correctSet.size;
          tag.appendChild(badge);
        }
      }

      // Add a marker glyph (○/● for single-select, ☐/☑ for multi-select) to
      // every option so the pick affordance is visually unambiguous.
      options.forEach(function (li) {
        if (!li.querySelector('.opt-marker')) {
          const marker = document.createElement('span');
          marker.className = 'opt-marker';
          marker.textContent = isMulti ? '☐' : '○';
          const letterEl = li.querySelector('.opt-letter');
          if (letterEl) li.insertBefore(marker, letterEl);
        }
      });

      if (!answerPanel.querySelector('.scenario-comment')) {
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

      // Records the pick and, if it's wrong, flags the question for review in
      // the same write so a missed question is never left unmarked.
      function commitAnswer(set) {
        selections[block.id].answered = Array.from(set).sort().join(',');
        if (!setsEqual(set, correctSet)) {
          selections[block.id].marked = true;
          applyMarkState(block, markBtn);
          renderReviewList();
        }
        saveStore(store);
      }

      function paint() {
        const isOpen = answerPanel.classList.contains('visible');
        const committedSet = selections[block.id] && selections[block.id].answered
          ? letterSet(selections[block.id].answered)
          : null;
        const pendingSet = pendingPicks[block.id];

        options.forEach(function (li) {
          const letter = optionLetter(li);
          let selectedStyle = false;
          let correctStyle = false;
          let wrongStyle = false;
          let markerActive = false;

          if (committedSet) {
            if (isOpen) {
              correctStyle = correctSet.has(letter);
              wrongStyle = committedSet.has(letter) && !correctSet.has(letter);
            } else {
              selectedStyle = committedSet.has(letter);
            }
            markerActive = committedSet.has(letter);
          } else if (!isOpen && pendingSet && pendingSet.has(letter)) {
            selectedStyle = true;
            markerActive = true;
          }

          li.classList.toggle('is-selected', selectedStyle);
          li.classList.toggle('is-correct', correctStyle);
          li.classList.toggle('is-wrong-selected', wrongStyle);

          const marker = li.querySelector('.opt-marker');
          if (marker) {
            marker.textContent = isMulti
              ? (markerActive ? '☑' : '☐')
              : (markerActive ? '●' : '○');
          }
        });
      }
      blockPainters.push(paint);

      options.forEach(function (li) {
        li.classList.add('selectable-option');
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', isMulti ? 'checkbox' : 'radio');
        function pick() {
          if (isAnswered(block.id)) return; // locked once answered — use Reset to change it
          const letter = optionLetter(li);
          let set = pendingPicks[block.id] || new Set();
          if (isMulti) {
            if (set.has(letter)) set.delete(letter); else set.add(letter);
          } else {
            set = new Set([letter]);
          }
          pendingPicks[block.id] = set;

          if (answerPanel.classList.contains('visible')) {
            // Answer already open: commit immediately, same as scenario-quiz.
            commitAnswer(set);
            if (resultsPanel && resultsBody.style.display === 'block') renderResults();
            maybeAnnounceCompletion();
          }
          paint();
        }
        li.addEventListener('click', pick);
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick();
          }
        });
      });

      revealBtn.addEventListener('click', function () {
        const willOpen = !answerPanel.classList.contains('visible');

        if (willOpen && !isAnswered(block.id)) {
          const set = pendingPicks[block.id];
          if (set && set.size > 0) {
            commitAnswer(set);
          }
        }

        answerPanel.classList.toggle('visible', willOpen);
        revealBtn.textContent = willOpen ? 'Hide answer' : 'Reveal answer';
        paint();

        if (willOpen) {
          answerPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          if (resultsPanel && resultsBody.style.display === 'block') {
            renderResults();
          }
          maybeAnnounceCompletion();
        }
      });

      paint();
    });

    renderReviewList();
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadStore().then(function (store) {
      initExamQuestions('.exam-set', store);
    });
  });

  window.initExamQuestions = initExamQuestions;
})();
