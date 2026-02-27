document.addEventListener("DOMContentLoaded", function () {
  updateLimitMessage();

  const btn = document.getElementById("generateBtn");

  if (btn) {
    btn.addEventListener("click", function () {
      if (!checkLimit()) return;

      incrementUsage();
      updateLimitMessage();

      runTool();
    });
  }
});

function runTool() {
  alert("Tool berjalan...");
}
