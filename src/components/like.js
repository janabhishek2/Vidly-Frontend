import React, { Component } from "react";
class Like extends Component {
  render() {
    if (this.props.liked == true) {
      return (
        <i
          style={{ cursor: "pointer" }}
          onClick={this.props.onLikeToggled}
          className="fa fa-heart"
        ></i>
      );
    } else
      return (
        <i
          style={{ cursor: "pointer" }}
          onClick={this.props.onLikeToggled}
          className="fa fa-heart-o"
        ></i>
      );
  }
}

export default Like;
