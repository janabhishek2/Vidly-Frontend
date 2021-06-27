import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
class Footer extends Component {
  state = {};
  render() {
    return (
      <div className="container-fluid" id="footer">
        <div className="row">
          <div className="col offset-3 offset-md-5 ">
            <a target="_blank" href="https://github.com/janabhishek2">
              <span id="fontIcon" className="fa fa-github">
                {" "}
              </span>
            </a>
            <a target="_blank" href="http://www.facebook.com/profile.php?id=">
              <span id="fontIcon" className="fa fa-facebook ">
                {" "}
              </span>
            </a>
            <a target="_blank" href="http://www.linkedin.com/in/">
              <span id="fontIcon" className="fa fa-linkedin ">
                {" "}
              </span>
            </a>

            <a target="_blank" href="mailto:janabhishek2@gmail.com">
              <span id="fontIcon" className="fa fa-envelope"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
