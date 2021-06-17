import React, { Component } from "react";
import Like from "./like";
import { Link, Redirect } from "react-router-dom";
import SearchMovies from "./searchMovies";

import "../css/movieForm.css";
class MoviesTable extends Component {
  state = {
    showModal: false,
    movie: {},
  };

  sortIcon = () => {
    if (this.props.sortOrder.order == "asc") {
      return "fa fa-sort-asc";
    } else return "fa fa-sort-desc";
  };
  renderTitle = (movie) => {
    if (
      this.props.user &&
      Object.keys(this.props.user).length > 0 &&
      this.props.user.isAdmin == true
    ) {
      return <Link to={`/movies/${movie._id}`}>{movie.title}</Link>;
    } else {
      return (
        <div>
          <a
            id="anchor"
            href="#id"
            data-toggle="modal"
            data-target={"#M" + movie._id}
          >
            {movie.title}
          </a>
          <div id={"M" + movie._id} className="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{movie.title}</h2>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div id="genreTitle">{movie.genre.name}</div>

                  <div id="desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                  </div>
                </div>
                <div className="modal-footer">
                  {
                    <button
                      onClick={() => {
                        if (Object.keys(this.props.user).length == 0) {
                          this.props.history.push("/loginForm");
                          return;
                        } else {
                          this.props.history.push(
                            "/checkout/" + this.props.user._id + "/" + movie._id
                          );
                          return;
                        }
                      }}
                      data-dismiss="modal"
                      className="btn btn-primary mr-auto"
                    >
                      Rent Movie
                    </button>
                  }
                  <button className="btn btn-secondary" data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
    const { paginatedMovies, onSort } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          {this.props.user != undefined &&
            Object.keys(this.props.user).length != 0 &&
            this.props.user.isAdmin == true && (
              <div className="col-3">
                <Link to="/movies/new">
                  <button className="btn btn-primary mb-3">Add Movies</button>
                </Link>
              </div>
            )}

          <div className="col">
            <SearchMovies
              searchString={this.props.searchString}
              onSearch={this.props.onSearch}
            />
          </div>
        </div>

        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th style={{ cursor: "default" }} onClick={() => onSort("title")}>
                Title &nbsp;
                {this.props.sortOrder.path == "title" ? (
                  <span className={this.sortIcon()}></span>
                ) : null}
              </th>
              <th
                style={{ cursor: "default" }}
                onClick={() => onSort("genre.name")}
              >
                Genre &nbsp;
                {this.props.sortOrder.path == "genre.name" ? (
                  <span className={this.sortIcon()}> </span>
                ) : null}
              </th>
              <th
                style={{ cursor: "default" }}
                onClick={() => onSort("numberInStock")}
              >
                Number In Stock &nbsp;
                {this.props.sortOrder.path == "numberInStock" ? (
                  <span className={this.sortIcon()}> </span>
                ) : null}
              </th>
              <th
                style={{ cursor: "default" }}
                onClick={() => onSort("dailyRentalRate")}
              >
                Monthly Rental Rate &nbsp;
                {this.props.sortOrder.path == "dailyRentalRate" ? (
                  <span className={this.sortIcon()}></span>
                ) : null}
              </th>
              <th>Like</th>
              {this.props.user &&
                Object.keys(this.props.user).length > 0 &&
                this.props.user.isAdmin == true && <th>Delete</th>}
              {this.props.user &&
                Object.keys(this.props.user).length > 0 &&
                !this.props.user.isAdmin && <th>Rent</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedMovies.map((movie) => {
              return (
                <tr key={movie._id}>
                  <td>{this.renderTitle(movie)}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>
                    <b>
                      <i className="fa fa-inr"></i>
                    </b>
                    &nbsp;{movie.dailyRentalRate * 30}
                  </td>
                  <td>
                    <Like
                      onLikeToggled={() => this.props.onLike(movie)}
                      liked={movie.like}
                    />
                  </td>
                  {this.props.user &&
                    Object.keys(this.props.user).length > 0 &&
                    this.props.user.isAdmin == true && (
                      <td>
                        {
                          <button
                            onClick={() => {
                              this.props.onDelete(movie._id);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        }
                      </td>
                    )}
                  {this.props.user &&
                    Object.keys(this.props.user).length > 0 &&
                    !this.props.user.isAdmin && (
                      <td>
                        <Link
                          to={
                            "/checkout" +
                            "/" +
                            this.props.user._id +
                            "/" +
                            movie._id
                          }
                        >
                          <button className="btn btn-primary ">Rent</button>
                        </Link>
                      </td>
                    )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default MoviesTable;
