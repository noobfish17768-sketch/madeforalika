import "./style.css";

const PIN = "050902"; // GANTI dengan password kamu
const DINNER_TARGET = "2026-09-05T18:00:00+07:00"; // GANTI ke tanggal + jam dinner

let pin = "";
let currentId = "countdownIntro";
let bookPage = 0;
let countdownInterval = null;
let spotifyController = null;
let typingRun = 0;
let memoryMusicActive = false;
const ORIGINAL_MUSIC = "/music/music.mp3";
const MEMORY_MUSIC = "/music/memory.mp3";

const intro = document.getElementById("countdownIntro");
const pinScreen = document.getElementById("pinScreen");
const app = document.getElementById("app");
const dots = [...document.querySelectorAll("#pinDots i")];
const keypad = document.getElementById("keypad");
const pinError = document.createElement("div");
pinError.className = "pin-error";
pinError.textContent = "Hmm, passwordnya salah 🤭 coba lagi";
pinError.setAttribute("aria-live", "polite");
keypad.before(pinError);

const bgm = document.getElementById("bgm");
const hearts = document.getElementById("hearts");

function updatePinDots() {
  dots.forEach((d, i) => d.classList.toggle("filled", i < pin.length));
}

function checkPin() {
  if (pin === PIN) {
    pinError.classList.remove("show");
    pinScreen.classList.remove("active-screen");
    setTimeout(() => pinScreen.classList.add("hidden"), 350);
    app.classList.remove("hidden");
    showScene("hello");
    startMusic();
    return;
  }
  pinError.classList.add("show");
  pinScreen.classList.add("shake");
  pin = "";
  updatePinDots();
  setTimeout(() => pinError.classList.remove("show"), 1900);
  setTimeout(() => pinScreen.classList.remove("shake"), 500);
}

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-key]");
  if (!btn) return;
  const k = btn.dataset.key;
  if (k === "back") pin = pin.slice(0, -1);
  else if (pin.length < 6 && /\d/.test(k)) pin += k;
  updatePinDots();
  if (pin.length === 6) setTimeout(checkPin, 240);
});

function startDinnerCountdown() {
  const target = new Date(DINNER_TARGET).getTime();
  const parts = {
    h: document.getElementById("dHours"),
    m: document.getElementById("dMinutes"),
    s: document.getElementById("dSeconds")
  };
  const label = document.getElementById("dinnerTargetLabel");
  const date = new Date(DINNER_TARGET);
  if (!Number.isNaN(date.getTime())) {
    label.textContent = `dinner · ${date.toLocaleDateString("en-GB", {day:"2-digit", month:"long", year:"numeric", timeZone:"Asia/Jakarta"})} · ${date.toLocaleTimeString("id-ID", {hour:"2-digit", minute:"2-digit", hour12:false, timeZone:"Asia/Jakarta"})} WIB`;
  }
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    parts.h.textContent = String(h).padStart(2, "0");
    parts.m.textContent = String(m).padStart(2, "0");
    parts.s.textContent = String(sec).padStart(2, "0");
  };
  tick();
  setInterval(tick, 1000);
}
startDinnerCountdown();

function buildRain(){
  const rain=document.getElementById("rain");
  const phrases=["HAPPY","BIRTHDAY","24","LOVE","♡","HAPPY BIRTHDAY","FOR YOU","24TH","MY LOVE","HBD","♡♡♡","TODAY","PRETTY GIRL"];
  const count=150;
  const frag=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const span=document.createElement("span");
    span.textContent=phrases[Math.floor(Math.random()*phrases.length)];
    span.style.left=`${Math.random()*103-1}%`;
    span.style.top=`${-25-Math.random()*125}%`;
    span.style.animationDuration=`${4.2+Math.random()*7}s`;
    span.style.animationDelay=`${-(Math.random()*9)}s`;
    span.style.fontSize=`${7+Math.random()*7}px`;
    span.style.letterSpacing=`${0.10+Math.random()*0.20}em`;
    span.style.opacity=`${0.10+Math.random()*0.42}`;
    if(Math.random()>.72) span.classList.add("rain-bright");
    frag.appendChild(span);
  }
  rain.appendChild(frag);
}
buildRain();

function showPin() {
  intro.classList.remove("active-screen");
  intro.classList.add("leaving");
  setTimeout(() => {
    intro.classList.add("hidden");
    intro.classList.remove("leaving");
    pinScreen.classList.remove("hidden");
    pinScreen.classList.add("active-screen");
  }, 520);
}

document.getElementById("openSurprise").addEventListener("click", showPin);

const BIRTHDAY_TARGET = "2026-09-05T18:00:00+07:00";
function startBirthdayCountdown(){
  const target = new Date(BIRTHDAY_TARGET).getTime();
  const refs = {
    d: document.getElementById("bDays"),
    h: document.getElementById("bHours"),
    m: document.getElementById("bMinutes"),
    s: document.getElementById("bSeconds")
  };
  const tick=()=>{
    const diff=Math.max(0,target-Date.now());
    refs.d.textContent=String(Math.floor(diff/86400000)).padStart(2,"0");
    refs.h.textContent=String(Math.floor((diff%86400000)/3600000)).padStart(2,"0");
    refs.m.textContent=String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
    refs.s.textContent=String(Math.floor((diff%60000)/1000)).padStart(2,"0");
  };
  tick(); setInterval(tick,1000);
}
startBirthdayCountdown();

async function startMusic() {
  try { await bgm.play(); } catch {}
}

function getMusicVolume() {
  return spotifyController ? (bgm.dataset.spotifyPlaying === "true" ? 0.06 : 0.18) : 0.18;
}

