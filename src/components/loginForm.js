import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./common/input";

import { login } from "./../services/authService";
import "../css/loginForm.css";
class LoginForm extends Component {
  state = {
    account: {
      username: "",
      password: "",
    },
    errors: {},
  };
  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };
  validate = () => {
    const options = {
      abortEarly: false,
    };
    const result = Joi.validate(this.state.account, this.schema, options);

    const errors = {};
    if (!result.error) return errors;
    else {
      result.error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });
      return errors;
    }
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors });

    if (Object.keys(errors).length != 0) return;

    //call server

    try {
      const result = await login(this.state.account);
      localStorage.setItem("token", result.data);
      /* this.props.onLogin(); */
      /*   <Redirect to="/movies" />; */
      window.location = "/movies";
    } catch (err) {
      if (err.response && err.response.status == 400) {
        const errors = { ...this.state.errors };
        errors.username = "Invalid Username Or Password";
        this.setState({ errors });
      }
    }
  };
  validateInput = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };

    const result = Joi.validate(obj, schema);
    if (!result.error) return null;
    else {
      return result.error.details[0].message;
    }
  };
  handleChange = ({ currentTarget: input }) => {
    //validate Ip
    let errors = this.state.errors;
    const error = this.validateInput(input);
    if (error) {
      errors[input.name] = error;
    } else {
      delete errors[input.name];
    }
    this.setState({ errors });

    let account = this.state.account;
    account[input.name] = input.value;
    this.setState({ account });
  };
  render() {
    const { account, errors } = this.state;
    return (
      <div id="loginForm">
        <h1>Login</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <Input
            name="username"
            label="Username"
            type="text"
            onChange={this.handleChange}
            value={account.username}
            error={errors.username}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            onChange={this.handleChange}
            value={account.password}
            error={errors.password}
          />
          <button
            disabled={Object.keys(this.validate()).length == 0 ? false : true}
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
