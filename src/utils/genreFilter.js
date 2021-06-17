export default function genreFilter(movies, selectedGenre) {
  let newMovies = [];
  if (selectedGenre == "") {
    return movies;
  } else {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].genre.name == selectedGenre) {
        newMovies.push(movies[i]);
      }
    }
    return newMovies;
  }
}
