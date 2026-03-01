function generate() {
  const input = document.getElementById("inputText").value;
  const output = document.getElementById("outputBox");

  if (!input.trim()) {
    output.innerText = "Masukkan topik terlebih dahulu.";
    return;
  }

  output.innerText = "Generated Prompt: " + input + " - versi super unlimited.";
}
