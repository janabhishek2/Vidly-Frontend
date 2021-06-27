import axios from "axios";
import connString from "./connUrl";
export function getPaymentIntent(userId, movieId) {
  try {
    return axios.post(connString.url + "rentals/create-payment-intent", {
      userId,
      movieId,
    });
  } catch (err) {
    console.log(err.message);
  }
}

export function getRentals(userId) {
  return axios.get(connString.url + "rentals/user/" + userId);
}
export function getAllRentals() {
  return axios.get(connString.url + "rentals");
}
export function saveRental(
  userId,
  movieId,
  paymentMethodId,
  paymentMethodName
) {
  return axios.post(connString.url + "rentals/createRental", {
    userId,
    movieId,
    paymentMethodId,
    paymentMethodName,
  });
}

export function updateRental(rentalId, rating, comments) {
  return axios.put(connString.url + "rentals/" + rentalId, {
    rating,
    comments,
  });
}

export function payUsingCoupon(userId, movieId, couponId) {
  return axios.post(connString.url + "rentals/freeRental", {
    userId: userId,
    movieId: movieId,
    couponId: couponId,
  });
}
