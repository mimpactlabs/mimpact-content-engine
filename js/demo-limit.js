const MAX_LIMIT = 3;

function getUsage() {
  return parseInt(localStorage.getItem("demoUsage") || "0");
}

function incrementUsage() {
  let usage = getUsage() + 1;
  localStorage.setItem("demoUsage", usage);
  updateLimitMessage();
}

function checkLimit() {
  let usage = getUsage();
  if (usage >= MAX_LIMIT) {
    document.getElementById("limitMessage").innerHTML =
      "Limit demo habis. <br><a href='#'>Daftar Member untuk akses penuh</a>";
    return false;
  }
  return true;
}

function updateLimitMessage() {
  let usage = getUsage();
  document.getElementById("limitMessage").innerText =
    `Sisa demo: ${MAX_LIMIT - usage}`;
}

updateLimitMessage();
