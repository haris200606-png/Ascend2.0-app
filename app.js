let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  aiMode:"motivational",
  settings:{tapMode:true,reducedMotion:false},

  nutritionLog:[],
  notes:[],

  tasks: [
  // 🌅 DAILY FOUNDATIONS (Enabled by default)
  {name:"Make bed",xp:1,enabled:true},
  {name:"Brush teeth twice",xp:1,enabled:true},
  {name:"Drink 2L of water",xp:2,enabled:true},
  {name:"Walk 5k steps",xp:2,enabled:true},

  // 🚶 FITNESS – WALKING
  {name:"Walk 7k steps",xp:3,enabled:false},
  {name:"Walk 10k steps",xp:4,enabled:false},
  {name:"Walk 12k steps",xp:5,enabled:false},
  {name:"Walk 15k steps",xp:6,enabled:false},

  // 🏋️ FITNESS – WORKOUTS
  {name:"Gym session",xp:5,enabled:false},
  {name:"Home workout",xp:4,enabled:false},
  {name:"Upper body workout",xp:4,enabled:false},
  {name:"Lower body workout",xp:4,enabled:false},
  {name:"Core workout",xp:3,enabled:false},
  {name:"HIIT workout",xp:5,enabled:false},

  // 🧘 FLEXIBILITY & RECOVERY
  {name:"Stretch 5 minutes",xp:1,enabled:false},
  {name:"Stretch 10 minutes",xp:2,enabled:false},
  {name:"Stretch 30 minutes",xp:4,enabled:false},
  {name:"Yoga session",xp:4,enabled:false},
  {name:"Cold shower",xp:3,enabled:false},

  // 🛌 SLEEP & ROUTINE
  {name:"Sleep before 11pm",xp:2,enabled:false},
  {name:"Sleep before 10pm",xp:4,enabled:false},
  {name:"Wake before 7am",xp:2,enabled:false},
  {name:"Wake before 6am",xp:4,enabled:false},
  {name:"No phone 1h before bed",xp:3,enabled:false},

  // 📚 STUDY & LEARNING
  {name:"Homework completed",xp:2,enabled:false},
  {name:"Study 30 minutes",xp:2,enabled:false},
  {name:"Study 1 hour",xp:4,enabled:false},
  {name:"Study 2 hours",xp:6,enabled:false},
  {name:"Read 10 pages",xp:1,enabled:false},
  {name:"Read 30 pages",xp:3,enabled:false},
  {name:"Read 60 pages",xp:5,enabled:false},
  {name:"Watch educational video",xp:1,enabled:false},
  {name:"Practice a skill",xp:3,enabled:false},

  // 🧠 MENTAL HEALTH
  {name:"Meditate 5 minutes",xp:1,enabled:false},
  {name:"Meditate 15 minutes",xp:3,enabled:false},
  {name:"Journal today",xp:2,enabled:false},
  {name:"Practice gratitude",xp:1,enabled:false},
  {name:"Deep breathing exercise",xp:1,enabled:false},

  // 🎯 PRODUCTIVITY
  {name:"Plan tomorrow",xp:1,enabled:false},
  {name:"Review goals",xp:2,enabled:false},
  {name:"Complete main task of the day",xp:4,enabled:false},
  {name:"Inbox zero",xp:2,enabled:false},
  {name:"No procrastination block",xp:3,enabled:false},

  // 🧹 DISCIPLINE & ENVIRONMENT
  {name:"Clean room",xp:3,enabled:false},
  {name:"Clean workspace",xp:2,enabled:false},
  {name:"Do laundry",xp:2,enabled:false},
  {name:"Organize desk",xp:2,enabled:false},
  {name:"Take out trash",xp:1,enabled:false},

  // 🤝 SOCIAL & LIFE
  {name:"Help someone today",xp:3,enabled:false},
  {name:"Call family member",xp:2,enabled:false},
  {name:"Check in with friend",xp:1,enabled:false},

  // 🚫 DISCIPLINE CHALLENGES
  {name:"No junk food today",xp:3,enabled:false},
  {name:"No social media today",xp:5,enabled:false},
  {name:"No sugar today",xp:3,enabled:false},
  {name:"No caffeine today",xp:2,enabled:false},

  // 🌱 SELF-GROWTH
  {name:"Learn something new",xp:2,enabled:false},
  {name:"Reflect on the day",xp:1,enabled:false},
  {name:"Write goals",xp:2,enabled:false},
  {name:"Improve one weakness",xp:3,enabled:false},
  {name:"Step outside comfort zone",xp:4,enabled:false}
]
};
const XP_PER_LEVEL = 10;

/* ---------- NAV ---------- */
function go(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
}

/* ---------- TASKS ---------- */
function renderTasks(){
  taskList.innerHTML="";
  state.tasks.filter(t=>t.enabled).forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.name} (+${t.xp})`;
    b.onclick=()=>gainXP(t.xp);
    taskList.appendChild(b);
  });
}
/* ---------- TASK LIBRARY ---------- */
function renderLibrary(){
  taskLibrary.innerHTML="";
  state.tasks.forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.enabled?"✓ ":""}${t.name}`;
    b.onclick=()=>{t.enabled=!t.enabled;save();};
    taskLibrary.appendChild(b);
  });
}

