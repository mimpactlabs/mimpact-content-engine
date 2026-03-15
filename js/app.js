/* ======================================
   MIMPACT LABS – AI CHARACTER ENGINE
   Production Safe Version
====================================== */

/* =========================
   SAFE STORAGE LOADER
========================= */
function loadFromStorage() {
  try {
    const data = localStorage.getItem("characters");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Storage corrupt. Resetting.");
    localStorage.removeItem("characters");
    return [];
  }
}

let characters = loadFromStorage();
let selectedIndex = null;

/* =========================
   SAVE TO STORAGE
========================= */
function saveToStorage() {
  localStorage.setItem("characters", JSON.stringify(characters));
}

/* =========================
   CLEAR FORM (ADDED - SAFE)
========================= */
function clearForm() {
  const fields = [
    "name","age","gender","face","hair",
    "outfit","style","emotion","personality","mood"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  selectedIndex = null;
}

/* =========================
   EMOTION DETECTOR
========================= */
function detectEmotion(sceneText) {
  const text = sceneText.toLowerCase();

  if (text.includes("marah") || text.includes("angry")) return "angry";
  if (text.includes("sedih") || text.includes("cry")) return "sad";
  if (text.includes("bahagia") || text.includes("happy")) return "happy";
  if (text.includes("romantis") || text.includes("love")) return "romantic";
  if (text.includes("takut") || text.includes("dark")) return "fearful";
  if (text.includes("terkejut") || text.includes("shock")) return "shocked";

  return null;
}

/* =========================
   REFRESH DROPDOWN
========================= */
function refreshDropdown() {
  const select = document.getElementById("characterSelect");
  if (!select) return;

  select.innerHTML = "";

  characters.forEach((char, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent =
      `${char.name || "No Name"} (${char.age || "-"} - ${char.gender || "-"})`;
    select.appendChild(option);
  });

  if (characters.length > 0) {
    select.value = characters.length - 1;
    loadCharacter(select.value);
  } else {
    selectedIndex = null;
  }
}

/* =========================
Add Character
========================= */

function addCharacter(){

 const name = prompt("Masukkan nama karakter")

 if(!name) return

 const newCharacter = {
   name: name,
   timeline: [],
   currentEmotion: "neutral"
 }

 characters.push(newCharacter)

 saveToStorage()
 refreshDropdown()
}

function renderCharacters(){

 const list = document.getElementById("characterList")

 if(!list) return

 list.innerHTML = ""

 characters.forEach(char => {

   const li = document.createElement("li")

   li.innerText = char.name

   list.appendChild(li)

 })

}

/* =========================
   extraOutfit
========================= */
function addOutfit(){

 const outfitInput = document.getElementById("extraOutfit")

 if(!outfitInput) return

 const outfit = outfitInput.value.trim()

 if(!outfit) return

 if(selectedIndex === null){
   alert("Pilih karakter dulu")
   return
 }

 const char = characters[selectedIndex]

 if(!char.outfits){
   char.outfits = []
 }

 char.outfits.push(outfit)

 saveToStorage()
 renderOutfits()

 outfitInput.value = ""

}

/* =========================
   Tampilkan Outfit
========================= */
function renderOutfits(){

 const list = document.getElementById("outfitList")

 if(!list) return

 list.innerHTML = ""

 if(selectedIndex === null) return

 const char = characters[selectedIndex]

 if(!char.outfits) return

 char.outfits.forEach(o => {

   const li = document.createElement("li")
   li.textContent = o

   list.appendChild(li)

 })

}


/* =========================
   SAVE CHARACTER
========================= */
function saveCharacter() {

  const nameEl = document.getElementById("name");
  if (!nameEl) return;

  const emotionValue =
    document.getElementById("emotion")?.value.trim() || "neutral";

  const char = {
    name: nameEl.value.trim(),
    age: document.getElementById("age")?.value.trim(),
    gender: document.getElementById("gender")?.value.trim(),
    face: document.getElementById("face")?.value.trim(),
    hair: document.getElementById("hair")?.value.trim(),
    outfit: document.getElementById("outfit")?.value.trim(),
    style: document.getElementById("style")?.value.trim(),
    emotion: emotionValue,
    personality: document.getElementById("personality")?.value.trim(),
    mood: document.getElementById("mood")?.value.trim(),

    voiceTone: "warm cinematic narrator",
    pitch: "medium-low stable pitch",
    speakingSpeed: "natural steady pace",
    micType: "studio condenser microphone clarity",
    breathingStyle: "subtle natural breathing pattern",

    timeline: [],
    currentEmotion: emotionValue
  };

  if (!char.name) {
    alert("Nama karakter wajib diisi.");
    return;
  }

  if (selectedIndex !== null) {
    characters[selectedIndex] = char;
  } else {
    characters.push(char);
  }

  saveToStorage();
  clearForm();
  refreshDropdown();
}

/* =========================
   LOAD CHARACTER
========================= */
function loadCharacter(index) {
  selectedIndex = Number(index);
  const char = characters[selectedIndex];
  if (!char) return;

  const fields = [
    "name","age","gender","face","hair",
    "outfit","style","emotion","personality","mood"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = char[id] || "";
  });
   
     renderOutfits()
}

