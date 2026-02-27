function assemblePrompt(name, dna, scene) {
  return `
Character: ${name}

${dna}

Scene:
${scene}

same face, identical identity, consistent character across scenes
--ar 9:16
`;
}

function generatePrompt() {

  if (!checkLimit()) return;
   // logic generate prompt di sini

  incrementUsage();
}
<button id="generateBtn" onclick="generatePrompt()">Generate</button>

  const name = document.getElementById("charName").value;
  const dna = document.getElementById("charDNA").value;
  const scene = document.getElementById("sceneDesc").value;

  const prompt = assemblePrompt(name, dna, scene);

  document.getElementById("output").innerText = prompt;

  incrementUsage();
}
