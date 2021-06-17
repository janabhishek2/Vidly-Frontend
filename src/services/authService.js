import axios from "axios";

export function login(user) {
  return axios.post("http://localhost:5000/api/auth", {
    email: user.username,
    password: user.password,
  });
}
