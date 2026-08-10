/* Reusable scenario-question engine – chapter-level exam practice */
(function () {
  function storageKey(kind) {
    return 'scenario' + kind + ':' + window.location.pathname;
  }

  function loadSet(kind) {
    try {
      return new Set(JSON.parse(localStorage.getItem(storageKey(kind)) || '[]'));
    } catch (e) {
      return new Set();
    }
  }

  function saveSet(kind, set) {
    try {
      localStorage.setItem(storageKey(kind), JSON.stringify(Array.from(set)));
    } catch (e) {
      /* localStorage unavailable — state just won't persist across reloads */
    }
  }

  function loadMap(kind) {
    try {
      return JSON.parse(localStorage.getItem(storageKey(kind)) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveMap(kind, map) {
    try {
      localStorage.setItem(storageKey(kind), JSON.stringify(map));
    } catch (e) {
      /* localStorage unavailable — state just won't persist across reloads */
    }
  }

  function scenarioLabel(block) {
    const tag = block.querySelector('.scenario-tag');
    return tag ? tag.textContent.split('·')[0].trim() : block.id;
  }

  function optionLetter(li) {
    const letterEl = li.querySelector('.opt-letter');
    return letterEl ? letterEl.textContent.trim().replace('.', '') : '';
  }

  function topicName(block) {
    const topicEl = block.querySelector('.answer-topic');
    if (!topicEl) return 'Unlabeled';
    return topicEl.textContent.replace(/^Topic:\s*/, '').trim() || 'Unlabeled';
  }

  function initScenarios(containerSelector) {
    const container = document.querySelector(containerSelector || '.scenario-set');
    if (!container) return;

    const blocks = container.querySelectorAll('.scenario-block');
    const marks = loadSet('ReviewMarks');
    const comments = loadMap('Comments');

    // Sole source of truth for "answered" state. An entry only exists for a
    // block once the user has both picked an option and revealed the answer —
    // see isAnswered()/commit() below. Picks made but never revealed are kept
    // only in the in-memory `pendingPicks` map and do not survive a reload.
    const selections = loadMap('Selections');
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

    function isAnswered(blockId) {
      return Object.prototype.hasOwnProperty.call(selections, blockId);
    }

    function resetPractice() {
      const ok = window.confirm(
        'Reset your selections so you can practice this set again?\n\n' +
        'Marked-for-review flags and your notes will be kept.'
      );
      if (!ok) return;

      Object.keys(selections).forEach(function (key) { delete selections[key]; });
      saveMap('Selections', selections);
      Object.keys(pendingPicks).forEach(function (key) { delete pendingPicks[key]; });
      completionAnnounced = false;

      blocks.forEach(function (block) {
        const answerPanel = block.querySelector('.answer-panel');
        const revealBtn = block.querySelector('.reveal-btn');
        if (answerPanel) answerPanel.classList.remove('visible');
        if (revealBtn) revealBtn.textContent = 'Reveal answer';
      });
      blockPainters.forEach(function (paint) { paint(); });

      if (resultsPanel) {
        resultsPanel.classList.remove('is-complete');
        if (resultsBody) resultsBody.style.display = 'none';
        if (resultsToggleBtn) resultsToggleBtn.textContent = 'Show my results';
      }
    }

    const scenarioCount = container.querySelector('.scenario-count');
    if (scenarioCount && !container.querySelector('.reset-practice-btn')) {
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'reset-practice-btn';
      resetBtn.textContent = '↺ Reset My Answer';
      resetBtn.addEventListener('click', resetPractice);
      scenarioCount.insertAdjacentElement('afterend', resetBtn);
    }

    function renderReviewList() {
      if (!reviewList) return;
      reviewList.innerHTML = '';

      if (marks.size === 0) {
        if (reviewEmpty) reviewEmpty.style.display = 'block';
        return;
      }
      if (reviewEmpty) reviewEmpty.style.display = 'none';

      blocks.forEach(function (block) {
        if (!marks.has(block.id)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + block.id;
        a.textContent = scenarioLabel(block);
        li.appendChild(a);
        reviewList.appendChild(li);
      });
    }

    function applyMarkState(block, markBtn) {
      const marked = marks.has(block.id);
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
        const correctLetter = revealBtn ? revealBtn.dataset.answer : null;
        const selected = selections[block.id];

        totalAnswered++;
        const isCorrect = selected === correctLetter;
        if (isCorrect) totalCorrect++;

        const topic = topicName(block);
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
        topicEntries.sort(function (a, b) {
          return a.pct - b.pct;
        });
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
            const weakTopics = topicEntries.filter(function (t) {
              return t.pct < 70;
            });
            if (weakTopics.length === 0) {
              suggestionEl.textContent = 'Strong across every topic answered so far — no topic below 70%.';
            } else {
              suggestionEl.textContent =
                'Study these topics again: ' + weakTopics.map(function (t) { return t.name; }).join(', ') + '.';
            }
          }
        }
      }
    }

    function maybeAnnounceCompletion() {
      if (!resultsPanel || completionAnnounced) return;
      if (Object.keys(selections).length < blocks.length) return;
      completionAnnounced = true;
      renderResults();
      resultsBody.style.display = 'block';
      resultsPanel.classList.add('is-complete');
      if (resultsToggleBtn) resultsToggleBtn.textContent = 'Hide my results';
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (resultsToggleBtn && resultsBody) {
      const allAnswered = blocks.length > 0 && Object.keys(selections).length >= blocks.length;
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

    blocks.forEach(function (block, idx) {
      if (!block.id) block.id = 'scenario-' + (idx + 1);

      const revealBtn = block.querySelector('.reveal-btn');
      const answerPanel = block.querySelector('.answer-panel');
      const options = block.querySelectorAll('.scenario-options li');
      const markBtn = block.querySelector('.mark-review-btn');

      applyMarkState(block, markBtn);

      if (markBtn) {
        markBtn.addEventListener('click', function () {
          if (marks.has(block.id)) {
            marks.delete(block.id);
          } else {
            marks.add(block.id);
          }
          saveSet('ReviewMarks', marks);
          applyMarkState(block, markBtn);
          renderReviewList();
        });
      }

      if (!revealBtn || !answerPanel) return;
      const correctLetter = revealBtn.dataset.answer;

      if (!answerPanel.querySelector('.scenario-comment')) {
        const commentWrap = document.createElement('div');
        commentWrap.className = 'scenario-comment';

        const commentLabel = document.createElement('label');
        commentLabel.className = 'comment-label';
        commentLabel.htmlFor = block.id + '-comment';
        commentLabel.textContent = '📝 My notes (optional, saved locally)';

        const commentInput = document.createElement('textarea');
        commentInput.className = 'comment-input';
        commentInput.id = block.id + '-comment';
        commentInput.placeholder = 'Add a note about this question…';
        commentInput.value = comments[block.id] || '';

        commentInput.addEventListener('input', function () {
          const val = commentInput.value;
          if (val) {
            comments[block.id] = val;
          } else {
            delete comments[block.id];
          }
          saveMap('Comments', comments);
        });

        commentWrap.appendChild(commentLabel);
        commentWrap.appendChild(commentInput);
        answerPanel.appendChild(commentWrap);
      }

      // Paints option colors purely from current state — no history is
      // consulted beyond what's in `selections` and the panel's own
      // open/closed class, so the same rules apply whether this is a fresh
      // page load or a live toggle:
      //   - not answered                    -> no highlight
      //   - answered, panel hidden ("Reveal answer" showing) -> blue on the pick
      //   - answered, panel open ("Hide answer" showing)     -> green on correct,
      //                                                          red on a wrong pick
      function paint() {
        const isOpen = answerPanel.classList.contains('visible');
        const committed = selections[block.id];
        const pending = pendingPicks[block.id];

        options.forEach(function (li) {
          const letter = optionLetter(li);
          let selectedStyle = false;
          let correctStyle = false;
          let wrongStyle = false;

          if (committed) {
            if (isOpen) {
              correctStyle = letter === correctLetter;
              wrongStyle = letter === committed && committed !== correctLetter;
            } else {
              selectedStyle = letter === committed;
            }
          } else if (!isOpen && pending && letter === pending) {
            selectedStyle = true;
          }

          li.classList.toggle('is-selected', selectedStyle);
          li.classList.toggle('is-correct', correctStyle);
          li.classList.toggle('is-wrong-selected', wrongStyle);
        });
      }
      blockPainters.push(paint);

      options.forEach(function (li) {
        li.classList.add('selectable-option');
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'button');
        function pick() {
          if (isAnswered(block.id)) return; // locked once answered — use Reset to change it
          const letter = optionLetter(li);
          if (answerPanel.classList.contains('visible')) {
            // Answer is already open: picking now immediately satisfies both
            // halves of "answered" (selected + revealed), so commit right away.
            selections[block.id] = letter;
            saveMap('Selections', selections);
            if (resultsPanel && resultsBody.style.display === 'block') renderResults();
            maybeAnnounceCompletion();
          } else {
            pendingPicks[block.id] = letter;
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

        if (willOpen && !isAnswered(block.id) && pendingPicks[block.id]) {
          selections[block.id] = pendingPicks[block.id];
          saveMap('Selections', selections);
        }
        // No pending pick and not yet answered: nothing to persist — the
        // panel still opens to show the explanations, just with no option
        // highlighted.

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
    initScenarios('.scenario-set');
  });

  window.initScenarios = initScenarios;
})();
