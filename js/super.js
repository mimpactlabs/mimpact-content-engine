const SUPER_ACCESS_CODE = "MIMPACT-SUPER-2026";

function unlockSuper() {
  const code = document.getElementById("superCode").value;

  if (code === SUPER_ACCESS_CODE) {
    document.getElementById("superPanel").style.display = "block";
    document.getElementById("authBox").style.display = "none";
  } else {
    document.getElementById("authMessage").innerText = "Invalid Access Code";
  }
}

function generateSuperPrompt() {
  const input = document.getElementById("inputText").value;

  if (!input) {
    alert("Masukkan topik terlebih dahulu.");
    return;
  }

  // Gunakan logic dari app.js kalau mau
  const result = `
    🔥 Generated Prompt:

    Buatkan konten affiliate yang menarik tentang "${input}"
    dengan gaya persuasif dan fokus pada conversion.
  `;

  document.getElementById("outputBox").innerText = result;
}
