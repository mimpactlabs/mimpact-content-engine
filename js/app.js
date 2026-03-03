/* ======================================
   MIMPACT LABS – AI CHARACTER ENGINE
   Clean & Stable Production Version
====================================== */

/* =========================
   GLOBAL STATE
========================= */
let characters = JSON.parse(localStorage.getItem("characters")) || [];
let selectedIndex = null;

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
      (char.name || "No Name") +
      " (" + (char.age || "-") +
      " - " + (char.gender || "-") + ")";
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
   SAVE CHARACTER
========================= */
function saveCharacter() {
  const char = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    face: document.getElementById("face").value.trim(),
    hair: document.getElementById("hair").value.trim(),
    outfit: document.getElementById("outfit").value.trim(),
    style: document.getElementById("style").value.trim(),
    emotion: document.getElementById("emotion").value.trim(),
    personality: document.getElementById("personality").value.trim(),
    mood: document.getElementById("mood").value.trim(),

    // Voice Lock
    voiceTone: "warm cinematic narrator",
    pitch: "medium-low stable pitch",
    speakingSpeed: "natural steady pace",
    micType: "studio condenser microphone clarity",
    breathingStyle: "subtle natural breathing pattern",

    // 🔥 Timeline System
    timeline: [],
    currentEmotion: document.getElementById("emotion").value.trim() || "neutral"
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

  localStorage.setItem("characters", JSON.stringify(characters));
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

  document.getElementById("name").value = char.name || "";
  document.getElementById("age").value = char.age || "";
  document.getElementById("gender").value = char.gender || "";
  document.getElementById("face").value = char.face || "";
  document.getElementById("hair").value = char.hair || "";
  document.getElementById("outfit").value = char.outfit || "";
  document.getElementById("style").value = char.style || "";
  document.getElementById("emotion").value = char.emotion || "";
  document.getElementById("personality").value = char.personality || "";
  document.getElementById("mood").value = char.mood || "";
}

/* =========================
   DELETE CHARACTER
========================= */
function deleteCharacter() {
  if (selectedIndex === null) return;
  if (!confirm("Hapus karakter ini?")) return;

  characters.splice(selectedIndex, 1);
  localStorage.setItem("characters", JSON.stringify(characters));

  clearForm();
  refreshDropdown();
}

/* =========================
   CLEAR FORM
========================= */
function clearForm() {
  const ids = [
    "name", "age", "gender",
    "face", "hair", "outfit", "style",
    "emotion", "personality", "mood"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  selectedIndex = null;
}

/* =========================
   VISUAL HARD LOCK 2.0
========================= */
function buildVisualLock() {
  const faceAnchor = `
same exact face as previous frame,
identical facial bone structure,
same eye shape and spacing,
same nose bridge,
same jawline,
same lip structure,
same skin tone,
same age appearance`;

  const antiMorph = `
no face morphing,
no facial transformation,
no different person,
no identity change,
no aging,
no de-aging,
no face variation`;

  const hyperReality = `
ultra photorealistic,
hyper realistic skin texture,
real human pores,
cinematic lens realism,
natural lighting physics,
studio quality sharpness,
no CGI look,
no cartoon style,
no anime style`;

  return `${faceAnchor}, ${antiMorph}, ${hyperReality}`
    .replace(/\n/g, " ")
    .trim();
}

/* =========================
   VOICE LOCK
========================= */
function buildVoiceLock(char) {
  return `
consistent voice tone: ${char.voiceTone},
same speaker throughout the entire video,
fixed pitch: ${char.pitch},
stable speaking speed: ${char.speakingSpeed},
clear studio voice recording using ${char.micType},
${char.breathingStyle}`
    .replace(/\n/g, " ")
    .trim();
}

/* =========================
   NEGATIVE PROMPT ENGINE
========================= */
function buildNegativePrompt(model) {

  if (model !== "sdxl") return "";

  const negativeBlock = `
cartoon,
anime,
cgi,
3d render,
illustration,
stylized face,
different person,
face swap,
face morph,
aging,
de-aging,
low resolution,
blurry face,
distorted face,
extra eyes,
extra nose,
deformed facial structure,
plastic skin,
unrealistic skin,
oversmoothed skin`;

  return negativeBlock.replace(/\n/g, " ").trim();
}

/* =========================
   MODEL FORMATTER
========================= */
function formatByModel(model, baseCharacter, scene, consistency, negativePrompt) {

  if (model === "midjourney") {
    return `${baseCharacter}, ${scene}, ultra detailed, cinematic lighting, 8k, ${consistency} --ar 16:9 --v 6 --style raw`;
  }

  if (model === "sdxl") {
    return `
${baseCharacter}, 
${scene}, 
masterpiece, best quality, highly detailed, 
${consistency}
Negative prompt: ${negativePrompt}`
      .replace(/\n/g, " ")
      .trim();
  }

  if (model === "runway") {
    return `Cinematic film scene of ${baseCharacter}. ${scene}. ${consistency}. Shot on 35mm film, dramatic lighting, realistic motion.`;
  }

  return `${baseCharacter}, ${scene}, ${consistency}`;
}

/* =========================
   GENERATE PROMPT
========================= */
function generate() {

  const sceneInput = document.getElementById("scene").value.trim();
  const output = document.getElementById("output");

  if (!sceneInput) {
    output.innerText = "Masukkan adegan terlebih dahulu.";
    return;
  }

  if (selectedIndex === null) {
    output.innerText = "Pilih atau buat karakter terlebih dahulu.";
    return;
  }

  const char = characters[selectedIndex];

  const baseCharacter =
    `${char.name}, ${char.gender} berusia ${char.age} tahun, ` +
    `${char.face}, ${char.hair}, mengenakan ${char.outfit}, gaya ${char.style}, ` +
    `emotion ${char.emotion || "neutral"}, ` +
    `personality ${char.personality || "balanced"}, ` +
    `current mood ${char.mood || "stable"}`;

  let consistency = buildVisualLock();

  const mode = document.getElementById("mode").value;
  if (mode === "video" || mode === "story" || mode === "chat") {
    consistency += ", " + buildVoiceLock(char);
  }

  const outfitLock = document.getElementById("outfitLock").checked;
  const variation = document.getElementById("outfitVariation").value.trim();

  if (outfitLock && variation) {
    consistency += `, outfit variation: ${variation}`;
  } else {
    consistency += ", maintain core outfit identity";
  }

  const model = document.getElementById("model").value;
  const negativePrompt = buildNegativePrompt(model);

  const finalPrompt = formatByModel(
    model,
    baseCharacter,
    sceneInput,
    consistency,
    negativePrompt
  );

  output.innerText = finalPrompt;
}

/* =========================
   INIT SYSTEM
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
