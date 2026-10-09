
import { pipeline, env } from
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

const $ = (selector) => document.querySelector(selector);

const STORAGE_KEY = "ecoquest-journal-v1";
const ACTIVITY_KEY = "ecoquest-activity-v1";

const QUESTS = {
  leaf: {
    title: "Meet a leaf",
    description: "Observed three different leaf shapes.",
    minutes: 10
  },
  bird: {
    title: "Birdsong break",
    description: "Spent five quiet minutes listening outdoors.",
    minutes: 5
  },
  sky: {
    title: "Look up",
    description: "Took a mindful moment to observe the sky.",
    minutes: 5
  }
};

let selectedFile = null;
let classifier = null;
let currentPredictions = [];
let currentImageUrl = null;
let loadingModel = false;
let timerInterval = null;
let timerEnd = 0;
let toastTimeout;

// Use the official model repository. Model downloads need internet
// on first use. Transformers.js uses browser-side inference.
env.allowLocalModels = false;

function getJournal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setJournal(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    showToast("Storage is full. Try removing older photo entries.");
  }
}

function getActivities() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || {};
  } catch {
    return {};
  }
}

function saveActivities(activities) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
}

function todayKey() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function recordActivity(minutes = 0, completedQuest = false) {
  const activities = getActivities();
  const today = todayKey();

  if (!activities[today]) {
    activities[today] = { minutes: 0, quests: [] };
  }

  activities[today].minutes += minutes;
  saveActivities(activities);
  updateStats();
}

function updateStats() {
  const activities = getActivities();
  const today = todayKey();

  const todayMinutes = activities[today]?.minutes || 0;
  $("#minutes").textContent = `${todayMinutes} min`;
  $("#discoveries").textContent = getJournal().length;

  const days = Object.keys(activities)
    .filter(day => {
      const entry = activities[day];
      return entry.minutes > 0 || entry.quests?.length > 0;
    })
    .sort()
    .reverse();

  let streak = 0;
  const cursor = new Date();

  // Count consecutive active days, starting today.
  while (true) {
    const key = `${cursor.getFullYear()}-${String(
      cursor.getMonth() + 1
    ).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;

    if (!days.includes(key)) break;

    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  $("#streak").textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
}

function addJournalEntry(entry) {
  const entries = getJournal();

  entries.unshift({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    ...entry
  });

  // Avoid filling browser storage with many large photos.
  setJournal(entries.slice(0, 40));
  renderJournal();
  updateStats();
}

function renderJournal() {
  const entries = getJournal();
  const container = $("#journalList");

  $("#journalCount").textContent =
    `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`;

  if (!entries.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>📓</span>
        <h3>Your story starts outside</h3>
        <p>Complete a quest or save your first discovery to see it here.</p>
      </div>`;
    return;
  }

  container.replaceChildren();

  entries.forEach(entry => {
    const card = document.createElement("article");
    card.className = "journal-card";

    if (entry.image) {
      const img = document.createElement("img");
      img.src = entry.image;
      img.alt = "Saved nature discovery";
      card.append(img);
    }

    const type = document.createElement("span");
    type.className = "entry-type";
    type.textContent = entry.type === "quest" ? "OUTDOOR QUEST" : "AI DISCOVERY";

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const description = document.createElement("p");
    description.textContent = entry.description || "";

    const date = document.createElement("p");
    date.style.marginTop = "10px";
    date.textContent = new Date(entry.date).toLocaleDateString();

    const remove = document.createElement("button");
    remove.className = "delete-entry";
    remove.textContent = "Remove entry";
    remove.addEventListener("click", () => {
      setJournal(getJournal().filter(item => item.id !== entry.id));
      renderJournal();
      updateStats();
      showToast("Journal entry removed.");
    });

    card.append(type, title, description, date, remove);
    container.append(card);
  });
}

// Outdoor quest completion
document.querySelectorAll("[data-quest]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.quest;
    const quest = QUESTS[id];
    const activities = getActivities();
    const today = todayKey();

    if (!activities[today]) {
      activities[today] = { minutes: 0, quests: [] };
    }

    if (activities[today].quests.includes(id)) {
      showToast("You've already completed this quest today!");
      return;
    }

    activities[today].quests.push(id);
    activities[today].minutes += quest.minutes;
    saveActivities(activities);

    addJournalEntry({
      type: "quest",
      title: quest.title,
      description: quest.description
    });

    button.textContent = "Completed ✓";
    button.disabled = true;

    updateStats();
    showToast("Quest complete! Nice work getting outside 🌱");
  });
});

