const DEMO_LIMIT = 3;
const MEMBER_LIMIT = 200;

function isMember() {
  return localStorage.getItem("member") === "true";
}

function getUsage() {
  if (isMember()) {
    return parseInt(localStorage.getItem("memberUsage") || "0");
  }
  return parseInt(localStorage.getItem("demoUsage") || "0");
}

function incrementUsage() {
  if (isMember()) {
    let usage = getUsage() + 1;
    localStorage.setItem("memberUsage", usage);
  } else {
    let usage = getUsage() + 1;
    localStorage.setItem("demoUsage", usage);
  }
  updateLimitMessage();
}

function checkLimit() {
  let usage = getUsage();

  if (isMember()) {
    if (usage >= MEMBER_LIMIT) {
      lockTool("Batas 200 penggunaan telah habis.<br><a href='upgrade.html'>Perpanjang Member</a>");
      return false;
    }
  } else {
    if (usage >= DEMO_LIMIT) {
      lockTool("Limit demo habis.<br><a href='upgrade.html'>Upgrade ke Member</a>");
      return false;
    }
  }

  return true;
}

function lockTool(message) {
  const btn = document.getElementById("generateBtn");
  if (btn) btn.disabled = true;

  document.getElementById("limitMessage").innerHTML = message;
}

function updateLimitMessage() {
  let usage = getUsage();

  if (isMember()) {
    let remaining = MEMBER_LIMIT - usage;

    if (remaining <= 0) {
      lockTool("Batas 200 penggunaan telah habis.<br><a href='upgrade.html'>Perpanjang Member</a>");
    } else {
      document.getElementById("limitMessage").innerText =
        `Sisa penggunaan member: ${remaining} dari ${MEMBER_LIMIT}`;
    }

  } else {
    let remaining = DEMO_LIMIT - usage;

    if (remaining <= 0) {
      lockTool("Limit demo habis.<br><a href='upgrade.html'>Upgrade ke Member</a>");
    } else {
      document.getElementById("limitMessage").innerText =
        `Sisa demo: ${remaining} dari ${DEMO_LIMIT}`;
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  updateLimitMessage();
});
