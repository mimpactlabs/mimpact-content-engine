/* ======================================
MIMPACT LABS – AI CHARACTER ENGINE
CLEAN FULL STABLE BUILD (NO ERROR)
====================================== */

/* =========================
STORAGE
========================= */

function loadFromStorage(){
  try{
    return JSON.parse(localStorage.getItem("characters")) || []
  }catch(e){
    console.warn("Reset storage")
    localStorage.removeItem("characters")
    return []
  }
}

let characters = loadFromStorage()
let selectedIndex = null

function save(){
  localStorage.setItem("characters", JSON.stringify(characters))
}

/* =========================
HELPERS
========================= */

function val(id){
  return document.getElementById(id)?.value?.trim() || ""
}

/* =========================
CHARACTER LIST (UI)
========================= */

function renderCharacterList(){
  const list = document.getElementById("characterList")
  if(!list) return

  list.innerHTML = ""

  characters.forEach((c,i)=>{
    const li = document.createElement("li")
    li.textContent = c.name || "No Name"
    li.onclick = ()=>loadCharacter(i)
    list.appendChild(li)
  })
}

function refreshDropdown(){

  const select = document.getElementById("characterSelect")
  if(!select) return

  select.innerHTML = ""

  characters.forEach((c,i)=>{
    const opt = document.createElement("option")
    opt.value = i
    opt.textContent = c.name || "No Name"
    select.appendChild(opt)
  })

  if(characters.length){
    if(selectedIndex === null){
      selectedIndex = 0
    }
    select.value = selectedIndex
    loadCharacter(selectedIndex)
  }
}

/* =========================
ADD / SAVE / LOAD / DELETE
========================= */

function addCharacter(){

  const name = prompt("Masukkan nama karakter")
  if(!name) return

  characters.push({
    name,
    timeline:[],
    currentEmotion:"neutral",
    outfits:[]
  })

  save()
  refreshDropdown()
  renderCharacterList()
}

function saveCharacter(){

  const name = val("name")
  if(!name) return alert("Nama wajib diisi")

  const old = selectedIndex !== null ? characters[selectedIndex] : {}

  const char = {

    name,
    age:val("age"),
    gender:val("gender"),

    face:val("face"),
    hair:val("hair"),
    skin:val("skin"),
    body:val("body"),

    outfit:val("outfit"),
    style:val("style"),

    emotion:val("emotion") || "neutral",
    personality:val("personality"),
    archetype:val("archetype"),
    mood:val("mood"),

    voiceModel:val("voiceModel") || "male narrator",
    voiceStyle:val("voiceStyle") || "calm confident",
    voiceSpeed:document.getElementById("voiceSpeed")?.value || "medium",

    timeline: old.timeline || [],
    currentEmotion: old.currentEmotion || "neutral",
    outfits: old.outfits || []

  }

  if(selectedIndex !== null){
    characters[selectedIndex] = char
  }else{
    characters.push(char)
  }

  save()
  refreshDropdown()
  renderCharacterList()
}

function loadCharacter(i){

  selectedIndex = Number(i)

  const c = characters[selectedIndex]
  if(!c) return

  const fields=[
    "name","age","gender",
    "face","hair","skin","body",
    "outfit","style",
    "emotion","personality","archetype","mood",
    "voiceModel","voiceStyle"
  ]

  fields.forEach(id=>{
    const el = document.getElementById(id)
    if(el) el.value = c[id] || ""
  })

  const voiceSpeed = document.getElementById("voiceSpeed")
  if(voiceSpeed) voiceSpeed.value = c.voiceSpeed || "medium"

  renderOutfits()
  renderTimeline()
}

function deleteCharacter(){

  if(selectedIndex === null) return
  if(!confirm("Hapus karakter?")) return

  characters.splice(selectedIndex,1)
  selectedIndex = null

  save()
  refreshDropdown()
  renderCharacterList()
}

/* =========================
OUTFIT SYSTEM
========================= */

function addOutfit(){

  if(selectedIndex === null){
    alert("Pilih karakter dulu")
    return
  }

  const input = document.getElementById("extraOutfit")
  if(!input) return

  const value = input.value.trim()
  if(!value) return

  characters[selectedIndex].outfits.push(value)

  input.value = ""
  save()
  renderOutfits()
}

