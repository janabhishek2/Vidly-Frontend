import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./common/input";
import * as userService from "../services/userService";
import "../css/registerForm.css";

class RegisterForm extends Component {
  state = {
    user: {
      username: "",
      password: "",
      name: "",
    },
    errors: {},
  };
  schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name"),
  };
  validate = () => {
    const { user } = this.state;
    const options = {
      abortEarly: false,
    };
    const result = Joi.validate(user, this.schema, options);
    const errors = {};
    if (!result.error) return errors;
    else {
      result.error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });

      return errors;
    }
  };
  validateInput = (input) => {
    const obj = {};
    obj[input.name] = input.value;
    const schema = {};
    schema[input.name] = this.schema[input.name];

    const result = Joi.validate(obj, schema);
    if (!result.error) return null;
    else {
      return result.error.details[0].message;
    }
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors });

    if (Object.keys(errors).length != 0) return;

    //call server
    try {
      const result = await userService.register(this.state.user);
      localStorage.setItem("token", result.headers["x-auth-token"]);
      window.location = "/movies";
    } catch (err) {
      if (err.response && err.response.status == 400) {
        const errors = { ...this.state.errors };
        errors.username = "User Already Exists";
        this.setState({ errors });
      }
    }
  };
  handleChange = ({ currentTarget: input }) => {
    //validateInput
    const errors = this.state.errors;
    const error = this.validateInput(input);
    if (error) {
      errors[input.name] = error;
    } else {
      delete errors[input.name];
    }
    this.setState({ errors });

    let user = this.state.user;
    user[input.name] = input.value;
    this.setState({ user });
  };
  render() {
    const { user, errors } = this.state;
    return (
      <div id="registerForm">
        <h1>Register</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <Input
            name="username"
            label="Username"
            type="email"
            error={errors.username}
            onChange={this.handleChange}
            value={user.username}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            error={errors.password}
            onChange={this.handleChange}
            value={user.password}
          />
          <Input
            name="name"
            label="Name"
            type="text"
            error={errors.name}
            onChange={this.handleChange}
            value={user.name}
          />
          <button
            disabled={Object.keys(this.validate()).length == 0 ? false : true}
            className="btn btn-primary"
          >
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
