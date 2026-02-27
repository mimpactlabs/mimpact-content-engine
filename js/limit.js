const DEMO_LIMIT = 3;
const MEMBER_LIMIT = 200;

function getUsage() {
  if (isMember()) {
    return parseInt(localStorage.getItem("memberUsage") || "0");
  }
  return parseInt(localStorage.getItem("demoUsage") || "0");
}

function incrementUsage() {
  if (isSuper()) return;

  if (isMember()) {
    let usage = getUsage() + 1;
    localStorage.setItem("memberUsage", usage);
  } else {
    let usage = getUsage() + 1;
    localStorage.setItem("demoUsage", usage);
  }
}

function checkLimit() {
  if (isSuper()) return true;

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

  const msg = document.getElementById("limitMessage");
  if (msg) msg.innerHTML = message;
}

function updateLimitMessage() {
  const msg = document.getElementById("limitMessage");
  if (!msg) return;

  if (isSuper()) {
    msg.innerText = "Super User Mode - Unlimited Access";
    return;
  }

  let usage = getUsage();

  if (isMember()) {
    let remaining = MEMBER_LIMIT - usage;
    msg.innerText =
      remaining > 0
        ? `Sisa penggunaan member: ${remaining} dari ${MEMBER_LIMIT}`
        : "Batas member habis.";
  } else {
    let remaining = DEMO_LIMIT - usage;
    msg.innerText =
      remaining > 0
        ? `Sisa demo: ${remaining} dari ${DEMO_LIMIT}`
        : "Limit demo habis.";
  }
}
