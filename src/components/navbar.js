import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import "../css/navbar.css";
class NavBar extends Component {
  state = {};
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light nav-color mb-3">
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            to="/movies"
            style={{ color: "white", fontSize: "20", fontWeight: "bold" }}
          >
            &nbsp;Vidly
          </Link>

          <button
            id="navbarToggler"
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbarSupportedContent" className="collapse navbar-collapse">
            <ul className="navbar-nav" id="navbar">
              <li className="nav-item">
                <NavLink to="/movies" className="nav-link" id="navLink">
                  <i className="fa fa-film"> </i> &nbsp;Movies
                </NavLink>
              </li>
              {this.props.user &&
                Object.keys(this.props.user).length > 0 &&
                this.props.user.isAdmin && (
                  <li className="nav-item">
                    <NavLink to="/allRentals" className="nav-link" id="navLink">
                      All Rentals
                    </NavLink>
                  </li>
                )}
              {this.props.user &&
                Object.keys(this.props.user).length > 0 &&
                this.props.user.isAdmin && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customers" id="navLink">
                      Customers
                    </NavLink>
                  </li>
                )}
              {this.props.user &&
                Object.keys(this.props.user).length > 0 &&
                this.props.user.isAdmin != true && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/rentals" id="navLink">
                      Rentals
                    </NavLink>
                  </li>
                )}
            </ul>
            <ul className="navbar-nav ml-auto">
              {Object.keys(this.props.user).length == 0 && (
                <React.Fragment>
                  <li className="nav-item">
                    <NavLink className="nav-link " to="/loginForm" id="navLink">
                      <i className="fa fa-sign-in"></i>&nbsp;Login
                    </NavLink>
                  </li>

                  <li className="nav-item ">
                    <NavLink
                      className="nav-link"
                      to="/registerForm"
                      id="navLink"
                    >
                      <i className="fa fa-user-plus"></i>&nbsp;Register
                    </NavLink>
                  </li>
                </React.Fragment>
              )}

              {Object.keys(this.props.user).length != 0 && (
                <React.Fragment>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link "
                      to={"/profile/" + this.props.user._id}
                      id="navLink"
                    >
                      <i className="fa fa-user-circle"> </i>&nbsp;{" "}
                      {this.props.user.name}
                    </NavLink>
                  </li>

                  <li className="nav-item ">
                    <NavLink className="nav-link" to="/logout" id="navLink">
                      <i className="fa fa-sign-out"></i>&nbsp; Logout
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
