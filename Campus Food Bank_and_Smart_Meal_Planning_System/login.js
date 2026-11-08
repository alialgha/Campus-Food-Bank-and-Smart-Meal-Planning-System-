function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function showRegister() {
  document.getElementById("loginBox").classList.add("d-none");
  document.getElementById("registerBox").classList.remove("d-none");
}

function showLogin() {
  document.getElementById("registerBox").classList.add("d-none");
  document.getElementById("loginBox").classList.remove("d-none");
}

function message(id, text, type) {
  document.getElementById(id).innerHTML = '<div class="alert alert-' + type + ' py-2 mb-0">' + text + '</div>';
}

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let username = document.getElementById("regUser").value.trim();
  let email = document.getElementById("regEmail").value.trim();
  let password = document.getElementById("regPass").value;
  let users = getUsers();

  if (users.find(u => u.username === username)) {
    message("regMsg", "Username already taken.", "danger");
    return;
  }

  users.push({ username: username, email: email, password: password });
  localStorage.setItem("users", JSON.stringify(users));
  this.reset();
  showLogin();
  message("loginMsg", "Account created. You can log in now.", "success");
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let username = document.getElementById("loginUser").value.trim();
  let password = document.getElementById("loginPass").value;
  let user = getUsers().find(u => u.username === username && u.password === password);

  if (!user) {
    message("loginMsg", "Wrong username or password.", "danger");
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "student.html";
});
