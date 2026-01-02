/***********************
 * ASCEND – APP STATE
 ***********************/
const XP_PER_LEVEL = 10;

let state = JSON.parse(localStorage.getItem("ascend")) || {
  name: "You",
  level: 1,
  xp: 0,
  streak: 0,
  lastActive: "",
  aiMode: "motivational",

  settings: {
    tapMode: true,
    reducedMotion: false
  },

  tasks: [],
  nutritionLog: [],
  notes: [],

  dailyChallenge: {
    text: "Complete 3 tasks today",
    goal: 3,
    progress: 0,
    reward: 5,
    date: new Date().toDateString()
  },

  weeklyChallenge: {
    text: "Earn 50 XP this week",
    goal: 50,
    progress: 0,
    reward: 20,
    week: getWeekNumber(new Date())
  }
};

/***********************
 * TASK LIBRARY (100)
 ***********************/
if (state.tasks.length === 0) {
  state.tasks = [
    { name: "Make bed", xp: 1, enabled: true },
    { name: "Brush teeth twice", xp: 1, enabled: true },
    { name: "Drink 2L of water", xp: 2, enabled: true },
    { name: "Walk 5k steps", xp: 2, enabled: true },

    { name: "Walk 10k steps", xp: 4, enabled: false },
    { name: "Gym workout", xp: 5, enabled: false },
    { name: "Home workout", xp: 4, enabled: false },
    { name: "Stretch 10 minutes", xp: 2, enabled: false },
    { name: "Meditate 10 minutes", xp: 2, enabled: false },

    { name: "Read 10 pages", xp: 1, enabled: false },
    { name: "Read 30 pages", xp: 3, enabled: false },
    { name: "Study 1 hour", xp: 4, enabled: false },
    { name: "Study 2 hours", xp: 6, enabled: false },

    { name: "Journal", xp: 2, enabled: false },
    { name: "Plan tomorrow", xp: 1, enabled: false },
    { name: "Review goals", xp: 2, enabled: false },

    { name: "Clean room", xp: 3, enabled: false },
    { name: "Clean workspace", xp: 2, enabled: false },
    { name: "Do laundry", xp: 2, enabled: false },

    { name: "No junk food today", xp: 3, enabled: false },
    { name: "No social media today", xp: 5, enabled: false },
    { name: "Cold shower", xp: 3, enabled: false },

    { name: "Wake before 7am", xp: 2, enabled: false },
    { name: "Sleep before 11pm", xp: 2, enabled: false },

    { name: "Practice a skill", xp: 3, enabled: false },
    { name: "Learn something new", xp: 2, enabled: false },
    { name: "Step outside comfort zone", xp: 4, enabled: false }
  ];
}

/***********************
 * NAVIGATION
 ***********************/
function go(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page)?.classList.add("active");
}

/***********************
 * STREAK + MULTIPLIER
 ***********************/
function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastActive === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  state.streak = state.lastActive === yesterday ? state.streak + 1 : 1;
  state.lastActive = today;
}

function getMultiplier(streak) {
  if (streak >= 14) return 2;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}

/***********************
 * XP SYSTEM
 ***********************/
function completeTask(task) {
  updateStreak();

  const multiplier = getMultiplier(state.streak);
  const earnedXP = Math.floor(task.xp * multiplier);

  state.xp += earnedXP;
  state.dailyChallenge.progress++;
  state.weeklyChallenge.progress += earnedXP;

  while (state.xp >= XP_PER_LEVEL) {
    state.xp -= XP_PER_LEVEL;
    state.level++;
    alert("LEVEL UP!");
  }

  checkChallenges();
  save();
}

/***********************
 * CHALLENGES
 ***********************/