/* =========================
   DELETE CHARACTER
========================= */
function deleteCharacter() {
  if (selectedIndex === null) return;
  if (!confirm("Hapus karakter ini?")) return;

  characters.splice(selectedIndex, 1);
  saveToStorage();
  clearForm();
  refreshDropdown();
}

/* =========================
   EXPORT SYSTEM
========================= */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCharacter() {
  if (selectedIndex === null) {
    alert("Pilih karakter terlebih dahulu.");
    return;
  }
  downloadJSON(characters[selectedIndex], `${characters[selectedIndex].name}.json`);
}

function exportAllCharacters() {
  if (!characters.length) {
    alert("Belum ada karakter.");
    return;
  }
  downloadJSON(characters, "mimpact_backup.json");
}

/* =========================
   IMPORT SYSTEM
========================= */
function importCharacter(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      const valid = (obj) => obj.name && obj.timeline;

      if (Array.isArray(data)) {
        data.filter(valid).forEach(d => characters.push(d));
      } else if (valid(data)) {
        characters.push(data);
      } else {
        throw new Error("Invalid structure");
      }

      saveToStorage();
      refreshDropdown();
      alert("Import berhasil!");

    } catch {
      alert("File JSON tidak valid.");
    }
  };

  reader.readAsText(file);
}

/* =========================
   TIMELINE SYSTEM
========================= */
function updateTimeline(char, sceneInput) {

  if (!char.timeline) char.timeline = [];

  const emotionBefore = char.currentEmotion || "neutral";
  const detectedEmotion = detectEmotion(sceneInput);

  if (detectedEmotion) {
    char.currentEmotion = detectedEmotion;
  }

  char.timeline.push({
    scene: sceneInput,
    emotionBefore,
    emotionAfter: char.currentEmotion,
    timestamp: new Date().toISOString()
  });

  saveToStorage();
}

/* =========================
   VISUAL + VOICE LOCK
========================= */
function buildVisualLock() {
  return "same exact face, no morphing, hyper realistic, cinematic lighting";
}

function buildVoiceLock(char) {
  return `consistent voice tone ${char.voiceTone}, fixed pitch ${char.pitch}`;
}

/* =========================
   MODEL SPECIFIC PROMPT
========================= */

function applyModelStyle(prompt, model){

  if(model === "midjourney"){
    return prompt + " --ar 9:16 --style raw --v 6"
  }

  if(model === "sdxl"){
    return prompt + ", ultra detailed, photorealistic, cinematic lighting"
  }

  if(model === "runway"){
    return prompt + ", cinematic video shot, natural motion, film lighting"
  }

  return prompt
}

/* =========================
   GENERATE PROMPT
========================= */
function generate() {

  const sceneEl = document.getElementById("scene");
  const output = document.getElementById("output");

  if (!sceneEl || !output) return;

  const sceneInput = sceneEl.value.trim();

  if (!sceneInput) {
    output.innerText = "Masukkan adegan terlebih dahulu.";
    return;
  }

  if (selectedIndex === null) {
    output.innerText = "Pilih atau buat karakter terlebih dahulu.";
    return;
  }

  const char = characters[selectedIndex];

  if (!char.currentEmotion) {
    char.currentEmotion = char.emotion || "neutral";
  }

 let outfitText = char.outfit || ""

if(char.outfits && char.outfits.length > 0){
  outfitText = char.outfits[0]
}

const baseCharacter =
`${char.name}, ${char.gender}, ${char.age} tahun, wearing ${outfitText}, emotion ${char.currentEmotion}`;
const model = document.getElementById("model")?.value

let finalPrompt =
`${baseCharacter}, ${sceneInput}, ${buildVisualLock()}, ${buildVoiceLock(char)}`

finalPrompt = applyModelStyle(finalPrompt, model)

updateTimeline(char, sceneInput)
output.innerText = finalPrompt
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", function () {

  const select = document.getElementById("characterSelect");
  if (select) {
    select.addEventListener("change", function () {
      loadCharacter(this.value);
    });
  }

  refreshDropdown();
});
