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
