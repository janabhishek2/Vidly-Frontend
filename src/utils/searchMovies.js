export default function searchMovies(movies, searchString) {
  console.log(searchString);

  const length = searchString.length;
  const newMovies = movies.filter((item) => {
    const title = item.title;
    const reducedTitle = title.substring(0, length).toLowerCase();

    const reducedSearchString = searchString.toLowerCase();

    return reducedTitle == reducedSearchString;
  });
  console.log(newMovies);
  return newMovies;
}
