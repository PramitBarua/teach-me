/* Reusable quiz engine – AWS SAA-C03 lessons */
(function () {
  function initQuiz(containerSelector) {
    const container = document.querySelector(containerSelector || '.quiz-section');
    if (!container) return;

    const questions = container.querySelectorAll('.question-block');
    let answered = 0;
    let correct = 0;

    function updateProgress() {
      const prog = container.querySelector('.quiz-progress');
      if (prog) prog.textContent = `${answered} / ${questions.length} answered`;
    }

    questions.forEach(function (block, idx) {
      const btn = block.querySelector('.check-btn');
      const feedback = block.querySelector('.feedback');
      if (!btn || !feedback) return;

      btn.addEventListener('click', function () {
        const selected = block.querySelector('input[type="radio"]:checked');
        if (!selected) {
          feedback.textContent = 'Please select an answer.';
          feedback.className = 'feedback wrong';
          feedback.style.display = 'block';
          return;
        }

        const isCorrect = selected.dataset.correct === 'true';
        const explanation = selected.dataset.explanation || '';

        if (isCorrect) {
          correct++;
          feedback.className = 'feedback correct';
          feedback.textContent = '✓ Correct! ' + explanation;
        } else {
          feedback.className = 'feedback wrong';
          const correctOption = block.querySelector('input[data-correct="true"]');
          const correctText = correctOption
            ? correctOption.closest('label').textContent.trim()
            : '';
          feedback.textContent =
            '✗ Not quite. ' +
            (correctText ? 'The correct answer is: ' + correctText + '. ' : '') +
            explanation;
        }

        feedback.style.display = 'block';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        block.querySelectorAll('input[type="radio"]').forEach(function (r) {
          r.disabled = true;
        });

        answered++;
        updateProgress();

        if (answered === questions.length) {
          const banner = container.querySelector('.score-banner');
          if (banner) {
            const pct = Math.round((correct / questions.length) * 100);
            banner.textContent =
              'Quiz complete! Score: ' +
              correct +
              '/' +
              questions.length +
              ' (' +
              pct +
              '%). ' +
              (pct >= 80 ? 'Great work — ready to move on.' : 'Review the explanations above, then retry.');
            banner.style.display = 'block';
          }
        }
      });
    });

    updateProgress();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initQuiz('.quiz-section');
  });

  window.initQuiz = initQuiz;
})();
