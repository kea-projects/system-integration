import chalk from "chalk";
import fs from "fs";

import users from "../users.json" assert { type: "json" };

export const inviteUser = (userEmail, onSuccess, onFail) => {
  if (!isEmailUsed(userEmail)) {
    const newUser = {
      email: userEmail,
      status: "Not registered",
      username: null,
      password: null,
      id: null,
    };

    users.push(newUser);
    fs.writeFileSync("users.json", JSON.stringify(users), "utf-8");
    console.log(chalk.yellowBright("Invited user:"), newUser);

    if (onSuccess) {
      onSuccess(newUser);
    }
  } else {
    if (onFail) {
      onFail();
    }
  }
};

export const getAllUsers = () => users;

export const getUserByEmail = (userEmail) => {
  return users.filter((user) => user.email === userEmail)[0];
};

export const registerUser = (userData) => {
  const updatedUsers = users.map((user) => {
    if (user.email === userData.email) {
      user.username = userData.username;
      user.password = userData.password;
      user.id = userData.id;
      user.status = "Online";
      console.log(chalk.yellowBright("Registered user:"), user);
    }
    return user;
  });

  fs.writeFileSync("users.json", JSON.stringify(updatedUsers), "utf-8");
};

export const createUser = (userData, onSuccess, onFail) => {
  if (!isEmailUsed(userData.email)) {
    const newUser = {
      email: userData.email,
      status: "Offline",
      username: userData.username,
      password: userData.password,
      id: null,
    };

    users.push(newUser);
    fs.writeFileSync("users.json", JSON.stringify(users), "utf-8");
    console.log(chalk.yellowBright("Created user:"), newUser);

    if (onSuccess) {
      onSuccess(newUser);
    }
  } else {
    if (onFail) {
      onFail();
    }
  }
};

export const loginUser = (userData, onSuccess, onFail) => {
  let loginFailed = true;
  const updatedUsers = users.map((user) => {
    if (user.email === userData.email && user.password === userData.password) {
      user.id = userData.id;
      user.status = "Online";
      console.log(chalk.yellowBright("Logged in user:"), user);
      loginFailed = false;
    }
    return user;
  });

  if (loginFailed) {
    if (onFail) {
      onFail();
    }
  } else {
    fs.writeFileSync("users.json", JSON.stringify(updatedUsers), "utf-8");
    if (onSuccess) {
      onSuccess();
    }
  }
};

export const disconnectUser = (userId) => {
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      user.id = null;
      user.status = "Offline";
      console.log(chalk.yellowBright("Disconnected user:"), user);
    }
    return user;
  });

  fs.writeFileSync("users.json", JSON.stringify(updatedUsers), "utf-8");
};

export const isEmailUsed = (userEmail) => {
  for (const user of users) {
    if (user.email === userEmail) {
      return true;
    }
  }
  return false;
};
