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
    const selections = loadMap('Selections');
    const revealed = loadSet('Revealed');

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
        if (!revealed.has(block.id)) return;
        const revealBtn = block.querySelector('.reveal-btn');
        const correctLetter = revealBtn ? revealBtn.dataset.answer : null;
        const selected = selections[block.id];
        if (!selected) return;

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
      if (revealed.size < blocks.length) return;
      completionAnnounced = true;
      renderResults();
      resultsBody.style.display = 'block';
      resultsPanel.classList.add('is-complete');
      if (resultsToggleBtn) resultsToggleBtn.textContent = 'Hide my results';
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (resultsToggleBtn && resultsBody) {
      resultsPanel.classList.toggle('is-complete', revealed.size >= blocks.length && blocks.length > 0);
      if (revealed.size >= blocks.length && blocks.length > 0) {
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

      function applySelectionVisuals() {
        const selected = selections[block.id];
        options.forEach(function (li) {
          li.classList.toggle('is-selected', !revealed.has(block.id) && optionLetter(li) === selected);
        });
      }

      options.forEach(function (li) {
        li.classList.add('selectable-option');
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'button');
        function pick() {
          if (revealed.has(block.id)) return; // locked once checked
          selections[block.id] = optionLetter(li);
          saveMap('Selections', selections);
          applySelectionVisuals();
        }
        li.addEventListener('click', pick);
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick();
          }
        });
      });

      applySelectionVisuals();

      function paintAnswerState(isOpen) {
        const selected = selections[block.id];
        options.forEach(function (li) {
          const letter = optionLetter(li);
          const isCorrectOpt = letter === correctLetter;
          li.classList.toggle('is-correct', isOpen && isCorrectOpt);
          const isWrongSelected = isOpen && !!selected && letter === selected && !isCorrectOpt;
          li.classList.toggle('is-wrong-selected', isWrongSelected);
        });
      }

      if (revealed.has(block.id)) {
        // Keep the panel collapsed on load (matches existing behavior) but
        // options stay locked; state will render correctly once reopened.
      }

      revealBtn.addEventListener('click', function () {
        const isOpen = answerPanel.classList.toggle('visible');
        revealBtn.textContent = isOpen ? 'Hide answer' : 'Reveal answer';

        paintAnswerState(isOpen);

        if (isOpen) {
          answerPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          if (!revealed.has(block.id)) {
            revealed.add(block.id);
            saveSet('Revealed', revealed);
          }
          applySelectionVisuals();
          if (resultsPanel && resultsBody.style.display === 'block') {
            renderResults();
          }
          maybeAnnounceCompletion();
        }
      });
    });

    renderReviewList();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScenarios('.scenario-set');
  });

  window.initScenarios = initScenarios;
})();
