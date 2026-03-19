/* ======================================
MIMPACT LABS – AI CHARACTER ENGINE
LEVEL 3 CLEAN STABLE (NO ERROR)
====================================== */

/* =========================
STORAGE
========================= */

function loadFromStorage(){
  try{
    return JSON.parse(localStorage.getItem("characters")) || []
  }catch(e){
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
HELPER
========================= */

function val(id){
  return document.getElementById(id)?.value?.trim() || ""
}

/* =========================
CHARACTER UI
========================= */

function renderCharacterList(){
  const list = document.getElementById("characterList")
  if(!list) return

  list.innerHTML = ""

  characters.forEach((c,i)=>{
    const li=document.createElement("li")
    li.textContent=c.name || "No Name"
    li.onclick=()=>loadCharacter(i)
    list.appendChild(li)
  })
}

function refreshDropdown(){

  const select=document.getElementById("characterSelect")
  const select2=document.getElementById("characterSelect2")

  if(select){
    select.innerHTML=""
    characters.forEach((c,i)=>{
      const opt=document.createElement("option")
      opt.value=i
      opt.textContent=c.name
      select.appendChild(opt)
    })
  }

  if(select2){
    select2.innerHTML=""
    characters.forEach((c,i)=>{
      const opt=document.createElement("option")
      opt.value=i
      opt.textContent=c.name
      select2.appendChild(opt)
    })
  }

  if(characters.length){
    if(selectedIndex===null) selectedIndex=0
    if(select) select.value=selectedIndex
    loadCharacter(selectedIndex)
  }
}

/* =========================
CRUD CHARACTER
========================= */

function addCharacter(){
  const name=prompt("Nama karakter?")
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

  const name=val("name")
  if(!name) return alert("Nama wajib")

  const old = selectedIndex!==null ? characters[selectedIndex] : {}

  const c={
    name,
    age:val("age"),
    gender:val("gender"),
    face:val("face"),
    hair:val("hair"),
    skin:val("skin"),
    body:val("body"),
    outfit:val("outfit"),
    style:val("style"),
    emotion:val("emotion")||"neutral",
    personality:val("personality"),
    archetype:val("archetype"),
    mood:val("mood"),

    timeline:old.timeline||[],
    currentEmotion:old.currentEmotion||"neutral",
    outfits:old.outfits||[]
  }

  if(selectedIndex!==null){
    characters[selectedIndex]=c
  }else{
    characters.push(c)
  }

  save()
  refreshDropdown()
  renderCharacterList()
}

function loadCharacter(i){

  selectedIndex=Number(i)

  const c=characters[selectedIndex]
  if(!c) return

  const fields=["name","age","gender","face","hair","skin","body","outfit","style","emotion","personality","archetype","mood"]

  fields.forEach(id=>{
    const el=document.getElementById(id)
    if(el) el.value=c[id]||""
  })

  renderOutfits()
  renderTimeline()
}

function deleteCharacter(){

  if(selectedIndex===null) return
  if(!confirm("Hapus karakter?")) return

  characters.splice(selectedIndex,1)
  selectedIndex=null

  save()
  refreshDropdown()
  renderCharacterList()
}

/* =========================
OUTFIT
========================= */

function addOutfit(){

  if(selectedIndex===null) return alert("Pilih karakter")

  const input=document.getElementById("extraOutfit")
  if(!input) return

  const valOut=input.value.trim()
  if(!valOut) return

  characters[selectedIndex].outfits.push(valOut)

  input.value=""
  save()
  renderOutfits()
}

function renderOutfits(){

  const list=document.getElementById("outfitList")
  if(!list) return

  list.innerHTML=""

  if(selectedIndex===null) return

  characters[selectedIndex].outfits.forEach(o=>{
    const li=document.createElement("li")
    li.textContent=o
    list.appendChild(li)
  })
}

/* =========================
TIMELINE
========================= */

function detectEmotion(text){
  text=text.toLowerCase()
  if(text.includes("marah")) return "angry"
  if(text.includes("sedih")) return "sad"
  if(text.includes("happy")) return "happy"
  return null
}

function updateTimeline(c,scene){

  const before=c.currentEmotion

  const detected=detectEmotion(scene)
  if(detected) c.currentEmotion=detected

  c.timeline.push({
    scene,
    before,
    after:c.currentEmotion
  })

  save()
}

function renderTimeline(){

  const list=document.getElementById("timelineList")
  if(!list) return

  list.innerHTML=""

  if(selectedIndex===null) return

  characters[selectedIndex].timeline.forEach(t=>{
    const li=document.createElement("li")
    li.textContent=`${t.scene} | ${t.before} → ${t.after}`
    list.appendChild(li)
  })
}

/* =========================
PHYSICS + CAMERA
========================= */

function detectMaterial(scene){
  const text=scene.toLowerCase()
  if(text.includes("daun")) return "light"
  if(text.includes("besi")) return "heavy"
  return "medium"
}

function getPhysics(m){
  return {
    light:"floating soft movement",
    medium:"natural motion",
    heavy:"strong impact heavy weight"
  }[m]
}

function getCamera(e){
  return {
    angry:"shaky close up",
    sad:"slow zoom",
    happy:"smooth cinematic"
  }[e] || "cinematic"
}

/* =========================
INTERACTION ENGINE
========================= */

function getInteractionStyle(type){
  return {
    dialogue:"natural conversation",
    conflict:"tense confrontation",
    romantic:"soft emotional interaction",
    team:"cooperative movement"
  }[type] || ""
}

function getDominance(c1,c2){
  if(!c1||!c2) return ""
  if(c1.archetype==="leader") return `${c1.name} dominant`
  if(c2.archetype==="leader") return `${c2.name} dominant`
  return "balanced interaction"
}

/* =========================
GENERATE
========================= */

function generate(){

  const scene=val("scene")
  if(!scene) return alert("Isi scene")

  if(selectedIndex===null) return alert("Pilih karakter")

  const c=characters[selectedIndex]

  const secondIndex=Number(document.getElementById("characterSelect2")?.value)
  const c2=characters[secondIndex]

  const interactionType=val("interactionType")

  const interaction=getInteractionStyle(interactionType)
  const dominance=getDominance(c,c2)

  const material=val("materialType") || detectMaterial(scene)
  const physics=getPhysics(material)
  const camera=getCamera(c.currentEmotion)

  let secondChar=""

  if(c2 && secondIndex!==selectedIndex){
    secondChar=`
SECOND CHARACTER:
${c2.name}, ${c2.gender}, ${c2.age}
${c2.face}, ${c2.hair}, ${c2.body}
wearing ${c2.outfit}
emotion ${c2.currentEmotion}
`
  }

  const prompt=`
MAIN CHARACTER:
${c.name}, ${c.gender}, ${c.age}
${c.face}, ${c.hair}, ${c.body}
wearing ${c.outfit}
emotion ${c.currentEmotion}

${secondChar}

INTERACTION:
${interaction}
${dominance}

SCENE:
${scene}

material: ${material}
physics: ${physics}
camera: ${camera}

cinematic, ultra realistic
`

  updateTimeline(c,scene)
  renderTimeline()

  document.getElementById("output").innerText=prompt
}

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded",function(){

  const select=document.getElementById("characterSelect")

  if(select){
    select.addEventListener("change",e=>{
      loadCharacter(Number(e.target.value))
    })
  }

  refreshDropdown()
  renderCharacterList()
})
