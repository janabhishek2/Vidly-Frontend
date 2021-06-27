import _ from "lodash";
import React, { Component } from "react";
import { getUserById, updateUser } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joi from "joi-browser";
import "../css/profile.css";
import connString from "../services/connUrl";
import axios from "axios";
class Profile extends Component {
  state = {
    user: {
      name: "",
      email: "",
      phone: "",
      addr1: "",
      addr2: "",
      city: "",
      country: "",
      zip: "",
      avtar: "",
    },

    errors: {},
    disabled: true,
    uploadedPercentage: 0,
  };
  userSchema = {
    name: Joi.string().min(1).max(10).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(10).allow(""),
    addr1: Joi.string().min(0).max(50).allow(""),
    addr2: Joi.string().min(0).max(50).allow(""),
    city: Joi.string().min(0).max(20).allow(""),
    country: Joi.string().min(0).max(20).allow(""),
    zip: Joi.string().min(6).max(6).allow(""),
    avtar: Joi.allow(null).allow(""),
  };
  async componentDidMount() {
    try {
      const { data: user } = await getUserById(this.props.match.params.id);

      this.setState({
        user: _.pick(user, [
          "name",
          "email",
          "phone",
          "addr1",
          "addr2",
          "city",
          "country",
          "zip",
          "avtar",
        ]),
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  handleChange = ({ currentTarget: inp }) => {
    const user = { ...this.state.user };
    user[inp.name] = inp.value;
    this.setState({ user });
  };
  handleEditProfile = () => {
    if (this.state.disabled == true) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  };
  validate = () => {
    const options = { abortEarly: false };
    const output = Joi.validate(this.state.user, this.userSchema, options);
    const errors = {};
    if (!output.error) return errors;
    else {
      output.error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });
      return errors;
    }
  };
  handleUserUpdate = async () => {
    // validate
    const errors = this.validate();
    this.setState({ errors });
    if (Object.keys(errors).length != 0) {
      return;
    }
    //call server
    try {
      const fd = new FormData();

      if (typeof this.state.user.avtar === typeof "") {
      } else {
        fd.append("avtar", this.state.user.avtar, this.state.user.avtar.name);
      }

      fd.append("name", this.state.user.name);
      fd.append("email", this.state.user.email);
      fd.append("phone", this.state.user.phone);
      fd.append("addr1", this.state.user.addr1);
      fd.append("addr2", this.state.user.addr2);
      fd.append("city", this.state.user.city);
      fd.append("country", this.state.user.country);
      fd.append("zip", this.state.user.zip);

      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = (loaded / total) * 100;

          if (percent < 100) {
            this.setState({ uploadedPercentage: percent });
          }
          console.log(loaded, total);
        },
      };

      const out = await axios.put(
        connString.url + "users/" + this.props.match.params.id,
        fd,
        options
      );
      this.setState({ uploadedPercenatage: 100 });

      console.log(out);
      if (out.status == 200) {
        toast.success("Data Updated Successfully !  ");
        setTimeout(() => {
          window.location = "/movies";
        }, 3000);
        return;
      }
    } catch (err) {
      toast.error(
        "Something went wrong .. Please try again later or contact admin"
      );
      console.log(err.message);
    }
  };
  handleAvtarChange = ({ target: fname }) => {
    const user = { ...this.state.user };
    user.avtar = fname.files[0];

    this.setState({ user });
  };
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <div id="profile" className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="card mb-5">
              <div id="background" className="card-header">
                <div className="row d-flex justify-content-center">
                  {this.state.user.avtar == "" ? (
                    <img
                      className="img-rounded "
                      src="https://uploads-ssl.webflow.com/6030077fdbd53858ff7c4765/603c1ac00b9e8a080528b4ae_SalonBrillareGenericProfileAvi.jpg"
                      style={{
                        borderRadius: "50%",
                        width: "30%",
                        height: "30%",
                      }}
                    />
                  ) : (
                    <img
                      className="img-thumbnail "
                      src={connString.imageUrl + this.state.user.avtar}
                      style={{
                        margin: "25px",
                        width: "30%",
                        height: "30%",
                      }}
                    />
                  )}
                </div>
                <div className="row justify-content-center">
                  <div className="mt-3 mb-5">
                    <button
                      className="btn btn-info"
                      onClick={this.handleEditProfile}
                    >
                      <i
                        className={
                          this.state.disabled == true
                            ? "fa fa-lock"
                            : "fa fa-unlock"
                        }
                      ></i>
                      &nbsp; Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              <div id="profileData" className="card-body">
                <form enctype="multipart/form-data" onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="avtar">Avtar </label>
                      </div>
                      <div className="col">
                        <div className="form-control">
                          <input
                            type="file"
                            name="avtar"
                            onChange={this.handleAvtarChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="name">Name </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          value={this.state.user.name}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.name ? (
                          <div className="alert alert-danger">
                            {this.state.errors.name}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="email">Email </label>
                      </div>
                      <div className="col">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="email"
                          value={this.state.user.email}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.email ? (
                          <div className="alert alert-danger">
                            {this.state.errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="phone">Phone </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          id="phone"
                          value={this.state.user.phone}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.phone ? (
                          <div className="alert alert-danger">
                            {this.state.errors.phone}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="addr1">Address 1 </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="addr1"
                          className="form-control"
                          id="addr1"
                          value={this.state.user.addr1}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.addr1 ? (
                          <div className="alert alert-danger">
                            {this.state.errors.addr1}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="addr2">Address 2 </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="addr2"
                          className="form-control"
                          id="addr2"
                          value={this.state.user.addr2}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.addr2 ? (
                          <div className="alert alert-danger">
                            {this.state.errors.addr2}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="city">City </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          id="city"
                          value={this.state.user.city}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.city ? (
                          <div className="alert alert-danger">
                            {this.state.errors.city}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="country">Country </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="country"
                          className="form-control"
                          id="country"
                          value={this.state.user.country}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.country ? (
                          <div className="alert alert-danger">
                            {this.state.errors.country}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-2 mt-2">
                        <label htmlFor="zip">Zip </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          name="zip"
                          className="form-control"
                          id="zip"
                          value={this.state.user.zip}
                          onChange={this.handleChange}
                          disabled={this.state.disabled}
                        />
                        {this.state.errors.zip ? (
                          <div className="alert alert-danger">
                            {this.state.errors.zip}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div
                className="card-footer"
                style={{ backgroundColor: "seashell" }}
              >
                <div className="row my-3">
                  <button
                    onClick={this.handleUserUpdate}
                    className="btn btn-primary btn-block"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </React.Fragment>
    );
  }
}

export default Profile;
