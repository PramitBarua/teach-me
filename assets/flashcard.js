/* Reusable flashcard deck engine – AWS SAA-C03 lessons */
(function () {
  function clamp(n) {
    return Math.max(-5, Math.min(5, n));
  }

  function moduleScoreKey(moduleKey) {
    return 'flashcard-score:' + moduleKey;
  }

  // All card scores for a module live in one JSON object:
  // localStorage['flashcard-score:<moduleKey>'] = { "<cardId>": <score>, ... }
  function loadModuleScores(moduleKey) {
    const raw = localStorage.getItem(moduleScoreKey(moduleKey));
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveModuleScores(moduleKey, scores) {
    localStorage.setItem(moduleScoreKey(moduleKey), JSON.stringify(scores));
  }

  function getScore(scores, cardId) {
    const raw = scores[cardId];
    return raw === undefined ? 0 : clamp(raw);
  }

  function setScore(scores, cardId, value) {
    scores[cardId] = clamp(value);
  }

  function initFlashcards(cards, opts) {
    const moduleKey = (opts && opts.moduleKey) || document.title;
    const container = document.querySelector((opts && opts.selector) || '.flashcard-deck');
    if (!container || !cards || !cards.length) return;

    const scores = loadModuleScores(moduleKey);
    let order = cards.slice();
    let index = 0;
    let flipped = false;

    container.innerHTML =
      '<p class="deck-progress"></p>' +
      '<div class="flashcard">' +
        '<div class="flashcard-inner">' +
          '<div class="flashcard-face flashcard-front">' +
            '<span class="card-type-tag"></span>' +
            '<span class="score-badge"></span>' +
            '<p class="card-content"></p>' +
            '<p class="flip-hint">Click to reveal</p>' +
          '</div>' +
          '<div class="flashcard-face flashcard-back">' +
            '<span class="card-type-tag"></span>' +
            '<span class="score-badge"></span>' +
            '<p class="card-content"></p>' +
            '<div class="grade-buttons">' +
              '<button class="review-btn" type="button">Review</button>' +
              '<button class="learned-btn" type="button">Learned</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="deck-controls">' +
        '<button class="prev-btn" type="button">&larr; Prev</button>' +
        '<button class="next-btn" type="button">Next &rarr;</button>' +
      '</div>';

    const card = container.querySelector('.flashcard');
    const progress = container.querySelector('.deck-progress');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const reviewBtn = container.querySelector('.review-btn');
    const learnedBtn = container.querySelector('.learned-btn');

    // Sorts the deck ascending by score (weakest cards first) and restarts
    // at the top. Called whenever a full pass through the deck completes.
    function startNewRound() {
      order = order.slice().sort(function (a, b) {
        return getScore(scores, a.id) - getScore(scores, b.id);
      });
      index = 0;
    }

    function render() {
      flipped = false;
      card.classList.remove('flipped');
      const c = order[index];
      const score = getScore(scores, c.id);
      const scoreLabel = (score > 0 ? '+' : '') + score;
      const scoreClass = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';

      container.querySelectorAll('.card-type-tag').forEach(function (el) {
        el.textContent = c.type === 'topic' ? 'Topic' : 'Question';
      });
      container.querySelectorAll('.score-badge').forEach(function (el) {
        el.textContent = scoreLabel;
        el.className = 'score-badge ' + scoreClass;
      });
      container.querySelector('.flashcard-front .card-content').textContent = c.front;
      container.querySelector('.flashcard-back .card-content').textContent = c.back;

      progress.textContent = 'Card ' + (index + 1) + ' of ' + order.length;
    }

    card.addEventListener('click', function (e) {
      if (e.target.closest('.grade-buttons')) return;
      flipped = !flipped;
      card.classList.toggle('flipped', flipped);
    });

    function grade(delta) {
      const c = order[index];
      setScore(scores, c.id, getScore(scores, c.id) + delta);
      saveModuleScores(moduleKey, scores);
      if (index < order.length - 1) {
        index++;
      } else {
        startNewRound();
      }
      render();
    }

    learnedBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      grade(1);
    });
    reviewBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      grade(-1);
    });

    prevBtn.addEventListener('click', function () {
      index = (index - 1 + order.length) % order.length;
      render();
    });
    nextBtn.addEventListener('click', function () {
      if (index < order.length - 1) {
        index++;
      } else {
        startNewRound();
      }
      render();
    });

    render();
  }

  window.initFlashcards = initFlashcards;
})();
