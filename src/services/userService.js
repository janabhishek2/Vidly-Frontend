import axios from "axios";

export function register(user) {
  return axios.post("http://localhost:5000/api/users", {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}

export function getUserById(id) {
  return axios.get("http://localhost:5000/api/users/" + id);
}

export function updateUser(id, user) {
  return axios.put("http://localhost:5000/api/users/" + id, user);
}
