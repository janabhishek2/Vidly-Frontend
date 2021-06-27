import axios from "axios";
import connString from "./connUrl";
export function login(user) {
  return axios.post(connString.url + "auth", {
    email: user.username,
    password: user.password,
  });
}
