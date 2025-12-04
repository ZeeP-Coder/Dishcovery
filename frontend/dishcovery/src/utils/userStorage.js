import userSeed from "../data/users.json";

const USERS_KEY = "dishcovery:users";
const CURRENT_USER_KEY = "dishcovery:user";

export function loadUsers() {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch {
    // ignore and fall back to seed
  }
  return userSeed.users || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    if (user.nickname) {
      localStorage.setItem("dishcovery:nickname", user.nickname);
    }
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem("dishcovery:nickname");
  }
}


