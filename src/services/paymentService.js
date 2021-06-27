import connString from "./connUrl";
import axios from "axios";
export function getPaymentMethods(customerId) {
  return axios.get(connString.url + "paymentMethods/" + customerId);
}
