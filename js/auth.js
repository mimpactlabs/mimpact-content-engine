function isMember() {
  return localStorage.getItem("member") === "true";
}

function loginMember() {
  localStorage.setItem("member", "true");
  window.location.href = "demo.html";
}

function logoutMember() {
  localStorage.removeItem("member");
  localStorage.removeItem("proMode");
  window.location.href = "index.html";
}
