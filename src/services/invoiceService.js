import axios from "axios";

export function saveInvoice(token, product) {
  return axios.post("http://localhost:5000/api/checkout", { token, product });
}
