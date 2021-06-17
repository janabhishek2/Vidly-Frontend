import axios from "axios";

export function saveRental(token, userId, movieId, user) {
  try {
    return axios.post("http://localhost:5000/api/rentals", {
      token,
      userId,
      movieId,
      user,
    });
  } catch (err) {
    console.log(err.message);
  }
}

export function getRentals(userId) {
  return axios.get("http://localhost:5000/api/rentals/user/" + userId);
}
