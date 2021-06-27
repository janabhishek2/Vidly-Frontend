import React, { Component } from "react";

import Carousel from "react-elastic-carousel";
import _ from "lodash";
import { getLatestMovies } from "../services/movieService";
import "../css/imageSlider.css";
import DisplayRatings from "./common/displayRatings";
import DisplayReviews from "./common/displayReviews";
import connString from "../services/connUrl";

class LatestImageSlider extends Component {
  state = {
    movies: [],
  };
  async componentDidMount() {
    let { data: movs } = await getLatestMovies();
    let i = 0;
    const movies = movs.filter((movie) => {
      i++;
      return i < 15;
    });
    this.setState({ movies });
  }
  breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 4 },
    { width: 1200, itemsToShow: 6 },
  ];

  render() {
    return (
      <React.Fragment>
        <h3 id="newReleases">
          <span>NEW RELEASES</span>
        </h3>
        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
          }}
          className="carousel-wrapper"
        >
          <Carousel breakPoints={this.breakPoints}>
            {this.state.movies.map((movie) => {
              return (
                <React.Fragment>
                  <img
                    id="image"
                    key={movie._id}
                    src={connString.imageUrl + movie.tile}
                    width="70%"
                    height="70%"
                    data-toggle="modal"
                    data-target={"#M" + movie._id}
                  />
                  <div id={"M" + movie._id} className="modal">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>{movie.title}</h2>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="modal-body">
                          <div
                            id="movieTile"
                            className="d-flex justify-content-center"
                          >
                            <img
                              src={connString.imageUrl + movie.tile}
                              alt="Sample Tile"
                              width="50%"
                              height="50%"
                              className="img-thumbnail"
                            />
                          </div>
                          <DisplayRatings movie={movie} />
                          <div id="genreTitle">{movie.genre.name}</div>
                          <div id="desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum
                          </div>
                          <DisplayReviews movie={movie} />
                        </div>
                        <div className="modal-footer">
                          {
                            <button
                              onClick={() => {
                                if (
                                  this.props.user == undefined ||
                                  Object.keys(this.props.user).length == 0
                                ) {
                                  this.props.history.push("/loginForm");
                                  return;
                                } else {
                                  this.props.history.push(
                                    "/paymentMethods/" +
                                      this.props.user._id +
                                      "/" +
                                      movie._id
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
                          <button
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </Carousel>
        </div>
      </React.Fragment>
    );
  }
}

export default LatestImageSlider;
