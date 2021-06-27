import React, { Component } from "react";
//import { getMovies, getMovie, saveMovie } from "../services/fakeMovieService";

import {
  getMovies,
  getMovie,
  saveMovie,
  deleteRating,
} from "../services/movieService";
import { getGenres } from "../services/genreService";
import Joi from "joi-browser";
import Input from "./common/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import connString from "../services/connUrl";

class MovieForm extends Component {
  state = {
    movie: {
      _id: "",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
      tile: "",
      ratings: [],
      overallRating: 0,
    },
    genres: [],
    errors: {},
  };
  schema = {
    _id: Joi.string().allow(""),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .required()
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate"),
    tile: Joi.allow(""),
    overallRating: Joi.number(),
    ratings: Joi.allow(null),
  };

  componentDidMount = async () => {
    const { data: genres } = await getGenres();
    this.setState({ genres });

    let movieId = this.props.match.params.id;

    if (movieId == "new") {
      return;
    } else {
      try {
        let { data: movie } = await getMovie(movieId);
        const mov = this.mapToViewModel(movie);
        this.setState({ movie: mov });
      } catch (err) {
        if (err.response && err.response.status == 404) {
          this.props.history.replace("/not-found");
        }
      }
    }
  };
  handleDeleteRating = async (rating) => {
    const movieCopy = { ...this.state.movie };
    try {
      console.log("Delete handler called");
      const movie = { ...this.state.movie };
      const index = movie.ratings.indexOf(rating);
      movie.ratings.splice(index, 1);
      this.setState({ movie });

      const res = await deleteRating(movie._id, rating);

      if (res.status == 200) {
        toast.success("Review Deleted !");
      }
    } catch (err) {
      console.log(err.message);
      this.setState({ movie: movieCopy });
    }
  };
  validateInput = (input) => {
    const obj = {};
    const schema = {};
    obj[input.name] = input.value;
    schema[input.name] = this.schema[input.name];

    const result = Joi.validate(obj, schema);
    if (!result.error) return null;
    else return result.error.details[0].message;
  };
  handleChange = ({ currentTarget: input }) => {
    //validateInput
    const { errors } = this.state;
    const error = this.validateInput(input);
    if (error) {
      errors[input.name] = error;
    } else delete errors[input.name];

    this.setState({ errors });

    let movie = this.state.movie;
    movie[input.name] = input.value;
    this.setState({ movie });
  };
  mapToViewModel = (movie) => {
    const newMovie = {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      dailyRentalRate: movie.dailyRentalRate,
      numberInStock: movie.numberInStock,
      tile: movie.tile,
      ratings: [...movie.ratings],
      overallRating: movie.overallRating,
    };
    return newMovie;
  };

