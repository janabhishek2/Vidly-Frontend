import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
class Footer extends Component {
  state = {};
  render() {
    return (
      <div className="container-fluid" id="footer">
        <div className="row">
          <div className="col-3 offset-1">
            <h3>Links</h3>
            <div>
              <ul type="disc">
                <li>
                  <Link to="/movies">Home</Link>
                </li>
                <li>
                  <Link to="/">Rentals</Link>
                </li>
                <li>
                  <Link to="/profile">Settings</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
