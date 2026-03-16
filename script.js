let home = 0;
let away = 0;
let period = 1;

/* Game clock (12:00) */
let gameSeconds = 12 * 60;
let gameTimerId = null;

/* Shot clock (24) */
let shotSeconds = 24;
let shotTimerId = null;

// Elements
const homeScoreEl = document.getElementById("homeScore");
const awayScoreEl = document.getElementById("awayScore");
const periodEl = document.getElementById("periodNumber");
const clockEl = document.getElementById("clock");
const shotClockEl = document.getElementById("shotClock");

// Winner overlay elements
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerTitle = document.getElementById("winnerTitle");
const winnerScore = document.getElementById("winnerScore");

const newGameBtn = document.getElementById("newGameBtn");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");

/* SCORE BUTTONS */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const team = e.target.dataset.team;
    const points = Number(e.target.dataset.points);
    addPoints(team, points);
  }
});

function addPoints(team, points) {
  if (team === "home") {
    home += points;
    homeScoreEl.textContent = home;
  } else {
    away += points;
    awayScoreEl.textContent = away;
  }
}

/* PERIOD */
document.getElementById("nextPeriodBtn").addEventListener("click", () => {
  period++;
  periodEl.textContent = period;
});

/* GAME CLOCK CONTROLS */
document.getElementById("startBtn").addEventListener("click", startGameClock);
document.getElementById("pauseBtn").addEventListener("click", pauseGameClock);
document.getElementById("resetClockBtn").addEventListener("click", resetGameClock);

function startGameClock() {
  if (gameTimerId !== null) return;

  gameTimerId = setInterval(() => {
    if (gameSeconds <= 0) {
      endGame(); // show winner screen
      return;
    }
    gameSeconds--;
    renderGameClock();
  }, 1000);
}

function pauseGameClock() {
  if (gameTimerId !== null) {
    clearInterval(gameTimerId);
    gameTimerId = null;
  }
}

function resetGameClock() {
  pauseGameClock();
  gameSeconds = 12 * 60;
  renderGameClock();
}

function renderGameClock() {
  const minutes = Math.floor(gameSeconds / 60);
  const seconds = gameSeconds % 60;
  clockEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* SHOT CLOCK CONTROLS */
document.getElementById("shotStartBtn").addEventListener("click", startShotClock);
document.getElementById("shotPauseBtn").addEventListener("click", pauseShotClock);
document.getElementById("shotReset24Btn").addEventListener("click", () => setShotClock(24));
document.getElementById("shotReset14Btn").addEventListener("click", () => setShotClock(14));

function startShotClock() {
  if (shotTimerId !== null) return;

  shotTimerId = setInterval(() => {
    if (shotSeconds <= 0) {
      pauseShotClock();
      shotSeconds = 0;
      renderShotClock();
      return;
    }
    shotSeconds--;
    renderShotClock();
  }, 1000);
}

function pauseShotClock() {
  if (shotTimerId !== null) {
    clearInterval(shotTimerId);
    shotTimerId = null;
  }
}

function setShotClock(seconds) {
  pauseShotClock();
  shotSeconds = seconds;
  renderShotClock();
}

function renderShotClock() {
  shotClockEl.textContent = String(shotSeconds).padStart(2, "0");
}

/* WINNER SCREEN */
function endGame() {
  // stop clocks
  pauseGameClock();
  pauseShotClock();

  // clamp and render 0:00
  gameSeconds = 0;
  renderGameClock();

  // decide winner
  if (home > away) {
    winnerTitle.textContent = "HOME WINS";
  } else if (away > home) {
    winnerTitle.textContent = "AWAY WINS";
  } else {
    winnerTitle.textContent = "TIE GAME";
  }

  winnerScore.textContent = `Home ${home} - ${away} Away`;

  // show overlay
  winnerOverlay.classList.remove("hidden");
}

/* OVERLAY BUTTONS */
newGameBtn.addEventListener("click", () => {
  resetEverything();
  winnerOverlay.classList.add("hidden");
});

closeOverlayBtn.addEventListener("click", () => {
  winnerOverlay.classList.add("hidden");
});

/* RESET GAME BUTTON */
document.getElementById("resetGameBtn").addEventListener("click", resetEverything);

function resetEverything() {
  home = 0;
  away = 0;
  period = 1;

  homeScoreEl.textContent = "0";
  awayScoreEl.textContent = "0";
  periodEl.textContent = "1";

  // reset clocks
  resetGameClock();
  setShotClock(24);
}

// Initial renders
renderGameClock();
renderShotClock();