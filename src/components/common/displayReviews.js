import React, { Component } from "react";

import "../../css/displayReviews.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class DisplayReviews extends Component {
  state = {
    moreReviews: true,
    hideReviews: false,
  };
  componentDidMount = () => {
    const movie = this.props.movie;

    this.setState({ movie });
  };
  getMoreReviewsClass = () => {
    if (this.state.moreReviews == true) {
      return "";
    } else return "d-none";
  };
  handleMoreReviews = () => {
    this.setState({ moreReviews: false });
    this.setState({ hideReviews: true });
  };
  handleHideReviews = () => {
    if (this.state.moreReviews == false) {
      this.setState({ hideReviews: false });
      this.setState({ moreReviews: true });
    }
  };
  getHideReviewsClass = () => {
    if (this.state.hideReviews == true) {
      return "";
    } else return "d-none";
  };

  render() {
    if (this.props.movie.ratings.length == 0) {
      return <React.Fragment></React.Fragment>;
    } else if (this.props.movie.ratings.length <= 2) {
      return (
        <div id="reviews">
          <ToastContainer />
          <span id="reviewsHeading">Reviews</span>
          {this.props.movie.ratings.map((rating) => {
            return (
              <div key={rating._id} id="review">
                <div className="row">
                  <div className="col-2 mt-1">
                    {rating.userAvtar ? (
                      <img
                        src={"http://localhost:5000/" + rating.userAvtar}
                        width="40px"
                        height="40px"
                        className="img-thumbnail"
                      />
                    ) : (
                      <img
                        src={"http://localhost:5000/images\\users\\sample.png"}
                        width="40px"
                        height="40px"
                        className="img-thumbnail"
                      />
                    )}
                  </div>
                  <div className="col-8">
                    <div className="d-flex">
                      <div className="mr-auto">
                        <b>{rating.userName}</b>
                      </div>
                      <div className="ml-auto">
                        <span className="fa fa-star"></span> {rating.value}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="mr-auto">{rating.comments}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      let i = 0;
      const twoReviews = this.props.movie.ratings.filter((rating) => {
        i++;
        return i <= 2;
      });
      const reviews = [...this.props.movie.ratings];
      const morethan2reviews = reviews.splice(2, reviews.length);

      return (
        <div id="reviews">
          <ToastContainer />
          <span id="reviewsHeading">Reviews</span>
          {twoReviews.map((rating) => {
            return (
              <div key={rating._id} id="review">
                <div className="row">
                  <div className="col-2 mt-1">
                    <img
                      src={"http://localhost:5000/" + rating.userAvtar}
                      width="40px"
                      height="40px"
                      className="img-thumbnail"
                    />
                  </div>
                  <div className="col">
                    <div className="d-flex">
                      <div className="mr-auto">
                        <b>{rating.userName}</b>
                      </div>
                      <div className="ml-auto">
                        <span className="fa fa-star"></span> {rating.value}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="mr-auto">{rating.comments}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            className={"btn btn-info btn-block " + this.getMoreReviewsClass()}
            data-toggle="collapse"
            data-target="#moreReviews"
            onClick={this.handleMoreReviews}
          >
            See more reviews <span className="fa fa-angle-down"></span>
          </button>
          <div id="moreReviews" className="collapse">
            {morethan2reviews.map((rating) => {
              return (
                <div key={rating._id} id="review">
                  <div className="row">
                    <div className="col-2 mt-1">
                      <img
                        src={"http://localhost:5000/" + rating.userAvtar}
                        width="40px"
                        height="40px"
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <div className="mr-auto">
                          <b>{rating.userName}</b>
                        </div>
                        <div className="ml-auto">
                          <span className="fa fa-star"></span> {rating.value}
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="mr-auto">{rating.comments}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className={"btn btn-info btn-block " + this.getHideReviewsClass()}
            data-toggle="collapse"
            data-target="#moreReviews"
            onClick={this.handleHideReviews}
          >
            Hide Reviews <span className="fa fa-angle-up"></span>
          </button>
        </div>
      );
    }
  }
}

export default DisplayReviews;
