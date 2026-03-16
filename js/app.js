/* ======================================
   MIMPACT LABS – AI CHARACTER ENGINE
   CLEAN STABLE VERSION
====================================== */

/* =========================
   STORAGE
========================= */

function loadFromStorage(){
  try{
    const data = localStorage.getItem("characters")
    return data ? JSON.parse(data) : []
  }catch(e){
    console.warn("Storage error reset")
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

const fields = [
"name","age","gender",
"face","hair","skin","body",
"outfit","style",
"emotion","personality","archetype","mood"
]

 fields.forEach(id=>{
  const el = document.getElementById(id)
  if(el) el.value=""
 })

 selectedIndex=null
}

/* =========================
   EMOTION DETECTOR
========================= */

function detectEmotion(scene){

 const text = scene.toLowerCase()

 if(text.includes("marah") || text.includes("angry")) return "angry"
 if(text.includes("sedih") || text.includes("cry")) return "sad"
 if(text.includes("happy") || text.includes("bahagia")) return "happy"
 if(text.includes("romantis") || text.includes("love")) return "romantic"
 if(text.includes("takut") || text.includes("dark")) return "fearful"
 if(text.includes("shock") || text.includes("terkejut")) return "shocked"

 return null
}

/* =========================
   CHARACTER LIST
========================= */

function refreshDropdown(){

 const select = document.getElementById("characterSelect")
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

 const name = prompt("Masukkan nama karakter")

 if(!name) return

 const newChar = {
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

function saveCharacter(){

 const name = document.getElementById("name").value.trim()

 if(!name){
  alert("Nama wajib diisi")
  return
 }

 const emotion = document.getElementById("emotion").value.trim() || "neutral"

 const char = {

name: nameEl.value.trim(),
age: document.getElementById("age")?.value.trim(),
gender: document.getElementById("gender")?.value.trim(),

face: document.getElementById("face")?.value.trim(),
hair: document.getElementById("hair")?.value.trim(),
skin: document.getElementById("skin")?.value.trim(),
body: document.getElementById("body")?.value.trim(),

outfit: document.getElementById("outfit")?.value.trim(),
style: document.getElementById("style")?.value.trim(),

emotion: emotionValue,
personality: document.getElementById("personality")?.value.trim(),
archetype: document.getElementById("archetype")?.value.trim(),
mood: document.getElementById("mood")?.value.trim(),
    
<!-- end
  name:name,
  age:document.getElementById("age").value,
  gender:document.getElementById("gender").value,
  face:document.getElementById("face").value,
  hair:document.getElementById("hair").value,
  outfit:document.getElementById("outfit").value,
  style:document.getElementById("style").value,
  emotion:emotion,
  personality:document.getElementById("personality").value,
  mood:document.getElementById("mood").value,
end -->
    
  voiceTone:"warm cinematic narrator",
  pitch:"medium-low stable pitch",

  timeline:[],
  currentEmotion:emotion

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

 selectedIndex = Number(index)

 const char = characters[selectedIndex]
 if(!char) return

 const fields=[
  "name","age","gender","face","hair",
  "outfit","style","emotion","personality","mood"
 ]

 fields.forEach(id=>{
  const el=document.getElementById(id)
  if(el) el.value = char[id] || ""
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

 const char = characters[selectedIndex]

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
   EXPORT
========================= */

function downloadJSON(data,filename){

 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"})

 const url=URL.createObjectURL(blob)

 const a=document.createElement("a")

 a.href=url
 a.download=filename
 a.click()

 URL.revokeObjectURL(url)

}

function exportCharacter(){

 if(selectedIndex===null){
  alert("Pilih karakter")
  return
 }

 downloadJSON(characters[selectedIndex],characters[selectedIndex].name+".json")

}

function exportAllCharacters(){

 if(!characters.length){
  alert("Belum ada karakter")
  return
 }

 downloadJSON(characters,"mimpact_backup.json")

}

/* =========================
   IMPORT
========================= */

function importCharacter(event){

 const file = event.target.files[0]

 if(!file) return

 const reader=new FileReader()

 reader.onload=function(e){

  try{

   const data=JSON.parse(e.target.result)

   if(Array.isArray(data)){

    data.forEach(c=>characters.push(c))

   }else{

    characters.push(data)

   }

   saveToStorage()
   refreshDropdown()

   alert("Import berhasil")

  }catch{

   alert("File tidak valid")

  }

 }

 reader.readAsText(file)

}

/* =========================
   TIMELINE MEMORY
========================= */

function updateTimeline(char,scene){

 if(!char.timeline) char.timeline=[]

 const before = char.currentEmotion || "neutral"

 const detected = detectEmotion(scene)

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
   VISUAL LOCK
========================= */

function buildVisualLock(){

 return "same exact face, no morphing, hyper realistic, cinematic lighting"

}

function buildVoiceLock(char){

 return `consistent voice tone ${char.voiceTone}, fixed pitch ${char.pitch}`

}

/* =========================
   MODEL PROMPT STYLE
========================= */

function applyModelStyle(prompt,model){

 if(model==="midjourney"){
  return prompt+" --ar 9:16 --style raw --v 6"
 }

 if(model==="sdxl"){
  return prompt+", ultra detailed, photorealistic"
 }

 if(model==="runway"){
  return prompt+", cinematic video shot, natural motion"
 }

 return prompt

}

/* =========================
   GENERATE PROMPT
========================= */

function generate(){

 const scene=document.getElementById("scene").value.trim()
 const output=document.getElementById("output")

 if(!scene){
  output.innerText="Masukkan adegan"
  return
 }

 if(selectedIndex===null){
  output.innerText="Pilih karakter"
  return
 }

 const char=characters[selectedIndex]

 let outfitText = char.outfit || ""

 if(char.outfits && char.outfits.length>0){
  outfitText = char.outfits[0]
 }

 const base=
 `${char.name}, ${char.gender}, ${char.age} tahun, wearing ${outfitText}, emotion ${char.currentEmotion}`

 const model=document.getElementById("model").value

 let prompt=
 `${base}, ${scene}, ${buildVisualLock()}, ${buildVoiceLock(char)}`

 prompt=applyModelStyle(prompt,model)

 updateTimeline(char,scene)

 renderTimeline()

 output.innerText=prompt

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
