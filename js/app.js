/* ======================================
   MIMPACT LABS – AI CHARACTER ENGINE
   CLEAN PRODUCTION VERSION
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
   CLEAR FORM
========================= */

function clearForm(){

const fields=[
"name","age","gender",
"face","hair","skin","body",
"outfit","style",
"emotion","personality","archetype","mood"
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

if(text.includes("marah")||text.includes("angry")) return "angry"
if(text.includes("sedih")||text.includes("cry")) return "sad"
if(text.includes("happy")||text.includes("bahagia")) return "happy"
if(text.includes("romantis")||text.includes("love")) return "romantic"
if(text.includes("takut")||text.includes("dark")) return "fearful"
if(text.includes("shock")||text.includes("terkejut")) return "shocked"

return null
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
 option.textContent=`${char.name || "No Name"} (${char.age || "-"} - ${char.gender || "-"})`

 select.appendChild(option)

})

if(characters.length>0){
 select.value=characters.length-1
 loadCharacter(select.value)
}
}

/* =========================
   ADD CHARACTER
========================= */

function addCharacter(){

const name=prompt("Masukkan nama karakter")
if(!name) return

const newChar={
 name:name,
 timeline:[],
 currentEmotion:"neutral"
}

characters.push(newChar)

saveToStorage()
refreshDropdown()
}

/* =========================
   SAVE CHARACTER
========================= */

function val(id){
 return document.getElementById(id)?.value?.trim() || ""
}

function saveCharacter(){

const name = val("name")

if(!name){
 alert("Nama karakter wajib diisi")
 return
}

const emotionValue = val("emotion") || "neutral"

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

voiceTone:"warm cinematic narrator",
pitch:"medium-low stable pitch",

timeline:[],
currentEmotion:emotionValue,
outfits:[]
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
   LOAD CHARACTER
========================= */

function loadCharacter(index){

selectedIndex=Number(index)

const char=characters[selectedIndex]
if(!char) return

const fields=[
"name","age","gender",
"face","hair","skin","body",
"outfit","style",
"emotion","personality","archetype","mood"
]

fields.forEach(id=>{
 const el=document.getElementById(id)
 if(el) el.value=char[id]||""
})

renderOutfits()
renderTimeline()
}

/* =========================
   DELETE CHARACTER
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
   OUTFIT SYSTEM
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
   SMART OUTFIT PICKER
========================= */

function pickOutfit(char){

if(!char.outfits || char.outfits.length===0)
 return char.outfit || ""

const index=Math.floor(Math.random()*char.outfits.length)
return char.outfits[index]
}

/* =========================
   TIMELINE MEMORY
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

/* =========================
   TIMELINE VIEW
========================= */

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
   SCENE MEMORY
========================= */

function buildSceneMemory(char){

if(!char.timeline || char.timeline.length===0) return ""

const last=char.timeline[char.timeline.length-1]

return `previous emotional state ${last.emotionAfter}`
}

/* =========================
   VISUAL LOCK
========================= */

function buildVisualLock(){

return `
same exact face identity,
no face morphing,
consistent facial structure,
consistent body proportion,
cinematic lighting,
ultra realistic photography
`
}

function buildVoiceLock(char){
 return `consistent voice tone ${char.voiceTone}, fixed pitch ${char.pitch}`
}

/* =========================
   MODEL STYLE
========================= */

function applyModelStyle(prompt,model){

if(model==="midjourney")
 return prompt+" --ar 9:16 --style raw --v 6"

if(model==="sdxl")
 return prompt+", ultra detailed, photorealistic"

if(model==="runway")
 return prompt+", cinematic video shot, natural motion"

return prompt
}

/* =========================
   CHARACTER DNA
========================= */

function buildCharacterDNA(char){

if(!char) return ""

return `
identity locked character ${char.name},
face structure ${char.face || ""},
hair ${char.hair || ""},
skin tone ${char.skin || ""},
body type ${char.body || ""},
visual style ${char.style || ""},
personality archetype ${char.archetype || ""},
consistent appearance across scenes
`
}

/* =========================
   CHARACTER RELATIONSHIP
========================= */

function buildRelationshipContext(char){

const relations={
Riko:"ambitious affiliate protagonist",
Arga:"competitive rival energy",
Gins:"silent strategist observer",
Fatima:"wise emotional stabilizer"
}

return relations[char.name] || ""
}

/* =========================
   GENERATE PROMPT
========================= */

function generate(){

const sceneEl=document.getElementById("scene")
const output=document.getElementById("output")

if(!sceneEl||!output) return

const scene=sceneEl.value.trim()

if(!scene){
 output.innerText="Masukkan adegan terlebih dahulu"
 return
}

if(selectedIndex===null){
 output.innerText="Pilih karakter terlebih dahulu"
 return
}

const char=characters[selectedIndex]

if(!char.currentEmotion)
 char.currentEmotion=char.emotion||"neutral"

const dna=buildCharacterDNA(char)

const dnaOutput=document.getElementById("dnaOutput")
if(dnaOutput) dnaOutput.innerText=dna

const relation=buildRelationshipContext(char)
const memory=buildSceneMemory(char)

const outfitText=pickOutfit(char)

const baseCharacter=

`${char.name}, ${char.gender}, ${char.age} tahun,
${char.body||""} body,
${char.skin||""} skin,
${char.face||""},
${char.hair||""},
archetype ${char.archetype||""},
wearing ${outfitText},
emotion ${char.currentEmotion}`

const model=document.getElementById("model")?.value

let finalPrompt=

`${dna},
${relation},
${memory},
${baseCharacter},
${scene},
${buildVisualLock()},
${buildVoiceLock(char)}`

finalPrompt=applyModelStyle(finalPrompt,model)

updateTimeline(char,scene)
renderTimeline()

output.innerText=finalPrompt
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
