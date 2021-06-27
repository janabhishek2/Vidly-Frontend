import axios from "axios";
import connString from "./connUrl";

export function register(user) {
  return axios.post(connString.url + "users", {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}

export function getUserById(id) {
  return axios.get(connString.url + "users/" + id);
}

export function updateUser(id, user) {
  return axios.put(connString.url + "users/" + id, user);
}
