import axios from "axios";
import connString from "./connUrl";
export function getGenres() {
  return axios.get(connString.url + "genres");
}
