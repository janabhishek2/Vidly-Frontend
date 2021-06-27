import React, { Component } from "react";
import { getUserById } from "../services/userService";
import { getPaymentMethods } from "./../services/paymentService";
import {
  saveRental,
  getPaymentIntent,
  payUsingCoupon,
} from "./../services/rentalService";
import Coupons from "./coupons";
import { Link, Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMovie } from "../services/movieService";
import { CouponToPay } from "./../services/couponService";

class PaymentMethods extends Component {
  state = {
    user: {},
    pm: [],
    movie: {},
  };
  async componentDidMount() {
    try {
      /*  60c7b1bf1a191e48d49d7027 */
      const { userId, movieId } = this.props.match.params;
      const { data: user } = await getUserById(userId);
      const { data: pms } = await getPaymentMethods(user.customerId);
      const { data: movie } = await getMovie(movieId);
      this.setState({ pm: pms.data });
      this.setState({ movie, user });
    } catch (err) {
      console.log(err.message);
    }
  }
  handleSavedCard = async (pm) => {
    try {
      const { stripe } = this.props;
      const { data: user } = await getUserById(this.props.match.params.userId);
      const paymentId = pm.id;
      const customerId = pm.customer;
      const { userId, movieId } = this.props.match.params;

      const { data: client_secret } = await getPaymentIntent(userId, movieId);
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentId,
      });

      if (result.paymentIntent.status === "succeeded") {
        const out = await saveRental(
          userId,
          movieId,
          result.paymentIntent.payment_method,
          result.paymentIntent.payment_method_types[0]
        );
        toast.success("Payment Successful !");

        if (user.numOrders % 19 == 0 && user.numOrders > 0) {
          setTimeout(() => {
            this.props.history.replace("/congrats/" + out.data._id);
          }, 3000);
        } else {
          setTimeout(() => {
            this.props.history.replace("/movies");
          }, 3000);
        }
      }
    } catch (err) {
      toast.error("Something Failed ! Try Again Later");
      console.log(err.message);
    }
  };
  handleCoupon = async (coupon) => {
    try {
      if (coupon.isUsed == true) {
        toast.error("Coupon Already Used  !");
        return;
      }
      if (coupon.value < this.state.movie.dailyRentalRate * 30) {
        toast.error("Movie Value Should Be less than coupon value !");
        return;
      } else {
        const data = await CouponToPay(coupon._id, this.state.movie._id);
        const out = await payUsingCoupon(
          this.state.user._id,
          this.state.movie._id,
          coupon._id
        );
        if (out.status == 200) {
          toast.success("Movie Rented Using Coupon");
          setTimeout(() => {
            window.location = "/movies";
          }, 2000);
        }
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Something Went Wrong !");
    }
  };
  render() {
    const { userId, movieId } = this.props.match.params;

    return (
      <div>
        <ToastContainer />
        <h4 className="my-3" style={{ textAlign: "center" }}>
          <b>Saved Cards</b>
        </h4>
        {this.state.pm.map((pm) => {
          return (
            <div key={pm.id} className="card my-2">
              <div className="card-header">
                <div className="d-flex">
                  <div className="  m-3">
                    <b>
                      <i
                        style={{ fontSize: "25px" }}
                        className={"fa fa-cc-" + pm.card.brand}
                      ></i>
                    </b>
                  </div>
                  <div className="  m-3 ">
                    <b>Card Number : </b>
                    {"XXXX-XXXX-XXXX-" + pm.card.last4}
                  </div>
                  <div className="  m-3">
                    <b>Expiry : </b>
                    {pm.card.exp_month + "/" + pm.card.exp_year}
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => this.handleSavedCard(pm)}
                      className="btn btn-primary m-3"
                    >
                      {"Pay "}
                      <i className="fa fa-inr"></i>
                      {" " + this.state.movie.dailyRentalRate * 30}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <br />
        <Coupons
          {...this.props}
          onCouponClick={(coupon) => this.handleCoupon(coupon)}
        />
        <br />
        <hr />
        <Link to={"/checkoutForm/" + userId + "/" + movieId}>
          <button
            onClick={this.handleNewCard}
            className="btn btn-primary btn-block mt-5"
          >
            <b>Add New Card</b>
          </button>
        </Link>
      </div>
    );
  }
}

export default PaymentMethods;