/* ---------- XP SYSTEM ---------- */
function gainXP(x){
  const today=new Date().toDateString();
  if(state.lastDay!==today){
    state.streak++;
    state.lastDay=today;
  }
  state.xp+=x;
  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
    alert("LEVEL UP!");
  }
  save();
}
/* ---------- PROFILE FRAME ---------- */
function updateFrame(){
  frame.className="level-ring";
  if(state.level>=20) frame.classList.add("frame-20");
  else if(state.level>=10) frame.classList.add("frame-10");
  else if(state.level>=5) frame.classList.add("frame-5");
}

/* ---------- AI COACH ---------- */
function aiCoach(){
  if(state.aiMode==="silent") return;
  if(state.aiMode==="motivational")
    alert("Consistency compounds. Small wins today shape who you become.");
  if(state.aiMode==="analytical")
    alert(`Level ${state.level}. Your streak efficiency is improving. Maintain input consistency.`);
}
/* ---------- NUTRITION ---------- */
function saveNutrition(){
  const entry={
    date:new Date().toDateString(),
    calories:+calories.value||0,
    protein:+protein.value||0,
    carbs:+carbs.value||0,
    fats:+fats.value||0
  };
  state.nutritionLog.push(entry);
  nutritionSummary.innerText=`Saved ${entry.calories} kcal today`;
  calories.value=protein.value=carbs.value=fats.value="";
  save();
}
/* ---------- NOTES (PREMIUM) ---------- */
function addNote(){
  if(!noteInput.value) return;

  state.notes.unshift({
    text:noteInput.value,
    date:new Date().toLocaleString(),
    color:["#1f2937","#111827","#020617"][Math.floor(Math.random()*3)]
  });

  noteInput.value="";
  save();
}

function renderNotes(){
  notesList.innerHTML="";
  state.notes.forEach(n=>{
    const d=document.createElement("div");
    d.className="note-card";
    d.innerHTML=`
      <div class="note-accent" style="background:${n.color}"></div>
      <p>${n.text}</p>
      <small>${n.date}</small>
    `;
    notesList.appendChild(d);
  });
}
/* ---------- LEADERBOARD ---------- */
const leaderboard=[
  ()=>({name:state.name,level:state.level}),
  {name:"Alex",level:14},
  {name:"Sam",level:9}
];

function loadLeaderboard(){
  leaderboardList.innerHTML="";
  leaderboard.forEach(p=>{
    const d=typeof p==="function"?p():p;
    const li=document.createElement("li");
    li.innerText=`${d.name} — Level ${d.level}`;
    leaderboardList.appendChild(li);
  });
}

/* ---------- SETTINGS ---------- */
function toggle(k){ state.settings[k]=!state.settings[k]; save(); }
function setAI(m){ state.aiMode=m; save(); }
function saveName(){ state.name=nameInput.value||state.name; save(); }
/* ---------- SAVE ---------- */
function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

function updateUI(){
  username.innerText=state.name;
  level.innerText=state.level;
  xpFill.style.width=`${(state.xp/XP_PER_LEVEL)*100}%`;
  streak.innerText=`🔥 ${state.streak} day streak`;
  updateFrame();
  renderTasks();
  renderLibrary();
  renderNotes();
  loadLeaderboard();
}

updateUI();

function renderExtraTasks(){
  extraTaskList.innerHTML="";
  state.tasks.forEach((t,i)=>{
    const b=document.createElement("button");
    b.innerText=`${t.enabled?"✓ ":""}${t.name} (+${t.xp})`;
    b.onclick=()=>{t.enabled=!t.enabled; save(); renderExtraTasks();};
    extraTaskList.appendChild(b);
  });
}

renderExtraTasks();

function sendChat(){
  const text = chatInput.value;
  if(!text) return;

  const chatBoxDiv = document.getElementById("chatBox");

  const userMsg = document.createElement("div");
  userMsg.innerHTML = `<p style="color:#0f9fff">You: ${text}</p>`;
  chatBoxDiv.appendChild(userMsg);

  // Simple AI response logic
  const aiResponse = aiReply(text);
  const aiMsg = document.createElement("div");
  aiMsg.innerHTML = `<p style="color:#facc15">AI: ${aiResponse}</p>`;
  chatBoxDiv.appendChild(aiMsg);

  chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
  chatInput.value="";
}

function aiReply(input){
  input = input.toLowerCase();
  if(input.includes("tired")) return "Remember, rest is also progress. Stay consistent!";
  if(input.includes("motivation")) return "Every small step counts. Keep moving forward!";
  if(input.includes("food")) return "Log it in the nutrition tracker, and I'll help calculate calories!";
  return "Keep going! Consistency beats perfection.";
}

function addMeal(){
  const foodName = prompt("What is the food?");
  const calories = prompt("Calories?");
  const protein = prompt("Protein?");
  const carbs = prompt("Carbs?");
  const fats = prompt("Fats?");

  if(!foodName) return;

  state.nutritionLog.push({
    date: new Date().toDateString(),
    food: foodName,
    calories: +calories||0,
    protein: +protein||0,
    carbs: +carbs||0,
    fats: +fats||0
  });
  alert("Meal added!");
  save();
}

