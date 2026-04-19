// ================= CONFIG =================
const USER = {
  email: "smkantiksby@gmail.com",
  password: "R8-5G"
};

// ================= STATE =================
let attempts = 0;
let locked = false;
let lockEndTime = 0;
let timer = null;

// ================= ELEMENT =================
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");
const successBox = document.getElementById("success");

// ================= FUNCTIONS =================
function showError(msg){
  errorBox.innerText = msg;
  errorBox.style.display = "block";
  successBox.style.display = "none";
}

function showSuccess(msg){
  successBox.innerText = msg;
  successBox.style.display = "block";
  errorBox.style.display = "none";
}

function clearMessage(){
  errorBox.style.display = "none";
  successBox.style.display = "none";
}

function validateInput(email, pass){
  if(!email || !pass){
    showError("Semua field wajib diisi!");
    return false;
  }
  return true;
}

// ================= LOGIN =================
function handleLogin(){
  if(locked) return;

  const email = emailInput.value;
  const pass = passInput.value;

  clearMessage();

  if(!validateInput(email, pass)) return;

  loginBtn.disabled = true;
  loginBtn.innerText = "Loading...";

  setTimeout(()=>{
    if(email === USER.email && pass === USER.password){
      showSuccess("Login berhasil!");
      document.getElementById("demoInfo").style.display = "none";
      attempts = 0;
      window.location.href = "dashboard.html";
      localStorage.setItem("login", "true");
localStorage.setItem("userEmail", email);
    } else {
      attempts++;

showError(`The Email or Password Is Wrong ${3 - attempts} Try`);

// tampilkan akun demo saat gagal pertama
if(attempts === 1){
  document.getElementById("demoInfo").style.display = "block";
}
      loginBtn.disabled = false;
      loginBtn.innerText = "Login";

      if(attempts >= 3){
        lockSystem();
      }
    }
  },800);
}

// ================= LOCK SYSTEM =================
function lockSystem(){
  locked = true;
  lockEndTime = Date.now() + 30000;

  document.getElementById("lockModal").style.display = "flex";
  loginBtn.disabled = true;

  timer = setInterval(updateCountdown, 1000);
}

function updateCountdown(){
  const now = Date.now();
  const remaining = Math.ceil((lockEndTime - now)/1000);

  if(remaining > 0){
    document.getElementById("time").innerText = remaining;
  } else {
    clearInterval(timer);
    unlockSystem();
  }
}

function unlockSystem(){
  locked = false;
  attempts = 0;

  document.getElementById("lockModal").style.display = "none";
  loginBtn.disabled = false;
  loginBtn.innerText = "Login";
}

// ================= MODAL =================
function openModal(id){
  if(locked) return;
  document.getElementById(id).style.display = "flex";
}

function closeModal(id){
  document.getElementById(id).style.display = "none";
}

// ================= RESET =================
function handleReset(){
  emailInput.value = "";
  passInput.value = "";
  clearMessage();
}

function handleForgot(){
  const email = document.getElementById("resetEmail").value;

  if(!email){
    alert("Masukkan email!");
    return;
  }

  alert("Link reset dikirim ke " + email);
  closeModal("forgotModal");
}

function togglePassword(){
  const input = document.getElementById("password");
  const icon = document.querySelector(".toggle-pass");

  if(input.type === "password"){
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
}

// ================= EVENTS =================
loginBtn.addEventListener("click", handleLogin);
document.getElementById("resetLink").addEventListener("click", handleReset);
document.getElementById("forgotLink").addEventListener("click", ()=>openModal("forgotModal"));
document.getElementById("sendReset").addEventListener("click", handleForgot);

window.addEventListener("keydown", e=>{
  if(e.key === "Enter") handleLogin();
});