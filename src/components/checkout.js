import React, { Component } from "react";

import { getMovie } from "../services/movieService";
import { saveRental } from "./../services/rentalService";
import StripeCheckout from "react-stripe-checkout";
import "../css/checkout.css";
import { saveInvoice } from "./../services/invoiceService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { result } from "lodash";
class CheckOut extends Component {
  state = {
    movie: {},
  };
  async componentDidMount() {
    try {
      const { data } = await getMovie(this.props.match.params.movieId);
      const movie = {
        title: data.title,
        name: data.name,
        genre: data.genre.name,
        dailyRentalRate: data.dailyRentalRate,
      };
      this.setState({ movie });
    } catch (err) {
      console.log(err.message);
    }
  }
  handleCancel = () => {
    this.props.history.push("/movies");
    return;
  };
  handleToken = async (token) => {
    try {
      const { userId, movieId } = this.props.match.params;

      const ans = await saveRental(token, userId, movieId);

      if (ans.status == 200) {
        toast.success("Transaction Successful !");
        setTimeout(() => {
          window.location = "/movies";
        }, 3000);
      }
    } catch (err) {
      toast.error("Something Unexpected Occured ! Please Try again");
      /*  setTimeout(() => {
        window.location = "/movies";
      }, 2000); */
    }
  };
  handleCheckOut = async () => {
    const { userId, movieId } = this.props.match.params;
    try {
    } catch (err) {
      console.log(err.message);
    }
  };
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="card my-3">
              <div className="card-header">
                <div className="row">
                  <div className="col-5">
                    <img
                      src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80"
                      width="250"
                      height="300"
                    />
                  </div>
                  <div className="col">
                    <h1 className="title">{this.state.movie.title}</h1>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <h3 className="genre-title my-4">{this.state.movie.genre}</h3>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum
                </p>
              </div>
              <div className="card-footer">
                <div className="d-flex">
                  <StripeCheckout
                    stripeKey="pk_test_51J0lWVSIzf3zxTqq0j81jBi5wZnjkt3PigreAQB96j2cQpRZDoUXKjFaUC1GYy2fVwZxVnwtPgLvEsDmejPhMNAx002G8dxdZF"
                    token={this.handleToken}
                    amount={this.state.movie.dailyRentalRate * 30 * 100}
                    name={this.state.movie.title}
                    email={this.props.user.email}
                    currency="INR"
                  >
                    <button className="btn mt-3 btn-warning">
                      Rent for 30 days
                    </button>
                  </StripeCheckout>

                  <button
                    className="btn btn-danger ml-auto m-3"
                    style={{ width: "20%" }}
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </React.Fragment>
    );
  }
}

export default CheckOut;
