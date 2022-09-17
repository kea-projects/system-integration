// Page Elements
// Content Elements
const contentWrapper = document.getElementById("content-wrapper");

const invitationInput = document.getElementById("invitation-email");
const invitationButton = document.getElementById("invitation-button");
const friendpaneWrapper = document.getElementById("friendpane-wrapper");

// Login Elements
const loginWrapper = document.getElementById("login-wrapper");

const emailForm = document.getElementById("email-input");
const emailInput = document.getElementById("login-email");

const passwordForm = document.getElementById("password-input");
const passwordInput = document.getElementById("login-password");

const registerForm = document.getElementById("register-input");
const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");

const continueButton = document.getElementById("continue-button");

// Socket IO Setup
const socket = io();
console.log("Socket connected: ", socket);

// Socket IO Events
socket.on("all-users", (data) => {
  console.log(data);
  friendpaneWrapper.innerHTML = null;
  data.users.forEach((user) => {
    const entry = createFriendpaneEntryElement(user);
    friendpaneWrapper.appendChild(entry);
  });
});
socket.on("refresh", (_) => {
  if (contentWrapper.style.display !== "none") {
    socket.emit("get-users");
  }
});

const inviteUser = (userEmail) => {
  socket.emit("invite-user", { userEmail });
};
socket.on("invite-user-success", (data) => {
  const entry = createFriendpaneEntryElement(data);
  friendpaneWrapper.appendChild(entry);
});

const startLogin = (userEmail) => {
  socket.emit("login-start", { userEmail });
};
socket.on("login-continue-register", (data) => {
  emailForm.style.display = "none";
  registerForm.style.display = "flex";
  continueButton.removeEventListener("click", loginEmailContinue);
  continueButton.addEventListener("click", () =>
    loginRegisterContinue(data.userEmail)
  );
});
const registerUser = (userData) => {
  socket.emit("login-register", { ...userData });
};
socket.on("login-continue-password", (data) => {
  emailForm.style.display = "none";
  passwordForm.style.display = "flex";
  continueButton.removeEventListener("click", loginEmailContinue);
  continueButton.addEventListener("click", () =>
    loginPasswordContinue(data.userEmail)
  );
});
const loginUser = (userData) => {
  socket.emit("login-password", { ...userData });
};
socket.on("login-done", (_) => {
  loginWrapper.style.display = "none";
  contentWrapper.style.display = "flex";
  socket.emit("get-users");
});
socket.on("login-fail", (_) => {
  window.reload();
});

// Event Listeners
invitationButton.addEventListener("click", (event) => {
  const userEmail = invitationInput.value;
  if (userEmail) {
    inviteUser(userEmail);
  }
});

const loginEmailContinue = (event) => {
  const loginEmail = emailInput.value;
  if (loginEmail) {
    startLogin(loginEmail);
  }
};
const loginRegisterContinue = (registerEmail) => {
  const registerUsername = registerUsernameInput.value;
  const registerPassword = registerPasswordInput.value;
  if (registerUsername && registerPassword) {
    registerUser({
      username: registerUsername,
      password: registerPassword,
      email: registerEmail,
    });
  }
};
const loginPasswordContinue = (loginEmail) => {
  const loginPassword = passwordInput.value;
  if (loginPassword) {
    loginUser({
      email: loginEmail,
      password: loginPassword,
    });
  }
};
continueButton.addEventListener("click", loginEmailContinue);

// Element Creation
const createFriendpaneEntryElement = (data) => {
  const friendpaneEntry = document.createElement("div");
  const userWrapper = document.createElement("div");
  const userStatusIcon = document.createElement("div");
  const userName = document.createElement("p");
  const userStatusText = document.createElement("span");

  // Creating friendpane entry contents
  userStatusIcon.className = `user-status-icon p-2 border border-light rounded-circle ${data.status
    .toLowerCase()
    .replace(" ", "-")}`;

  userName.className = "user-name lead";
  userName.innerText = data.username || data.email;

  userWrapper.className = "user-wrapper container";
  userWrapper.appendChild(userStatusIcon);
  userWrapper.appendChild(userName);

  userStatusText.className = `user-status-text badge ${data.status
    .toLowerCase()
    .replace(" ", "-")}`;
  userStatusText.innerText = data.status;

  // Creating the friendpane entry
  friendpaneEntry.className = "friendpane-entry container shadow-sm rounded";
  friendpaneEntry.appendChild(userWrapper);
  friendpaneEntry.appendChild(userStatusText);

  return friendpaneEntry;
};
