const MAX_LIMIT = 3;

function isPro() {
  return localStorage.getItem("proMode") === "true";
}

function getUsage() {
  return parseInt(localStorage.getItem("demoUsage") || "0");
}

function incrementUsage() {
  let usage = getUsage() + 1;
  localStorage.setItem("demoUsage", usage);
  updateLimitMessage();
}

function checkLimit() {
  if (isPro()) return true;

  let usage = getUsage();

  if (usage >= MAX_LIMIT) {
    lockTool();
    return false;
  }

  return true;
}

function lockTool() {
  const btn = document.getElementById("generateBtn");
  if (btn) btn.disabled = true;

  document.getElementById("limitMessage").innerHTML =
    "Limit demo habis.<br><a href='upgrade.html'>Upgrade untuk akses penuh</a>";
}

function updateLimitMessage() {
  if (isPro()) {
    document.getElementById("limitMessage").innerText =
      "Pro Mode Active - Unlimited Access";
    return;
  }

  let usage = getUsage();
  let remaining = MAX_LIMIT - usage;

  if (remaining <= 0) {
    lockTool();
  } else {
    document.getElementById("limitMessage").innerText =
      `Sisa demo: ${remaining}`;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  updateLimitMessage();
});
