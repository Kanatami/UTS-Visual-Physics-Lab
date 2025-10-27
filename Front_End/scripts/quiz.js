(() => {
  const form = document.getElementById("quizForm");
  const submitBtn = document.getElementById("submitQuiz");
  const resetBtn = document.getElementById("resetQuiz");
  const result = document.getElementById("quizResult");

  const questionBank = {
    projectile: [
      {
        id: "proj1",
        text: "Which angle maximizes projectile range R? (no air resistance, h₀ = 0)",
        options: ["30°", "45°", "60°", "90°"],
        answer: 1,
        explanation: "45° gives maximum range because sin(2θ) is maximum at θ=45°, where sin(90°)=1."
      },
      {
        id: "proj2",
        text: "In projectile motion without air resistance, the horizontal velocity component is:",
        options: ["Increasing with time", "Decreasing with time", "Constant", "Parabolic"],
        answer: 2,
        explanation: "Horizontal velocity remains constant because there is no horizontal acceleration (no air resistance)."
      },
      {
        id: "proj3",
        text: "At the highest point of projectile motion, the vertical velocity component is:",
        options: ["Maximum", "Zero", "Negative maximum", "Equal to initial velocity"],
        answer: 1,
        explanation: "At the highest point, vertical velocity becomes zero before the projectile starts falling."
      }
    ],
    circular: [
      {
        id: "circ1",
        text: "In uniform circular motion, velocity and acceleration vectors are:",
        options: ["Parallel", "Antiparallel", "Perpendicular", "At 45°"],
        answer: 2,
        explanation: "Velocity is tangent to the circle, while centripetal acceleration points toward the center, making them perpendicular."
      },
      {
        id: "circ2",
        text: "For circular motion with radius r and speed v, centripetal acceleration magnitude is:",
        options: ["v/r", "v²/r", "vr", "v/r²"],
        answer: 1,
        explanation: "Centripetal acceleration a = v²/r is derived from the change in velocity direction."
      },
      {
        id: "circ3",
        text: "In uniform circular motion, which quantity remains constant?",
        options: ["Velocity", "Acceleration", "Speed", "Direction"],
        answer: 2,
        explanation: "Speed (magnitude of velocity) remains constant, but velocity direction continuously changes."
      }
    ],
    energy: [
      {
        id: "energy1",
        text: "Kinetic energy is proportional to:",
        options: ["velocity", "velocity²", "mass²", "√velocity"],
        answer: 1,
        explanation: "KE = ½mv², so kinetic energy is proportional to the square of velocity."
      },
      {
        id: "energy2",
        text: "Potential energy at height h (mass m, gravity g) is:",
        options: ["mgh", "mg/h", "mh/g", "m²gh"],
        answer: 0,
        explanation: "Gravitational potential energy PE = mgh, where h is height above reference point."
      },
      {
        id: "energy3",
        text: "In a conservative system, total mechanical energy:",
        options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
        answer: 2,
        explanation: "Energy conservation: total mechanical energy (KE + PE) remains constant without external forces."
      }
    ],
    all: []
  };

  questionBank.all = [
    ...questionBank.projectile,
    ...questionBank.circular,
    ...questionBank.energy
  ];

  let currentCategory = 'all';
  let questions = questionBank.all;

  function switchCategory(category) {
    currentCategory = category;
    questions = questionBank[category] || questionBank.all;
    reset();
    render();
    updateCategoryButtons();
  }

  function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
      if (btn.dataset.category === currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function render() {
    form.innerHTML = questions.map((q, idx) => {
      const opts = q.options.map((opt, i) => `
        <label class="option">
          <input type="radio" name="${q.id}" value="${i}"> ${opt}
        </label>
      `).join("");
      return `<div class="card" style="margin-bottom:12px">
        <h3>Q${idx+1}. ${q.text}</h3>
        <div class="options">${opts}</div>
      </div>`;
    }).join("");
  }

  async function grade() {
    let correct = 0;
    const answers = {};
    const detailedResults = [];
    
    questions.forEach((q, idx) => {
      const chosen = form.querySelector(`input[name="${q.id}"]:checked`);
      const chosenValue = chosen ? Number(chosen.value) : null;
      answers[q.id] = chosenValue;
      const isCorrect = chosen && chosenValue === q.answer;
      if (isCorrect) correct++;
      
      detailedResults.push({
        questionNum: idx + 1,
        question: q.text,
        userAnswer: chosenValue !== null ? q.options[chosenValue] : 'Not answered',
        correctAnswer: q.options[q.answer],
        isCorrect: isCorrect,
        explanation: q.explanation
      });
    });
    
    const percentage = Math.round((correct / questions.length) * 100);
    
    let resultsHTML = `<div class="card"><strong>${correct} / ${questions.length}</strong> correct (${percentage}%)</div>`;
    
    resultsHTML += `<div class="card" style="margin-top: 16px;">
      <h3>Answer Review</h3>
      ${detailedResults.map(r => `
        <div style="padding: 12px; margin: 8px 0; border-left: 4px solid ${r.isCorrect ? '#4f7cff' : '#ff5d5d'}; background: ${r.isCorrect ? 'rgba(79, 124, 255, 0.05)' : 'rgba(255, 93, 93, 0.05)'}; border-radius: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">Q${r.questionNum}. ${r.question}</div>
          <div style="margin: 4px 0;">
            <span style="color: ${r.isCorrect ? '#4f7cff' : '#ff5d5d'};">Your answer: ${r.userAnswer}</span>
            ${!r.isCorrect ? `<br><span style="color: #4f7cff;">Correct answer: ${r.correctAnswer}</span>` : ''}
          </div>
          <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.02); border-radius: 6px; font-size: 14px;">
            💡 ${r.explanation}
          </div>
        </div>
      `).join('')}
    </div>`;
    
    result.innerHTML = resultsHTML;
    
    if (window.saveQuizResultToCloud) {
      try {
        result.innerHTML += `<div class="card" style="margin-top:8px;color:#6b7380">💾 Saving to database...</div>`;
        
        const quizData = {
          category: currentCategory,
          score: correct,
          total: questions.length,
          percentage: percentage,
          answers: answers,
          timestamp: new Date().toISOString()
        };
        
        await window.saveQuizResultToCloud(quizData);
        
        const lastCard = result.lastElementChild;
        if (lastCard) {
          lastCard.innerHTML = '✅ Result saved to database!';
          lastCard.style.color = '#4f7cff';
        }
      } catch (err) {
        console.error('Failed to save quiz result:', err);
        const lastCard = result.lastElementChild;
        if (lastCard) {
          lastCard.innerHTML = `⚠️ Failed to save (${err.message})`;
          lastCard.style.color = '#ff5d5d';
        }
      }
    }
  }

  function reset() {
    form.reset();
    result.innerHTML = "";
  }

  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    
    if (categoryFromUrl && questionBank[categoryFromUrl]) {
      switchCategory(categoryFromUrl);
    } else if (categoryFromUrl === null) {
      switchCategory('all');
    }
    
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchCategory(btn.dataset.category);
      });
    });
    updateCategoryButtons();
  });

  submitBtn.addEventListener("click", grade);
  resetBtn.addEventListener("click", reset);
  render();

  const viewHistoryBtn = document.getElementById("viewHistory");
  const historySection = document.getElementById("historySection");
  const historyList = document.getElementById("historyList");

  async function loadHistory() {
    if (!window.getQuizHistory) {
      historyList.innerHTML = '<p class="muted">History feature not available</p>';
      return;
    }

    try {
      const history = await window.getQuizHistory();
      
      if (history.length === 0) {
        historyList.innerHTML = '<p class="muted">No quiz history yet</p>';
        return;
      }

      const categoryNames = {
        all: 'All Topics',
        projectile: 'Projectile Motion',
        circular: 'Circular Motion',
        energy: 'Energy'
      };

      historyList.innerHTML = history.map(item => {
        const date = new Date(item.createdAt || item.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const category = categoryNames[item.category] || item.category;
        
        return `
          <div class="card" style="margin-bottom: 10px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${category}</strong>
                <div class="muted" style="font-size: 0.9em;">${dateStr}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.2em; font-weight: bold;">
                  ${item.score}/${item.total}
                </div>
                <div class="muted">${item.percentage}%</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to load history:', err);
      historyList.innerHTML = `<p style="color: var(--danger)">Failed to load history: ${err.message}</p>`;
    }
  }

  viewHistoryBtn.addEventListener("click", async () => {
    const isVisible = historySection.style.display !== 'none';
    
    if (isVisible) {
      historySection.style.display = 'none';
      viewHistoryBtn.textContent = '📊 View History';
    } else {
      historySection.style.display = 'block';
      viewHistoryBtn.textContent = '✖️ Hide History';
      historyList.innerHTML = '<p class="muted">Loading...</p>';
      historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await loadHistory();
    }
  });

  window.quizSwitchCategory = switchCategory;
})();