// Photo selection
$("#imageInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file.");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    showToast("Please choose an image smaller than 8 MB.");
    return;
  }

  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);

  selectedFile = file;
  currentImageUrl = URL.createObjectURL(file);

  $("#preview").src = currentImageUrl;
  $("#preview").style.display = "block";
  $("#uploadPlaceholder").style.display = "none";
  $("#analyzeBtn").disabled = false;
  $("#results").hidden = true;
  $("#aiStatus").textContent = "Photo ready. Let's explore!";
  currentPredictions = [];
});

async function getClassifier() {
  if (classifier) return classifier;

  if (loadingModel) {
    throw new Error("The AI model is already loading. Please wait.");
  }

  loadingModel = true;
  $("#aiStatus").textContent = "Downloading AI model… this may take a moment.";

  try {
    const modelId =
      "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k";

    // Try WebGPU first; fall back to WASM on unsupported devices.
    if ("gpu" in navigator) {
      try {
        classifier = await pipeline("image-classification", modelId, {
          device: "webgpu"
        });
      } catch (error) {
        console.warn("WebGPU unavailable; trying WASM.", error);
      }
    }

    if (!classifier) {
      classifier = await pipeline("image-classification", modelId, {
        device: "wasm"
      });
    }

    return classifier;
  } finally {
    loadingModel = false;
  }
}

function displayPredictions(predictions) {
  const list = $("#predictionList");
  list.replaceChildren();

  predictions.forEach(item => {
    const row = document.createElement("div");
    row.className = "prediction";

    const label = document.createElement("div");
    label.className = "prediction-label";

    const name = document.createElement("span");
    name.textContent = item.label;

    const score = document.createElement("span");
    score.textContent = `${(item.score * 100).toFixed(1)}%`;

    label.append(name, score);

    const track = document.createElement("div");
    track.className = "bar-track";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${Math.max(0, Math.min(100, item.score * 100))}%`;

    track.append(fill);
    row.append(label, track);
    list.append(row);
  });

  $("#results").hidden = false;
}

// Real open-weight model inference
$("#analyzeBtn").addEventListener("click", async () => {
  if (!selectedFile) return;

  const button = $("#analyzeBtn");
  button.disabled = true;
  $("#results").hidden = true;

  try {
    const model = await getClassifier();
    $("#aiStatus").textContent = "AI is examining your photo…";

    const predictions = await model(selectedFile, { topk: 5 });

    currentPredictions = predictions;
    displayPredictions(predictions);

    $("#aiStatus").textContent = "Analysis complete. Keep exploring!";
  } catch (error) {
    console.error(error);
    $("#aiStatus").textContent =
      `Could not run the AI model: ${error.message}. Check your connection and reload.`;
  } finally {
    button.disabled = !selectedFile;
  }
});

// Save predictions and the photo to the local journal.
$("#saveDiscovery").addEventListener("click", () => {
  if (!currentPredictions.length || !selectedFile) return;

  const top = currentPredictions[0];

  // Resize the photo before storing it to reduce storage usage.
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const maxDimension = 500;
    const scale = Math.min(
      1,
      maxDimension / Math.max(img.width, img.height)
    );

    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const savedImage = canvas.toDataURL("image/jpeg", 0.65);

    addJournalEntry({
      type: "discovery",
      title: top.label,
      description:
        `Top AI prediction: ${top.label} (${(top.score * 100).toFixed(1)}%). ` +
        "This is a general image classification result, not a verified identification.",
      image: savedImage
    });

    showToast("Discovery saved to your journal!");
  };

  img.onerror = () => showToast("Could not prepare the image.");
  img.src = currentImageUrl;
});

// Outdoor timer
$("#startTimer").addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    $("#startTimer").textContent = "Start 10-min break ↗";
    showToast("Timer stopped.");
    return;
  }

  timerEnd = Date.now() + 10 * 60 * 1000;
  $("#startTimer").textContent = "10:00 — Stop timer";

  timerInterval = setInterval(() => {
    const seconds = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    $("#startTimer").textContent =
      `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")} — Stop`;

    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      $("#startTimer").textContent = "Start 10-min break ↗";

      recordActivity(10);
      showToast("Ten minutes done! Thanks for taking a break 🌳");
    }
  }, 1000);

  showToast("Your outdoor break has started. Enjoy the world!");
});

// Initial UI state
renderJournal();
updateStats();