async function switchMusic(src, { fadeMs = 700 } = {}) {
  const wasPlaying = !bgm.paused;
  const targetVolume = getMusicVolume();
  const startVolume = Math.min(bgm.volume, targetVolume);

  if (bgm.src.endsWith(src)) {
    if (wasPlaying) await startMusic();
    return;
  }

  const steps = 14;
  for (let i = steps; i >= 0 && !bgm.paused; i--) {
    bgm.volume = startVolume * (i / steps);
    await new Promise(resolve => setTimeout(resolve, fadeMs / steps));
  }

  bgm.pause();
  bgm.src = src;
  bgm.load();
  bgm.volume = 0;

  if (wasPlaying) {
    try { await bgm.play(); } catch {}
    for (let i = 1; i <= steps; i++) {
      bgm.volume = targetVolume * (i / steps);
      await new Promise(resolve => setTimeout(resolve, fadeMs / steps));
    }
  } else {
    bgm.volume = targetVolume;
  }
}

async function enterMemoryMusic() {
  if (memoryMusicActive) return;
  memoryMusicActive = true;
  await switchMusic(MEMORY_MUSIC);
}

async function leaveMemoryMusic() {
  if (!memoryMusicActive) return;
  memoryMusicActive = false;
  await switchMusic(ORIGINAL_MUSIC);
}

document.querySelectorAll(".music-control").forEach(btn => btn.addEventListener("click", async () => {
  if (bgm.paused) await startMusic(); else bgm.pause();
}));

function showScene(id) {
  const wasMemorySection = ["bookIntro", "bookSection"].includes(currentId);
  const isMemorySection = ["bookIntro", "bookSection"].includes(id);
  currentId = id;
  document.querySelectorAll("#app .screen").forEach(s => s.classList.remove("active-screen"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active-screen");
  window.scrollTo(0, 0);
  if (["dinnerInvite","rsvpConfirmed","photo1","photo2","photo3","photo4","photo5","bookSection","music","letter"].includes(id)) {
    spawnHearts(id === "letter" ? 18 : 5);
  }
  if (isMemorySection && !wasMemorySection) enterMemoryMusic();
  if (!isMemorySection && wasMemorySection && id === "music") leaveMemoryMusic();
  if (id === "letter") startLetterTyping();
  else typingRun++;
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScene(btn.dataset.next));
});

document.getElementById("restart").addEventListener("click", () => location.reload());

// Book: only the active page's content is visible. Hidden pages remain mounted for the flip animation,
// but their text/photo fades out before/after each page turn.
const book = document.getElementById("book");
const bookStatus = document.getElementById("bookStatus");
const bookPrev = document.getElementById("bookPrev");
const bookNext = document.getElementById("bookNext");
function renderBook() {
  book.classList.remove("open1", "open2");
  if (bookPage === 1) book.classList.add("open1");
  if (bookPage === 2) book.classList.add("open2");
  document.querySelectorAll(".book .page").forEach(pageEl => {
    const active = Number(pageEl.dataset.page) === bookPage;
    pageEl.classList.toggle("is-active", active);
    pageEl.setAttribute("aria-hidden", String(!active));
  });
  bookStatus.textContent = ["Cover", "Page 2", "Page 3"][bookPage];
  bookPrev.disabled = bookPage === 0;
  bookNext.disabled = bookPage === 2;
}
function advanceBook() {
  bookPage = bookPage < 2 ? bookPage + 1 : 0;
  renderBook();
}
document.getElementById("bookHotspot").addEventListener("click", advanceBook);
bookNext.addEventListener("click", () => { if (bookPage < 2) { bookPage += 1; renderBook(); } });
bookPrev.addEventListener("click", () => { if (bookPage > 0) { bookPage -= 1; renderBook(); } });
renderBook();

// Spotify playlist embed — official Spotify iFrame API. The MP3 above remains the ambient
// background soundtrack, while this embed keeps the user's playlist available separately.
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("spotify-embed");
  if (!element) return;
  IFrameAPI.createController(element, {
    width: "100%",
    height: 352,
    url: "https://open.spotify.com/playlist/2Y0a06MDJ7vlja3qj5dqLW"
  }, (controller) => {
    spotifyController = controller;
    controller.addListener("playback_started", () => {
      // Keep the user's background music present, but soften it while Spotify is playing.
      bgm.dataset.spotifyPlaying = "true";
      bgm.volume = 0.06;
    });
    controller.addListener("playback_update", (event) => {
      bgm.dataset.spotifyPlaying = event?.data?.isPaused ? "false" : "true";
      if (event?.data?.isPaused) bgm.volume = 0.18;
      else bgm.volume = 0.06;
    });
  });
};

const letterParagraphs = [...document.querySelectorAll("#letter .letter p")];
letterParagraphs.forEach((p) => {
  p.dataset.fullText = p.textContent.trim();
  p.textContent = "";
});

async function startLetterTyping() {
  const run = ++typingRun;
  letterParagraphs.forEach((p) => { p.textContent = ""; p.classList.remove("typed"); });
  const speed = 22;
  for (const p of letterParagraphs) {
    const text = p.dataset.fullText || "";
    for (let i = 0; i <= text.length; i++) {
      if (run !== typingRun || currentId !== "letter") return;
      p.textContent = text.slice(0, i) + (i < text.length ? "▌" : "");
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    p.classList.add("typed");
    await new Promise(resolve => setTimeout(resolve, 260));
  }
}

function spawnHearts(count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "particle";
    el.textContent = Math.random() > .5 ? "💙" : "💛";
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${4 + Math.random() * 5}s`;
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    el.style.fontSize = `${10 + Math.random() * 18}px`;
    hearts.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  }
}
setInterval(() => { if (currentId === "letter" || currentId === "rsvpConfirmed") spawnHearts(3); }, 2500);
