import React, { Component } from "react";
//import { getMovies, getMovie, saveMovie } from "../services/fakeMovieService";

import { getMovies, getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Joi from "joi-browser";
import Input from "./common/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class MovieForm extends Component {
  state = {
    movie: {
      _id: "",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
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
  render() {
    return (
      <div>
        <ToastContainer />
        <h1>Movie form</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
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
    );
  }
}

export default MovieForm;
