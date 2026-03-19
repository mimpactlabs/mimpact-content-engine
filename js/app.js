/* ======================================
MIMPACT LABS – AI CHARACTER ENGINE
CLEAN STABLE BUILD (BEGINNER SAFE)
====================================== */

/* =========================
STORAGE
========================= */

function loadFromStorage(){
  try{
    const data = localStorage.getItem("characters")
    return data ? JSON.parse(data) : []
  }catch(e){
    console.warn("Storage reset")
    localStorage.removeItem("characters")
    return []
  }
}

let characters = loadFromStorage()
let selectedIndex = null

function saveToStorage(){
  localStorage.setItem("characters", JSON.stringify(characters))
}

/* =========================
HELPERS
========================= */

function val(id){
  return document.getElementById(id)?.value?.trim() || ""
}

function clearForm(){

  const fields=[
    "name","age","gender",
    "face","hair","skin","body",
    "outfit","style",
    "emotion","personality","archetype","mood",
    "voiceModel","voiceStyle"
  ]

  fields.forEach(id=>{
    const el=document.getElementById(id)
    if(el) el.value=""
  })

  selectedIndex=null
}

/* =========================
EMOTION DETECTOR
========================= */

function detectEmotion(scene){

  const text = scene.toLowerCase()

  const map = {
    angry:["marah","angry"],
    sad:["sedih","cry"],
    happy:["happy","bahagia"],
    romantic:["romantis","love"],
    fearful:["takut","dark"],
    shocked:["shock","terkejut"]
  }

  for(const key in map){
    if(map[key].some(word => text.includes(word))){
      return key
    }
  }

  return null
}

/* =========================
MATERIAL DETECTOR
========================= */

function detectMaterialFromScene(scene){

  const text = scene.toLowerCase()

  const map = {
    light:["cotton","kapas","paper","kertas","leaf","daun","dust"],
    medium:["cloth","kain","plastic"],
    heavy:["metal","besi","stone","batu"]
  }

  for(const type in map){
    if(map[type].some(word => text.includes(word))){
      return type
    }
  }

  return "medium"
}

/* =========================
CHARACTER LIST
========================= */

function refreshDropdown(){

  const select=document.getElementById("characterSelect")
  if(!select) return

  select.innerHTML=""

  characters.forEach((char,index)=>{
    const option=document.createElement("option")
    option.value=index
    option.textContent=`${char.name || "No Name"}`
    select.appendChild(option)
  })

  if(characters.length>0){

    if(selectedIndex !== null){
      select.value = selectedIndex
    }else{
      selectedIndex = 0
      select.value = 0
    }

    loadCharacter(select.value)
  }
}

/* =========================
ADD
========================= */

function addCharacter(){

  const name=prompt("Masukkan nama karakter")
  if(!name) return

  characters.push({
    name:name,
    timeline:[],
    currentEmotion:"neutral",
    outfits:[]
  })

  saveToStorage()
  refreshDropdown()
}

/* =========================
SAVE
========================= */

function saveCharacter(){

  const name = val("name")
  if(!name){
    alert("Nama wajib diisi")
    return
  }

  const emotionValue = val("emotion") || "neutral"

  const existing = selectedIndex !== null ? characters[selectedIndex] : {}

  const char = {

    name:name,
    age:val("age"),
    gender:val("gender"),

    face:val("face"),
    hair:val("hair"),
    skin:val("skin"),
    body:val("body"),

    outfit:val("outfit"),
    style:val("style"),

    emotion:emotionValue,
    personality:val("personality"),
    archetype:val("archetype"),
    mood:val("mood"),

    voiceModel:val("voiceModel") || "male narrator",
    voiceStyle:val("voiceStyle") || "calm confident",
    voiceSpeed:"medium",

    timeline: existing.timeline || [],
    currentEmotion: existing.currentEmotion || emotionValue,
    outfits: existing.outfits || []

  }

  if(selectedIndex !== null){
    characters[selectedIndex] = char
  }else{
    characters.push(char)
  }

  saveToStorage()
  clearForm()
  refreshDropdown()
}

/* =========================
LOAD
========================= */

function loadCharacter(index){

  selectedIndex = Number(index)

  const char = characters[selectedIndex]
  if(!char) return

  const fields=[
    "name","age","gender",
    "face","hair","skin","body",
    "outfit","style",
    "emotion","personality","archetype","mood",
    "voiceModel","voiceStyle"
  ]

  fields.forEach(id=>{
    const el=document.getElementById(id)
    if(el) el.value = char[id] || ""
  })

  renderOutfits()
  renderTimeline()
}

/* =========================
DELETE
========================= */

function deleteCharacter(){

  if(selectedIndex===null) return
  if(!confirm("Hapus karakter?")) return

  characters.splice(selectedIndex,1)

  saveToStorage()
  clearForm()
  refreshDropdown()
}

/* =========================
OUTFIT
========================= */

function addOutfit(){

  const input=document.getElementById("extraOutfit")
  if(!input) return

  const outfit=input.value.trim()
  if(!outfit) return

  if(selectedIndex===null){
    alert("Pilih karakter dulu")
    return
  }

  const char=characters[selectedIndex]

  if(!char.outfits) char.outfits=[]

  char.outfits.push(outfit)

  saveToStorage()
  renderOutfits()

  input.value=""
}

function renderOutfits(){

  const list=document.getElementById("outfitList")
  if(!list) return

  list.innerHTML=""

  if(selectedIndex===null) return

  const char=characters[selectedIndex]
  if(!char.outfits) return

  char.outfits.forEach(o=>{
    const li=document.createElement("li")
    li.textContent=o
    list.appendChild(li)
  })
}

/* =========================
TIMELINE
========================= */

function updateTimeline(char,scene){

  if(!char.timeline) char.timeline=[]

  const before=char.currentEmotion || "neutral"

  const detected=detectEmotion(scene)
  if(detected) char.currentEmotion=detected

  char.timeline.push({
    scene:scene,
    emotionBefore:before,
    emotionAfter:char.currentEmotion,
    time:new Date().toISOString()
  })

  saveToStorage()
}

function renderTimeline(){

  const list=document.getElementById("timelineList")
  if(!list) return

  list.innerHTML=""

  if(selectedIndex===null) return

  const char=characters[selectedIndex]
  if(!char.timeline) return

  char.timeline.forEach(t=>{
    const li=document.createElement("li")
    li.textContent=`${t.scene} | ${t.emotionBefore} → ${t.emotionAfter}`
    list.appendChild(li)
  })
}

/* =========================
PROMPT GENERATOR
========================= */

function generate(){

  const sceneEl=document.getElementById("scene")
  const output=document.getElementById("output")

  if(!sceneEl||!output) return

  const scene=sceneEl.value.trim()

  if(!scene){
    output.innerText="Isi adegan dulu"
    return
  }

  if(selectedIndex===null){
    output.innerText="Pilih karakter"
    return
  }

  const char=characters[selectedIndex]
  if(!char) return

  const material = detectMaterialFromScene(scene)

  const prompt = `
${char.name}, ${char.gender}, ${char.age} tahun,
${char.body}, ${char.skin}, ${char.face}, ${char.hair},
wearing ${char.outfit},
emotion ${char.currentEmotion},
scene: ${scene},
material: ${material},
cinematic, ultra realistic
`

  updateTimeline(char,scene)
  renderTimeline()

  output.innerText=prompt

  console.log("Generated:", prompt)
}

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded",function(){

  const select=document.getElementById("characterSelect")

  if(select){
    select.addEventListener("change",function(){
      loadCharacter(this.value)
    })
  }

  refreshDropdown()
})