function renderOutfits(){

  const list = document.getElementById("outfitList")
  if(!list) return

  list.innerHTML = ""

  if(selectedIndex === null) return

  const c = characters[selectedIndex]
  if(!c || !c.outfits) return

  c.outfits.forEach(o=>{
    const li = document.createElement("li")
    li.textContent = o
    list.appendChild(li)
  })
}

/* =========================
TIMELINE
========================= */

function detectEmotion(text){
  text = text.toLowerCase()

  if(text.includes("marah")) return "angry"
  if(text.includes("sedih")) return "sad"
  if(text.includes("bahagia") || text.includes("happy")) return "happy"

  return null
}

function updateTimeline(c,scene){

  const before = c.currentEmotion || "neutral"

  const detected = detectEmotion(scene)
  if(detected) c.currentEmotion = detected

  c.timeline.push({
    scene,
    before,
    after:c.currentEmotion,
    time:new Date().toISOString()
  })

  save()
}

function renderTimeline(){

  const list = document.getElementById("timelineList")
  if(!list) return

  list.innerHTML = ""

  if(selectedIndex === null) return

  const c = characters[selectedIndex]
  if(!c.timeline) return

  c.timeline.forEach(t=>{
    const li = document.createElement("li")
    li.textContent = `${t.scene} | ${t.before} → ${t.after}`
    list.appendChild(li)
  })
}

/* =========================
PHYSICS ENGINE
========================= */

function detectMaterial(scene){

  const text = scene.toLowerCase()

  if(text.includes("daun") || text.includes("kertas")) return "light"
  if(text.includes("besi") || text.includes("batu")) return "heavy"

  return "medium"
}

function getPhysics(m){
  return {
    light:"floating, soft movement",
    medium:"natural motion",
    heavy:"strong impact, heavy weight"
  }[m]
}

function getCamera(e){
  return {
    angry:"shaky close up",
    sad:"slow zoom cinematic",
    happy:"smooth tracking shot"
  }[e] || "cinematic camera"
}

/* =========================
PROMPT GENERATOR
========================= */

function generate(){

  const scene = val("scene")
  if(!scene) return alert("Isi adegan dulu")

  if(selectedIndex === null){
    return alert("Pilih karakter dulu")
  }

  const c = characters[selectedIndex]

  const material = val("materialType") || detectMaterial(scene)
  const physics = getPhysics(material)
  const camera = getCamera(c.currentEmotion)

  const prompt = `
${c.name}, ${c.gender}, ${c.age}
${c.face}, ${c.hair}, ${c.body}

wearing ${c.outfit}
emotion ${c.currentEmotion}

scene: ${scene}

material: ${material}
physics: ${physics}
camera: ${camera}

cinematic, ultra realistic
`

  updateTimeline(c,scene)
  renderTimeline()

  document.getElementById("output").innerText = prompt
}

/* =========================
EXPORT / IMPORT
========================= */

function exportCharacter(){
  if(selectedIndex === null) return

  const data = JSON.stringify(characters[selectedIndex],null,2)
  downloadJSON(data,"character.json")
}

function exportAllCharacters(){
  const data = JSON.stringify(characters,null,2)
  downloadJSON(data,"characters.json")
}

function downloadJSON(data,filename){
  const blob = new Blob([data],{type:"application/json"})
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

function importCharacter(e){

  const file = e.target.files[0]
  if(!file) return

  const reader = new FileReader()

  reader.onload = function(event){
    try{
      const data = JSON.parse(event.target.result)

      if(Array.isArray(data)){
        characters = characters.concat(data)
      }else{
        characters.push(data)
      }

      save()
      refreshDropdown()
      renderCharacterList()

    }catch{
      alert("File tidak valid")
    }
  }

  reader.readAsText(file)
}

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded",function(){

  const select = document.getElementById("characterSelect")

  if(select){
    select.addEventListener("change",e=>{
      loadCharacter(Number(e.target.value))
    })
  }

  refreshDropdown()
  renderCharacterList()
})
