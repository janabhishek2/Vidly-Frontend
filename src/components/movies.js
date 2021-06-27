import React, { Component } from "react";
//import { getMovies, deleteMovie } from "../services/fakeMovieService";
import _ from "lodash";
import Pagination from "./pagination";
import paginate from "../utils/paginate";
import ListGroup from "./listGroup";
//import { getGenres } from "../services/fakeGenreService";
import genreFilter from "../utils/genreFilter";
import MoviesTable from "./moviesTable";
import searchMovies from "../utils/searchMovies";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LatestImageSlider from "./latestImageSlider";
import TopRatedImageSlider from "./topRatedImageSlider";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currPage: 1,
    pageSize: 4,
    selectedGenre: "",
    sortOrder: { path: "title", order: "asc" },
    searchString: "",
  };
  async componentDidMount() {
    const { data: genres } = await getGenres();
    const { data: movies } = await getMovies();

    this.setState({ movies, genres });
  }
  /*   async componentDidUpdate() {
    const { data: genres } = await getGenres();
    const { data: movies } = await getMovies();

    this.setState({ movies, genres });
  } */
  handleDelete = async (movieId) => {
    console.log("Delete Handler Called");

    const originalMovies = [...this.state.movies];

    const movies = this.state.movies;
    const deletedMovie = movies.find((m) => {
      return m._id == movieId;
    });
    const index = movies.indexOf(deletedMovie);
    movies.splice(index, 1);
    this.setState({ movies });
    try {
      const result = await deleteMovie(movieId);
    } catch (err) {
      if (err.response && err.response.status == 404) {
        toast.error("The movie might already be deleted");
      } else if (
        err.response &&
        (err.response.status == 401 || err.response.status == 403)
      ) {
        toast.error("Only admins can edit movies");
      }
      console.log(err.message);
      this.setState({ movies: originalMovies });
    }
  };
  changeLikeState = (movie) => {
    let movies = this.state.movies;
    const index = movies.indexOf(movie);

    if (movie.like == true) {
      movies[index].like = false;
    } else {
      movies[index].like = true;
    }
    console.log(this.state.movies[index]);
    this.setState({ movies });
  };
  handlePageChange = (page) => {
    const currPage = page;
    this.setState({ currPage });
    return;
  };
  handleSort = (path) => {
    let order = "asc";
    if (this.state.sortOrder.order == "asc") {
      order = "desc";
    }
    this.setState({ sortOrder: { path, order } });
  };
  handleGenreChange = async (genre) => {
    this.setState({ searchString: "" });
    const { data: movies } = await getMovies();
    this.setState({ movies });

    let newGenre;
    if (genre == "") {
      newGenre = "";
    } else {
      newGenre = genre.name;
    }

    this.setState({ selectedGenre: newGenre });
    this.setState({ currPage: 1 });
  };
  handleSearch = async ({ currentTarget: input }) => {
    const searchString = input.value;
    this.setState({ searchString });
    this.setState({ currPage: 1 });
    if (searchString == "") {
      const { data: movies } = await getMovies();
      this.setState({ movies });
    }
    if (searchString != "") {
      this.setState({ selectedGenre: "" });
      const { data: movies } = await getMovies();

      const mov = searchMovies(movies, searchString);
      this.setState({ movies: mov });
    }
  };
  renderMovies = () => {
    const { sortOrder } = this.state;

    const genreSpecificMovies = genreFilter(
      this.state.movies,
      this.state.selectedGenre
    );

    const sorted = _.orderBy(
      genreSpecificMovies,
      [sortOrder.path],
      [sortOrder.order]
    );

    const paginatedMovies = paginate(
      sorted,
      this.state.currPage,
      this.state.pageSize
    );

    return (
      <React.Fragment>
        <MoviesTable
          paginatedMovies={paginatedMovies}
          onLike={this.changeLikeState}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
          sortOrder={this.state.sortOrder}
          searchString={this.state.searchString}
          onSearch={this.handleSearch}
          user={this.props.user}
          {...this.props}
        />
        <Pagination
          count={genreSpecificMovies.length}
          pageSize={this.state.pageSize}
          currPage={this.state.currPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  };

  renderListGroup = () => {
    return (
      <ListGroup
        genres={this.state.genres}
        count={this.state.genres.length}
        onGenreChange={this.handleGenreChange}
        selectedGenre={this.state.selectedGenre}
      />
    );
  };
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container mt-5" id="content">
          <div className="row">
            <div className="col-12 col-md-2 d-none d-md-block">
              {this.renderListGroup()}
            </div>
            <div className="col-12 col-md-10 mb-5">{this.renderMovies()}</div>
          </div>
        </div>
        <div className="container-fluid">
          <LatestImageSlider user={this.props.user} {...this.props} />
        </div>
        <div className="container-fluid">
          <TopRatedImageSlider user={this.props.user} {...this.props} />
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
