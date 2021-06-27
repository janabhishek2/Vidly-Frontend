import React, { Component } from "react";
import { getCouponById } from "../services/couponService";
import Confetti from "react-confetti";
class Congrats extends Component {
  state = {
    coupon: {},
    width: window.innerWidth,
    height: 720,
  };
  async componentDidMount() {
    const { data: coupon } = await getCouponById(
      this.props.match.params.couponId
    );
    this.setState({
      coupon,
    });
  }
  handleHome = () => {
    this.props.history.replace("/movies");
  };
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center my-5">
          <h1>
            <i>
              {" "}
              <b>Congratulations ! </b> , you have won a coupon worth Rs.{" "}
              <b>{this.state.coupon.value}</b>
            </i>
          </h1>
        </div>
        <div className="d-flex justify-content-center my-5">
          <button onClick={this.handleHome} className="btn btn-info btn-md ">
            Go Back To Home Page
          </button>
        </div>
        <Confetti width={this.state.width} height={this.state.height} />
      </React.Fragment>
    );
  }
}

export default Congrats;
