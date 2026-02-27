document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("devPanel").style.display = "none";
});
const DEV_ACCESS_CODE = "MIMPACT-DEV-2026";

function unlockDev() {
  const code = document.getElementById("devCode").value;

  if (code === DEV_ACCESS_CODE) {
    localStorage.setItem("devMode", "true");
    document.getElementById("devPanel").style.display = "block";
    document.getElementById("authMessage").innerText = "Developer Mode Activated";
    loadStats();
  } else {
    document.getElementById("authMessage").innerText = "Invalid Access Code";
  }
}

function resetDemoLimit() {
  localStorage.setItem("demoUsage", "0");
  alert("Demo limit reset.");
  loadStats();
}

function enableProMode() {
  localStorage.setItem("proMode", "true");
  alert("Pro Mode Enabled.");
  loadStats();
}

function disableProMode() {
  localStorage.removeItem("proMode");
  alert("Pro Mode Disabled.");
  loadStats();
}

function clearAllData() {
  localStorage.clear();
  alert("All local data cleared.");
  location.reload();
}

function loadStats() {
  const usage = localStorage.getItem("demoUsage") || 0;
  const pro = localStorage.getItem("proMode") ? "Active" : "Inactive";

  document.getElementById("usageStats").innerHTML = `
    Demo Usage: ${usage}<br>
    Pro Mode: ${pro}
  `;
}
