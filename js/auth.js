function isSuper() {
  return window.location.pathname.includes("super.html");
}

function isMember() {
  return localStorage.getItem("member") === "true";
}

function setMember(status) {
  localStorage.setItem("member", status ? "true" : "false");
}

function logout() {
  localStorage.removeItem("member");
}
