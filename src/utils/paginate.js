export default function paginate(movies, currPage, pageSize) {
  let i = (currPage - 1) * pageSize;
  let newMovies = [];
  for (i; i < (currPage - 1) * pageSize + pageSize && i < movies.length; i++) {
    newMovies.push(movies[i]);
  }
  return newMovies;
}
