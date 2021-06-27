import React, { Component } from "react";
import { getUserById } from "../services/userService";
import { getUserCoupons } from "./../services/couponService";
class Coupons extends Component {
  state = {
    user: {},
    coupons: [],
  };
  async componentDidMount() {
    const { data: user } = await getUserById(this.props.match.params.userId);

    const { data: coupons } = await getUserCoupons(user._id);
    this.setState({ user, coupons });
  }
  getCouponClass = (coupon) => {
    if (coupon.isUsed == true) {
      return "-danger";
    } else return "-success";
  };
  render() {
    if (this.state.coupons.length == 0) {
      return (
        <React.Fragment>
          <h4 className="my-3">
            <center>
              <b>My Coupons</b>
            </center>
          </h4>
          <h5>
            <center>
              {" "}
              <i>
                No Coupons Available <span className="fa fa-frown-o"></span>
              </i>
            </center>
          </h5>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h4 className="my-3">
            <center>
              <b>My Coupons</b>
            </center>
          </h4>
          {this.state.coupons.map((coupon) => {
            return (
              <div key={coupon._id} className={"card my-3 "}>
                <div className="card-header">
                  <div className="row">
                    <div className="col-6">
                      <div className="m-2">
                        <b>Coupon ID :</b> {coupon._id}
                      </div>
                      <div className="m-2">
                        <b>Coupon Value :</b> {coupon.value}
                      </div>
                    </div>
                    <div className="col d-flex">
                      <button
                        onClick={() => this.props.onCouponClick(coupon)}
                        className={
                          "ml-auto btn btn-md btn" + this.getCouponClass(coupon)
                        }
                        disabled={coupon.isUsed}
                      >
                        Use Coupon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  }
}

export default Coupons;
