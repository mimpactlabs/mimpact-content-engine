<script>
let characters = JSON.parse(localStorage.getItem("characters")) || [];
let selectedIndex = null;

/* =========================
   REFRESH DROPDOWN
========================= */
function refreshDropdown() {
  const select = document.getElementById("characterSelect");
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
   SAVE / UPDATE CHARACTER
========================= */
function saveCharacter() {
  const char = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    face: document.getElementById("face").value.trim(),
    hair: document.getElementById("hair").value.trim(),
    outfit: document.getElementById("outfit").value.trim(),
    style: document.getElementById("style").value.trim()
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
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("face").value = "";
  document.getElementById("hair").value = "";
  document.getElementById("outfit").value = "";
  document.getElementById("style").value = "";

  selectedIndex = null;
}

/* =========================
   MODEL FORMATTER
========================= */
function formatByModel(model, baseCharacter, scene, consistency) {

  if (model === "midjourney") {
    return `${baseCharacter}, ${scene}, ultra detailed, cinematic lighting, 8k, ${consistency} --ar 16:9 --v 6 --style raw`;
  }

  if (model === "sdxl") {
    return `${baseCharacter}, ${scene}, masterpiece, best quality, highly detailed, ${consistency}`;
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
    `${char.face}, ${char.hair}, mengenakan ${char.outfit}, gaya ${char.style}`;

  let consistency =
    "same person, identical face, same bone structure, same age, preserve identity";

  const outfitLock = document.getElementById("outfitLock").checked;
  const variation = document.getElementById("outfitVariation").value.trim();

  if (outfitLock && variation) {
    consistency += `, outfit variation: ${variation}`;
  } else {
    consistency += ", maintain core outfit identity";
  }

  const model = document.getElementById("model").value;

  const finalPrompt = formatByModel(
    model,
    baseCharacter,
    sceneInput,
    consistency
  );

  output.innerText = finalPrompt;
}

/* =========================
   INIT SYSTEM
========================= */
document.getElementById("characterSelect")
  .addEventListener("change", function () {
    loadCharacter(this.value);
  });

refreshDropdown();
</script>


/* ===============================
   MIMPACT AI CHARACTER ENGINE
   Phase 2 Core System
================================= */

let characters = []
let activeCharacterId = null

/* ===============================
   CHARACTER MODEL
================================= */

function createCharacter(name, age, gender) {
    return {
        id: Date.now(),
        name: name,
        age: age,
        gender: gender,

        baseAppearance: "",
        personality: "",
        emotionState: "neutral",

        outfit: {
            locked: false,
            description: ""
        },

        memory: [],
        timeline: []
    }
}

/* ===============================
   CHARACTER CRUD
================================= */

function saveCharacter() {
    const name = document.getElementById("charName").value
    const age = document.getElementById("charAge").value
    const gender = document.getElementById("charGender").value

    if (!name) {
        alert("Nama karakter wajib diisi")
        return
    }

    const newChar = createCharacter(name, age, gender)
    characters.push(newChar)

    renderCharacterList()
    document.getElementById("charName").value = ""
}

function deleteCharacter() {
    if (!activeCharacterId) return

    characters = characters.filter(c => c.id !== activeCharacterId)
    activeCharacterId = null

    renderCharacterList()
}

function renderCharacterList() {
    const list = document.getElementById("characterList")
    list.innerHTML = ""

    characters.forEach(char => {
        const option = document.createElement("option")
        option.value = char.id
        option.textContent = `${char.name} (${char.age} - ${char.gender})`
        list.appendChild(option)
    })
}

function selectCharacter() {
    const id = document.getElementById("characterList").value
    activeCharacterId = Number(id)
}

/* ===============================
   MEMORY SYSTEM
================================= */

function addMemory(text) {
    const char = getActiveCharacter()
    if (!char) return

    char.memory.push(text)
}

function getMemorySummary(char) {
    return char.memory.slice(-5).join(", ")
}

/* ===============================
   TIMELINE SYSTEM
================================= */

function addScene(sceneText) {
    const char = getActiveCharacter()
    if (!char) return

    char.timeline.push({
        time: new Date().toLocaleString(),
        scene: sceneText
    })
}

/* ===============================
   PROMPT ENGINE
================================= */

function generatePrompt() {
    const char = getActiveCharacter()
    if (!char) {
        alert("Pilih karakter dulu")
        return
    }

    const sceneInput = document.getElementById("sceneInput").value
    if (!sceneInput) {
        alert("Tulis adegan dulu")
        return
    }

    addScene(sceneInput)

    let prompt = ""

    prompt += `${char.name}, ${char.age} year old ${char.gender}. `
    prompt += `${char.baseAppearance}. `
    prompt += `Personality: ${char.personality}. `
    prompt += `Current emotion: ${char.emotionState}. `

    if (char.outfit.locked) {
        prompt += `Wearing: ${char.outfit.description}. `
    }

    const memorySummary = getMemorySummary(char)
    if (memorySummary) {
        prompt += `Recent memory: ${memorySummary}. `
    }

    prompt += `Scene: ${sceneInput}. `
    prompt += `Cinematic, high detail, storytelling.`

    document.getElementById("outputPrompt").value = prompt
}

/* ===============================
   UTIL
================================= */

function getActiveCharacter() {
    return characters.find(c => c.id === activeCharacterId)
}

/* ===============================
   EXPORT / IMPORT
================================= */

function exportCharacter() {
    const char = getActiveCharacter()
    if (!char) return

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", char.name + ".json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
}

function importCharacter(event) {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = function(e) {
        const charData = JSON.parse(e.target.result)
        characters.push(charData)
        renderCharacterList()
    }

    reader.readAsText(file)
}
