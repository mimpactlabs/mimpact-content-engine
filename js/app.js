// ====== ENGINE STATE ======
let appState = {
  activeCharacter: {
    name: "Aira",
    emotion: "confident",
    model: "SDXL"
  }
};
let appState = {
  activeCharacter: {
    name: "Aira",
    emotion: "confident",
    model: "SDXL"
  }
};
function generate() {
  const input = document.getElementById("inputText").value;
  const output = document.getElementById("outputBox");

  if (!input.trim()) {
    output.innerText = "Masukkan topik terlebih dahulu.";
    return;
  }

  const character = appState.activeCharacter;

  const finalPrompt =
    "Character: " + character.name +
    " | Emotion: " + character.emotion +
    " | Model: " + character.model +
    " | Topic: " + input;

  output.innerText = finalPrompt;
}
