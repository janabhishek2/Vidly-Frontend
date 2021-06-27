import React, { Component } from "react";
import { getAllRentals } from "../services/rentalService";
import { searchRenatalsUsingEmail } from "../utils/searchRentalsUsingEmail";
import { searchRentalsUsingId } from "./../utils/searchRentalsUsingId";
class AllRentals extends Component {
  state = {
    rentals: [],
    rentalId: "",
    userId: "",
  };
  async componentDidMount() {
    const { data: rentals } = await getAllRentals();
    this.setState({ rentals });
  }
  handleRentalChange = ({ currentTarget: inp }) => {
    const userId = "";
    this.setState({ userId });

    const rentalId = inp.value;
    this.setState({ rentalId });
  };
  validateRental = (rental) => {
    let currDate = Date.now();
    let expireDate = new Date(rental.expiresOn);
    if (expireDate.getTime() - currDate > 0) {
      return true;
    } else return false;
  };
  handleUserChange = ({ currentTarget: inp }) => {
    const rentalId = "";
    this.setState({ rentalId });

    const userId = inp.value;
    this.setState({ userId });
  };
  render() {
    if (this.state.rentals.length == 0) {
      return <h1>No Rentals Found !</h1>;
    }

    const rentalsUsingId = searchRentalsUsingId(
      this.state.rentals,
      this.state.rentalId
    );
    const rentalsUsingEmail = searchRenatalsUsingEmail(
      rentalsUsingId,
      this.state.userId
    );

    return (
      <div>
        <div className="row my-3">
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              value={this.state.rentalId}
              onChange={this.handleRentalChange}
              placeholder="Enter Rental Id"
            />
          </div>
          <div className="col-6">
            <input
              type="text"
              className="form-control"
              value={this.state.userId}
              onChange={this.handleUserChange}
              placeholder="Enter User Email"
            />
          </div>
        </div>
        {rentalsUsingEmail.map((rental) => {
          const date = new Date(rental.dateOut).toString();
          return (
            <div className="card my-3">
              <div className="card-header">
                <div className="d-flex">
                  <div className="mr-auto">
                    <h5>
                      <b>Customer Email :</b> {rental.user.email}{" "}
                    </h5>
                  </div>
                  <div className="ml-auto">
                    <h5>
                      <b>Movie Title : </b>
                      {rental.movie.title}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="card-body m-2">
                <div className="mt-2">
                  <b>Rental id : </b>
                  {rental._id}
                </div>
                <div className="mt-2">
                  <b>CustomerId : </b> {rental.user._id}
                </div>
                <div className="mt-2">
                  <b>MovieId : </b> {rental.movie._id}
                </div>
                <div className="mt-2">
                  <b>Purchased On :</b> {date}
                  {}
                </div>
                <div className="mt-2">
                  <b>Income From Rental : </b>
                  {rental.incomeFromRental + " "}
                  <b>
                    <i className="fa fa-inr"> </i>
                  </b>
                </div>
                <div className="mt-2">
                  <b>Description : </b>
                  {rental.description}
                </div>
                <div className="mt-2">
                  <b>Customer Payment Id : </b>
                  {rental.customerPaymentId}
                </div>
                <div className="mt-2">
                  <b>Payment Method ID : </b>
                  {rental.paymentMethodId}
                </div>
                <div className="mt-2">
                  <b>Payment Method Type : </b>
                  {rental.paymentMethodName}
                </div>
              </div>
              <div className="card-footer">
                <div className="mr-auto">
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
          );
        })}
      </div>
    );
  }
}

export default AllRentals;
