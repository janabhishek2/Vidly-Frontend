import { validate } from "joi-browser";
import React, { Component } from "react";
import { getRentals } from "../services/rentalService";
import MovieForm from "./movieForm";

class Rentals extends Component {
  state = {
    rentals: [],
  };
  async componentDidMount() {
    try {
      const { data: rentals } = await getRentals(this.props.user._id);
      this.setState({ rentals });
    } catch (err) {
      console.log(err.message);
    }
  }
  validateRental = (rental) => {
    let currDate = Date.now();
    let expireDate = new Date(rental.expiresOn);
    if (expireDate.getTime() - currDate > 0) {
      return true;
    } else return false;
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
                        <span className="fa fa-plus"></span>
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
                          <b>Transaction ID : </b>
                          {rental.uuidKey}
                        </div>
                        <div className="mt-2">
                          <b>IP address: </b>
                          {rental.userIP}
                        </div>
                        <div className="mt-2">
                          <b>Expires On : </b>
                          {new Date(rental.expiresOn).toString()}
                        </div>
                      </div>

                      <div className="col mt-5">
                        {this.validateRental(rental) ? (
                          <button className="btn btn-success">
                            Watch Movie
                          </button>
                        ) : (
                          <button className="btn btn-danger">Expired</button>
                        )}
                      </div>
                    </div>
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
