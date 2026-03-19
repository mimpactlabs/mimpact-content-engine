/* ======================================
MIMPACT LABS – AI CHARACTER ENGINE
LEVEL 2 (PHYSICS + MOTION) CLEAN BUILD
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
PHYSICS ENGINE
========================= */

function getPhysicsBehavior(material){
  const physics = {
    light: "floating, slow motion, soft movement, affected by wind",
    medium: "natural movement, balanced weight",
    heavy: "heavy weight, slow acceleration, strong impact"
  }

  return physics[material] || physics.medium
}

/* =========================
CAMERA ENGINE
========================= */

function getCameraMotion(emotion){
  const cameraMap = {
    angry: "handheld shaky camera, aggressive close up",
    sad: "slow zoom in, emotional cinematic",
    happy: "smooth tracking shot, bright tone",
    romantic: "soft focus, cinematic dolly",
    fearful: "tight frame, suspense push",
    shocked: "quick zoom, sudden movement"
  }

  return cameraMap[emotion] || "cinematic natural camera"
}

/* =========================
ACTION GENERATOR
========================= */

function generateAction(scene, emotion){

  const text = scene.toLowerCase()

  if(text.includes("lari")) return "running fast"
  if(text.includes("jalan")) return "walking naturally"
  if(text.includes("duduk")) return "sitting calmly"
  if(text.includes("jatuh")) return "falling with impact"

  if(emotion==="angry") return "aggressive movement"
  if(emotion==="sad") return "slow weak movement"

  return "natural movement"
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
    option.textContent=char.name || "No Name"
    select.appendChild(option)
  })

  if(characters.length>0){

    if(selectedIndex!==null){
      select.value=selectedIndex
    }else{
      selectedIndex=0
      select.value=0
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

  const name=val("name")
  if(!name){
    alert("Nama wajib diisi")
    return
  }

  const emotionValue = val("emotion") || "neutral"
  const existing = selectedIndex!==null ? characters[selectedIndex] : {}

  const char={
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

  if(selectedIndex!==null){
    characters[selectedIndex]=char
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

  selectedIndex=Number(index)

  const char=characters[selectedIndex]
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
    if(el) el.value=char[id]||""
  })

  renderOutfits()
  renderTimeline()
}

/* =========================
TIMELINE
========================= */

function updateTimeline(char,scene){

  const before=char.currentEmotion || "neutral"

  const detected=detectEmotion(scene)
  if(detected) char.currentEmotion=detected

  char.timeline.push({
    scene,
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
PROMPT GENERATOR (FINAL)
========================= */

function generate(){

  const sceneEl=document.getElementById("scene")
  const output=document.getElementById("output")

  if(!sceneEl || !output) return

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
  const physics = getPhysicsBehavior(material)
  const emotion = char.currentEmotion || char.emotion || "neutral"
  const camera = getCameraMotion(emotion)
  const action = generateAction(scene, emotion)

  const prompt = `
${char.name}, ${char.gender}, ${char.age} tahun,
${char.body}, ${char.skin}, ${char.face}, ${char.hair},

wearing ${char.outfit},
emotion ${emotion},

action: ${action},
scene: ${scene},

material: ${material},
physics: ${physics},
camera: ${camera},

cinematic, ultra realistic, high detail
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
