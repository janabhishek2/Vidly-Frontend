import React, { Component } from "react";
import { Redirect } from "react-router-dom";
class ProtectedRoute extends Component {
  state = {};
  renderRoute = () => {
    const {
      path,
      component: Comp,
      render,
      adminAuth,
      userAuth,
      user,
      ...rest
    } = this.props;
    if (
      userAuth == true &&
      adminAuth == false &&
      Object.keys(user).length == 0
    ) {
      return <Redirect to="/login" />;
    }
  };
  render() {
    return {};
  }
}

export default ProtectedRoute;
