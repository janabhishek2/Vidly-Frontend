import React, { Component } from "react";
class DisplayRatings extends Component {
  state = {};
  render() {
    const stars = [
      {
        display: false,
      },
      {
        display: false,
      },
      {
        display: false,
      },
      {
        display: false,
      },
      {
        display: false,
      },
    ];
    for (let i = 0; i < Math.ceil(this.props.movie.overallRating); i++) {
      stars[i].display = true;
    }
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center mt-2">
          {stars.map((star) => {
            if (star.display == true) {
              return <span id="starImageSlider" className="fa fa-star"></span>;
            } else
              return (
                <span id="starImageSlider" className="fa fa-star-o"></span>
              );
          })}
        </div>
        <div className="d-flex justify-content-center mt-2">
          <i>{this.props.movie.ratings.length + " reviews"}</i>
        </div>
      </React.Fragment>
    );
  }
}

export default DisplayRatings;
