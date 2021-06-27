import axios from "axios";
import { getGenres } from "./genreService";
import connString from "./connUrl";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

export function getMovies() {
  return axios.get(connString.url + "movies");
}
export function getLatestMovies() {
  return axios.get(connString.url + "movies/orderBy/latest");
}
export function getTopRatedMovies() {
  return axios.get(connString.url + "movies/orderBy/topRated");
}
export function getMovie(movieId) {
  return axios.get(connString.url + "movies" + "/" + movieId);
}

export function deleteMovie(movieId) {
  return axios.delete(connString.url + "movies" + "/" + movieId);
}
export function saveMovie(movie) {
  console.log(movie);
  if (movie._id != "") {
    const fd = new FormData();
    if (typeof movie.tile === typeof "") {
      fd.append("tile", movie.tile);
    } else {
      fd.append("tile", movie.tile, movie.tile.name);
    }

    fd.append("ratings", movie.ratings);
    fd.append("title", movie.title);
    fd.append("genreId", movie.genreId);
    fd.append("numberInStock", movie.numberInStock);
    fd.append("dailyRentalRate", movie.dailyRentalRate);

    return axios.put(connString.url + "movies" + "/" + movie._id, fd);
  } else {
    const fd = new FormData();

    if (typeof movie.tile === typeof "") {
      fd.append("tile", movie.tile);
    } else {
      fd.append("tile", movie.tile, movie.tile.name);
    }
    fd.append("ratings", movie.ratings);
    fd.append("title", movie.title);
    fd.append("genreId", movie.genreId);
    fd.append("numberInStock", movie.numberInStock);
    fd.append("dailyRentalRate", movie.dailyRentalRate);

    return axios.post(connString.url + "movies", fd);
  }
}
export function deleteRating(movieId, rating) {
  return axios.put(connString.url + "movies" + "/deleteRating/" + movieId, {
    rating: rating,
  });
}
