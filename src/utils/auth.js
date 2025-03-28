export function getToken() {
  const token = localStorage.getItem("task-list-auth-token");
  if (!token) {
    return null;
  }
  return token;
}

export function setToken(token) {
  localStorage.setItem("task-list-auth-token", token);
}

export function removeToken() {
  localStorage.removeItem("task-list-auth-token");
}
