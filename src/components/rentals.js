import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRentals, updateRental } from "../services/rentalService";
import MovieForm from "./movieForm";
import "../css/rentals.css";
import { ThemeConsumer } from "styled-components";

class Rentals extends Component {
  state = {
    rentals: [],
    rating: 0,
    stars: [
      {
        value: 0,
        selected: false,
        description: "Poor",
        color: "red",
      },

      {
        value: 1,
        selected: false,
        description: "Below Average",
        color: "#D65C23",
      },
      {
        value: 2,
        selected: false,
        description: "Average",
        color: "#FAD520",
      },
      {
        value: 3,
        selected: false,
        description: "Above Average",
        color: "#2DD63D",
      },
      {
        value: 4,
        selected: false,
        description: "Excellent !",
        color: "darkgreen",
      },
    ],
    comments: "",
  };
  async componentDidMount() {
    try {
      const { data: rentals } = await getRentals(this.props.user._id);
      this.setState({ rentals });
    } catch (err) {
      console.log(err);
    }
  }

  validateRental = (rental) => {
    let currDate = Date.now();
    let expireDate = new Date(rental.expiresOn);
    if (expireDate.getTime() - currDate > 0) {
      return true;
    } else return false;
  };
  getStarClass = (star) => {
    if (star.selected == true) {
      return "fa fa-star";
    } else return "fa fa-star-o";
  };
  handleStarSelect = (star) => {
    const stars = [...this.state.stars];

    for (let i = 0; i < 5; i++) {
      stars[i].selected = false;
    }
    for (let i = 0; i <= star.value; i++) {
      stars[i].selected = true;
    }
    this.setState({ stars });
    this.setState({ rating: star.value + 1 });
  };
  handleComments = ({ currentTarget: inp }) => {
    this.setState({ comments: inp.value });
  };
  handleRating = async (rentalId) => {
    try {
      if (this.state.rating == 0) {
        toast.error("Please provide a rating !");
        return;
      }
      const result = await updateRental(
        rentalId,
        this.state.rating,
        this.state.comments
      );
      if (result.status == 200) {
        toast.success("Movie Rated Successfully !");
        this.resetRatings();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  resetRatings = () => {
    const stars = [...this.state.stars];
    for (let i = 0; i < 5; i++) {
      stars[i].selected = false;
    }
    this.setState({ stars });
    this.setState({ rating: 0 });
    this.setState({ comments: "" });
  };
  render() {
    if (this.state.rentals.length == 0) {
      return (
        <center className="mt-5">
          <h3>
            <i>You have not rented any movies !</i>
          </h3>
        </center>
      );
    } else {
      return (
        <div id="accordion">
          <ToastContainer />
          {this.state.rentals.map((rental) => {
            return (
              <div className="card" key={rental._id}>
                <div className="card-header">
                  <div className="d-flex">
                    <div>
                      <button
                        className="btn btn-primary btn-sm"
                        data-toggle="collapse"
                        data-target={"#R" + rental._id}
                      >
                        <span className="fa fa-caret-down"></span>
                      </button>
                    </div>
                    <div className="ml-3 mr-auto">
                      <span>
                        <div className="font-weight-bold">
                          {rental.movie.title}
                        </div>
                      </span>
                    </div>
                    <div className="ml-auto">
                      <span>
                        Status :{" "}
                        {this.validateRental(rental) ? (
                          <b style={{ color: "green" }}>Active</b>
                        ) : (
                          <b style={{ color: "red" }}>Expired</b>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id={"R" + rental._id}
                  className="collapse"
                  data-parent="#accordion"
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-10">
                        <div className="mt-2">
                          <b>Rental Id : {rental._id}</b>
                        </div>
                        <div className="mt-2">
                          <b>Movie Title : </b>
                          {rental.movie.title}
                        </div>
                        <div className="mt-2">
                          <b>Purchased On : </b>
                          {new Date(rental.dateOut).toString()}
                        </div>
                        <div className="mt-2">
                          <b>Amount Paid : </b>
                          {rental.incomeFromRental}
                          <b> Rs</b>
                        </div>

                        <div className="mt-2">
                          <b>Expires On : </b>
                          {new Date(rental.expiresOn).toString()}
                        </div>
                      </div>

                      <div className="col mt-3">
                        <div className="row">
                          {this.validateRental(rental) ? (
                            <button className="btn btn-success">
                              Watch Movie
                            </button>
                          ) : (
                            <button className="btn btn-danger">Expired</button>
                          )}
                        </div>
                        <div className="row mt-5">
                          <a
                            className="btn btn-warning"
                            data-toggle="modal"
                            data-target={"#Rate" + rental._id}
                          >
                            Rate Movie
                          </a>
                          <div id={"Rate" + rental._id} className="modal">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h3>Rate {rental.movie.title}</h3>
                                  <button
                                    onClick={this.resetRatings}
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                  >
                                    &times;
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="d-flex justify-content-center">
                                    <div id="stars">
                                      {this.state.stars.map((star) => {
                                        return (
                                          <span>
                                            <a
                                              key={star.value}
                                              onClick={() =>
                                                this.handleStarSelect(star)
                                              }
                                            >
                                              <i
                                                id="star"
                                                style={{
                                                  color:
                                                    this.state.rating > 0
                                                      ? this.state.stars[
                                                          this.state.rating - 1
                                                        ].color
                                                      : "gray",
                                                }}
                                                className={this.getStarClass(
                                                  star
                                                )}
                                              ></i>
                                            </a>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {this.state.rating ? (
                                    <div
                                      className="mt-2"
                                      id="description"
                                      className=" d-flex justify-content-center"
                                      style={{
                                        color:
                                          this.state.stars[
                                            this.state.rating - 1
                                          ].color,
                                      }}
                                    >
                                      {
                                        this.state.stars[this.state.rating - 1]
                                          .description
                                      }
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div className="form-group">
                                    <input
                                      id="comments"
                                      className="form-control"
                                      type="text"
                                      placeholder="Say a few words about the movie .. "
                                      value={this.state.comments}
                                      onChange={this.handleComments}
                                    />
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    onClick={() =>
                                      this.handleRating(rental._id)
                                    }
                                    className="btn btn-block btn-primary"
                                    data-dismiss="modal"
                                  >
                                    Rate Movie
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <h5>
                      <center>Payment Details</center>
                    </h5>
                    <div className="mt-2">
                      <b>Payment ID : </b>
                      {rental.paymentMethodId}
                    </div>
                    <div className="mt-2">
                      <b>Payment Method : </b>
                      {rental.paymentMethodName}
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }
}

export default Rentals;
