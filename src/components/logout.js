import React, { Component } from "react";
import { Redirect } from "react-router-dom";
class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    /*  this.props.onLogout(); */
    {
      /* <Redirect to="/movies" />; */
    }
    window.location = "/movies";
  }
  render() {
    return null;
  }
}

export default Logout;
