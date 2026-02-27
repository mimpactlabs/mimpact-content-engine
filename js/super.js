const SUPER_PASSWORD = "mimpact2026";

document.addEventListener("DOMContentLoaded", function () {

  const unlockBtn = document.getElementById("unlockBtn");
  const generateBtn = document.getElementById("generateBtn");

  unlockBtn.addEventListener("click", unlockSuper);

  if (generateBtn) {
    generateBtn.addEventListener("click", function () {
      generatePrompt();
    });
  }

});

function unlockSuper() {
  const input = document.getElementById("superCode").value;
  const message = document.getElementById("authMessage");

  if (input === SUPER_PASSWORD) {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("superPanel").style.display = "block";
  } else {
    message.innerText = "Wrong access code!";
  }
}