  validate = () => {
    const options = {
      abortEarly: false,
    };
    const result = Joi.validate(this.state.movie, this.schema, options);

    const errors = {};
    if (!result.error) {
      return errors;
    } else {
      result.error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });
      return errors;
    }
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors });

    if (Object.keys(errors).length != 0) return;

    try {
      await saveMovie(this.state.movie);
      this.props.history.push("/movies");
    } catch (err) {
      console.log(err.message);
      if (err.response && err.response.status == 404) {
        toast.error("The movie might already be saved");
      } else if (
        err.response &&
        (err.response.status == 401 || err.response.status == 403)
      ) {
        toast.error("Only Admins can edit movies !");
      } else {
        toast.error(
          "The movie can not be updated at this time please try later"
        );
      }
    }
  };
  handleSave = () => {
    this.handleSubmit();
  };
  handleTileChange = ({ target: fname }) => {
    const movie = { ...this.state.movie };
    movie.tile = fname.files[0];

    this.setState({ movie });
  };
  render() {
    return (
      <div>
        <ToastContainer />
        <h1>Movie form</h1>
        <br />
        <div className="row">
          <div className="col-7">
            <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="tile">Tile </label>
                <input
                  type="file"
                  name="tile"
                  className="form-control"
                  onChange={this.handleTileChange}
                />
              </div>
              <Input
                name="title"
                label="Title"
                type="text"
                error={this.state.errors.title}
                onChange={this.handleChange}
                value={this.state.movie.title}
              />
              <label htmlFor="selectGenre">Genre</label>
              <select
                onChange={this.handleChange}
                errors={this.state.errors.genreId}
                id="selectGenre"
                className=" mb-3 form-control form-select"
                name="genreId"
                value={this.state.movie.genreId}
              >
                <option value="">Select Genre</option>

                {this.state.genres.map((genre) => {
                  return (
                    <option value={genre._id} key={genre._id}>
                      {genre.name}
                    </option>
                  );
                })}
              </select>
              {this.state.errors.genreId && (
                <div className="alert alert-danger">
                  {this.state.errors.genreId}
                </div>
              )}
              <Input
                name="numberInStock"
                label="Number In Stock"
                type="number"
                error={this.state.errors.numberInStock}
                onChange={this.handleChange}
                value={this.state.movie.numberInStock}
              />
              <Input
                name="dailyRentalRate"
                label="Daily Rental Rate"
                type="number"
                error={this.state.errors.dailyRentalRate}
                onChange={this.handleChange}
                value={this.state.movie.dailyRentalRate}
              />
              <button className="btn btn-primary mt-3">Save</button>
            </form>
          </div>
          <div className="col offset-1 mt-3">
            {this.state.movie.tile == "" ? (
              <img
                className="img-thumbnail "
                src={
                  "https://t3.ftcdn.net/jpg/01/84/81/64/360_F_184816468_sXO2m7Xhy2xqENls5YxrKlmFg3Ii82Mr.jpg"
                }
                style={{
                  margin: "0px",
                  width: "100%",
                  height: "80%",
                }}
                alt="Contact Admin"
              />
            ) : (
              <img
                className="img-thumbnail "
                src={connString.imageUrl + this.state.movie.tile}
                style={{
                  margin: "0px",
                  width: "100%",
                  height: "80%",
                }}
                alt="   Uploaded ... "
              />
            )}
          </div>
          <hr />
        </div>

        {this.props.match.params.id != "new" && (
          <React.Fragment>
            <div className="row">
              <div id="ratingHeading">
                Ratings ({this.state.movie.overallRating}{" "}
                <i className="fa fa-star"></i>)
              </div>
            </div>
            <br />
            {this.state.movie.ratings.length == 0 && (
              <div id="noRatings" className="row">
                No Ratings found <i className="fa fa-frown-o ml-2 mt-2"></i>
              </div>
            )}
            {this.state.movie.ratings.length > 0 &&
              this.state.movie.ratings.map((rating) => {
                return (
                  <div key={rating._id} id="reviewMovieForm" className="row">
                    <div className="col-2 mt-1">
                      {rating.userAvtar ? (
                        <img
                          src={connString.imageUrl + rating.userAvtar}
                          width="40%"
                          height="40%"
                          className="img-thumbnail"
                        />
                      ) : (
                        <img
                          src={
                            connString.imageUrl + "images\\users\\sample.png"
                          }
                          width="40%"
                          height="40%"
                          className="img-thumbnail"
                        />
                      )}
                    </div>
                    <div className="col-8" id="text">
                      <div className="row">
                        <div className="col-3 d-flex">
                          <b className="mr-auto">{rating.userName}</b>
                        </div>
                        <div className="col-6 d-flex">
                          <div className="ml-auto mt-2">
                            {rating.value} <i className="fa fa-star"></i>
                          </div>
                        </div>
                        <div className="col">
                          <a
                            id="del"
                            onClick={() => this.handleDeleteRating(rating)}
                          >
                            <span className="fa fa-trash"></span>
                          </a>
                        </div>
                      </div>
                      <div className="row ">
                        <p id="comments">{rating.comments}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MovieForm;