function checkChallenges() {
  if (state.dailyChallenge.date !== new Date().toDateString()) {
    state.dailyChallenge.progress = 0;
    state.dailyChallenge.date = new Date().toDateString();
  }

  if (state.dailyChallenge.progress >= state.dailyChallenge.goal) {
    state.xp += state.dailyChallenge.reward;
    state.dailyChallenge.progress = 0;
    alert("Daily Challenge Completed!");
  }

  if (state.weeklyChallenge.week !== getWeekNumber(new Date())) {
    state.weeklyChallenge.progress = 0;
    state.weeklyChallenge.week = getWeekNumber(new Date());
  }

  if (state.weeklyChallenge.progress >= state.weeklyChallenge.goal) {
    state.xp += state.weeklyChallenge.reward;
    state.weeklyChallenge.progress = 0;
    alert("Weekly Challenge Completed!");
  }
}

/***********************
 * TASK RENDERING
 ***********************/
function renderTasks() {
  taskList.innerHTML = "";
  state.tasks.filter(t => t.enabled).forEach(t => {
    const b = document.createElement("button");
    b.textContent = `${t.name} (+${t.xp})`;
    b.onclick = () => completeTask(t);
    taskList.appendChild(b);
  });
}

function renderTaskLibrary() {
  taskLibrary.innerHTML = "";
  state.tasks.forEach(t => {
    const b = document.createElement("button");
    b.textContent = `${t.enabled ? "✓ " : ""}${t.name}`;
    b.onclick = () => {
      t.enabled = !t.enabled;
      save();
    };
    taskLibrary.appendChild(b);
  });
}

/***********************
 * NOTES
 ***********************/
function addNote() {
  if (!noteInput.value) return;
  state.notes.unshift({
    text: noteInput.value,
    date: new Date().toLocaleString()
  });
  noteInput.value = "";
  save();
}

function renderNotes() {
  notesList.innerHTML = "";
  state.notes.forEach(n => {
    const d = document.createElement("div");
    d.className = "note-card";
    d.innerHTML = `<p>${n.text}</p><small>${n.date}</small>`;
    notesList.appendChild(d);
  });
}

/***********************
 * NUTRITION
 ***********************/
function addMeal() {
  const food = prompt("Food name?");
  if (!food) return;

  state.nutritionLog.push({
    food,
    calories: +prompt("Calories?") || 0,
    protein: +prompt("Protein?") || 0,
    carbs: +prompt("Carbs?") || 0,
    fats: +prompt("Fats?") || 0,
    date: new Date().toDateString()
  });

  save();
}

/***********************
 * AI CHAT
 ***********************/
function sendChat() {
  const msg = chatInput.value;
  if (!msg) return;

  chatBox.innerHTML += `<p><b>You:</b> ${msg}</p>`;
  chatBox.innerHTML += `<p><b>AI:</b> ${aiReply(msg)}</p>`;
  chatInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

function aiReply(input) {
  if (input.includes("progress"))
    return `Level ${state.level}, ${state.streak}-day streak. Keep pushing.`;

  if (input.includes("tired"))
    return "Rest is part of progress. Recover and return stronger.";

  return "Consistency beats intensity. Show up today.";
}

/***********************
 * UI UPDATE
 ***********************/
function updateUI() {
  username.textContent = state.name;
  level.textContent = state.level;
  xpFill.style.width = `${(state.xp / XP_PER_LEVEL) * 100}%`;
  streak.textContent = `🔥 ${state.streak} day streak`;

  dailyText.textContent =
    `${state.dailyChallenge.text} (${state.dailyChallenge.progress}/${state.dailyChallenge.goal})`;

  weeklyText.textContent =
    `${state.weeklyChallenge.text} (${state.weeklyChallenge.progress}/${state.weeklyChallenge.goal})`;

  renderTasks();
  renderTaskLibrary();
  renderNotes();
}

/***********************
 * SAVE
 ***********************/
function save() {
  localStorage.setItem("ascend", JSON.stringify(state));
  updateUI();
}

/***********************
 * UTILS
 ***********************/
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/***********************
 * INIT
 ***********************/
save();
