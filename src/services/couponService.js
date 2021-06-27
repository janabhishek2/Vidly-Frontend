import axios from "axios";
import connString from "./connUrl";

export function getUserCoupons(userId) {
  return axios.get(connString.url + "coupons/user/" + userId);
}
export function getCouponById(couponId) {
  return axios.get(connString.url + "coupons/" + couponId);
}
export function CouponToPay(couponId, movieId) {
  return axios.put(connString.url + "coupons/" + couponId, {
    movieId: movieId,
  });
}
