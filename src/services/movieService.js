import axios from "axios";
import { getGenres } from "./genreService";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

export function getMovies() {
  return axios.get("http://localhost:5000/api/movies");
}

export function getMovie(movieId) {
  return axios.get("http://localhost:5000/api/movies" + "/" + movieId);
}

export function deleteMovie(movieId) {
  return axios.delete("http://localhost:5000/api/movies" + "/" + movieId);
}
export function saveMovie(movie) {
  if (movie._id != "") {
    const body = { ...movie };
    delete body._id;
    return axios.put(
      "http://localhost:5000/api/movies" + "/" + movie._id,
      body
    );
  } else {
    const body = { ...movie };
    delete body._id;
    return axios.post("http://localhost:5000/api/movies", body);
  }
}
