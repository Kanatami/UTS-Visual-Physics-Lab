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
        answer: 1
      },
      {
        id: "proj2",
        text: "In y(t)=h₀+v₀sinθ·t−(1/2)g t² with upward positive, what is the sign of g?",
        options: ["Positive", "Negative", "Depends on initial conditions", "Zero"],
        answer: 1
      },
      {
        id: "proj3",
        text: "In projectile motion without air resistance, the horizontal velocity component is:",
        options: ["Increasing with time", "Decreasing with time", "Constant", "Parabolic"],
        answer: 2
      },
      {
        id: "proj4",
        text: "A projectile launched at 20 m/s at 30° has a horizontal velocity component of:",
        options: ["10 m/s", "17.3 m/s", "20 m/s", "10√3 m/s"],
        answer: 1
      },
      {
        id: "proj5",
        text: "At the highest point of projectile motion, the vertical velocity component is:",
        options: ["Maximum", "Zero", "Negative maximum", "Equal to initial velocity"],
        answer: 1
      },
      {
        id: "proj6",
        text: "For the same initial speed, launch angles of 45°+α and 45°-α produce:",
        options: ["45°+α travels farther", "45°-α travels farther", "Same range", "Depends on speed"],
        answer: 2
      },
      {
        id: "proj7",
        text: "With g=9.8 m/s², an object thrown vertically at 19.6 m/s reaches maximum height in:",
        options: ["~1.0 s", "~2.0 s", "~3.0 s", "~4.0 s"],
        answer: 1
      },
      {
        id: "proj8",
        text: "The trajectory of projectile motion is parabolic because:",
        options: ["Horizontal motion is uniform", "Vertical motion is uniformly accelerated", "Both combined", "Air resistance"],
        answer: 2
      }
    ],
    circular: [
      {
        id: "circ1",
        text: "In uniform circular motion, velocity and acceleration vectors are:",
        options: ["Parallel", "Antiparallel", "Perpendicular", "At 45°"],
        answer: 2
      },
      {
        id: "circ2",
        text: "For circular motion with radius r and speed v, centripetal acceleration magnitude is:",
        options: ["v/r", "v²/r", "vr", "v/r²"],
        answer: 1
      },
      {
        id: "circ3",
        text: "The relationship between angular velocity ω and period T is:",
        options: ["ω = T", "ω = 2π/T", "ω = πT", "ω = T/2π"],
        answer: 1
      },
      {
        id: "circ4",
        text: "In uniform circular motion, which quantity remains constant?",
        options: ["Velocity", "Acceleration", "Speed", "Direction"],
        answer: 2
      },
      {
        id: "circ5",
        text: "A particle moves in a circle of radius 2m with period 4s. Its speed is:",
        options: ["π m/s", "2π m/s", "π/2 m/s", "4π m/s"],
        answer: 0
      },
      {
        id: "circ6",
        text: "Centripetal force always points:",
        options: ["Tangent to circle", "Toward center", "Away from center", "Upward"],
        answer: 1
      },
      {
        id: "circ7",
        text: "If angular velocity doubles, centripetal acceleration becomes:",
        options: ["2 times", "4 times", "1/2 times", "Unchanged"],
        answer: 1
      }
    ],
    energy: [
      {
        id: "ener1",
        text: "Gravitational potential energy of mass m at height h is (g = acceleration):",
        options: ["mgh", "mg/h", "mh/g", "m/gh"],
        answer: 0
      },
      {
        id: "ener2",
        text: "The kinetic energy formula is:",
        options: ["mv", "mv²", "(1/2)mv²", "2mv"],
        answer: 2
      },
      {
        id: "ener3",
        text: "Mechanical energy is conserved when:",
        options: ["Friction is present", "Only conservative forces act", "Velocity is constant", "Acceleration is constant"],
        answer: 1
      },
      {
        id: "ener4",
        text: "When velocity doubles, kinetic energy becomes:",
        options: ["2 times", "4 times", "1/2 times", "√2 times"],
        answer: 1
      },
      {
        id: "ener5",
        text: "For a freely falling object, total mechanical energy:",
        options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
        answer: 2
      },
      {
        id: "ener6",
        text: "Work-energy theorem states that work done equals change in:",
        options: ["Potential energy", "Kinetic energy", "Total energy", "Momentum"],
        answer: 1
      },
      {
        id: "ener7",
        text: "Power is defined as:",
        options: ["Force × distance", "Work / time", "Energy × time", "Force / time"],
        answer: 1
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
    
    questions.forEach(q => {
      const chosen = form.querySelector(`input[name="${q.id}"]:checked`);
      const chosenValue = chosen ? Number(chosen.value) : null;
      answers[q.id] = chosenValue;
      if (chosen && chosenValue === q.answer) correct++;
    });
    
    const percentage = Math.round((correct / questions.length) * 100);
    result.innerHTML = `<div class="card"><strong>${correct} / ${questions.length}</strong> correct (${percentage}%)</div>`;
    
    if (window.saveQuizResultToCloud) {
      try {
        const quizData = {
          category: currentCategory,
          score: correct,
          total: questions.length,
          percentage: percentage,
          answers: answers,
          timestamp: new Date().toISOString()
        };
        
        await window.saveQuizResultToCloud(quizData);
        result.innerHTML += `<div class="card" style="margin-top:8px;color:#4f7cff">✅ Result saved to database!</div>`;
      } catch (err) {
        console.error('Failed to save quiz result:', err);
        result.innerHTML += `<div class="card" style="margin-top:8px;color:#ff5d5d">⚠️ Failed to save (${err.message})</div>`;
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
      viewHistoryBtn.textContent = 'View History';
    } else {
      historySection.style.display = 'block';
      viewHistoryBtn.textContent = 'Hide History';
      historyList.innerHTML = '<p class="muted">Loading...</p>';
      await loadHistory();
    }
  });

  window.quizSwitchCategory = switchCategory;
})();
