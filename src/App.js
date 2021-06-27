import jwtDecode from "jwt-decode";
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import Movies from "./components/movies";
import NavBar from "./components/navbar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Test from "./components/test";
import Logout from "./components/logout";
import CheckOut from "./components/checkout";
import Profile from "./components/profile";
import Footer from "./components/footer";

import "./css/app.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutForm from "./components/checkoutForm";
import PaymentMethods from "./components/paymentMethods";
import AllRentals from "./components/allRentals";
import Coupons from "./components/coupons";
import Congrats from "./components/congrats";

class App extends Component {
  state = {
    user: {},
  };
  componentDidMount = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);

      this.setState({ user });
    } catch (err) {}
  };
  render() {
    return (
      <React.Fragment>
        <Elements
          stripe={loadStripe(
            "pk_test_51J0lWVSIzf3zxTqq0j81jBi5wZnjkt3PigreAQB96j2cQpRZDoUXKjFaUC1GYy2fVwZxVnwtPgLvEsDmejPhMNAx002G8dxdZF"
          )}
        >
          <ToastContainer />
          <NavBar user={this.state.user} />
          <div id="main" className="container">
            <Switch>
              <Route
                path="/movies/:id"
                render={(props) => {
                  console.log(this.state.user);
                  if (
                    this.state.user &&
                    Object.keys(this.state.user).length != 0 &&
                    this.state.user.isAdmin == true
                  ) {
                    return <MovieForm {...props} />;
                  } else {
                    return <Redirect to="/loginForm" />;
                  }
                }}
              />
              <Route
                path="/movies"
                render={(props) => {
                  return (
                    <Movies {...props} user={this.state.user} newProp={"123"} />
                  );
                }}
              />
              <Route path="/coupons/:userId" component={Coupons} />
              <Route path="/congrats/:couponId" component={Congrats} />
              <Route path="/allRentals" component={AllRentals} />
              <Route
                path="/checkoutForm/:userId/:movieId"
                render={(props) => {
                  return <CheckoutForm {...props} />;
                }}
              />
              <Route path="/customers" component={Customers} />
              <Route
                path="/rentals"
                render={(props) => {
                  return <Rentals {...props} user={this.state.user} />;
                }}
              />

              <Route
                path="/loginForm"
                render={(props) => {
                  if (Object.keys(this.state.user).length > 0) {
                    return <Redirect to="/movies" />;
                  } else {
                    return <LoginForm {...props} />;
                  }
                }}
              />
              <Route
                path="/checkout/:userId/:movieId"
                render={(props) => {
                  return <CheckOut {...props} user={this.state.user} />;
                }}
              />
              <Route
                path="/registerForm"
                render={(props) => {
                  if (Object.keys(this.state.user).length > 0) {
                    return <Redirect to="/movies" />;
                  } else {
                    return <RegisterForm {...props} />;
                  }
                }}
              />
              <Route
                path="/logout"
                render={(props) => {
                  return <Logout {...props} />;
                }}
              />
              <Route
                path="/profile/:id"
                render={(props) => {
                  return <Profile {...props} user={this.state.user} />;
                }}
              />
              <Route
                path="/paymentMethods/:userId/:movieId"
                render={(props) => {
                  return (
                    <ElementsConsumer>
                      {({ elements, stripe }) => {
                        return (
                          <PaymentMethods
                            elements={elements}
                            stripe={stripe}
                            userId={this.state.user._id}
                            {...props}
                          />
                        );
                      }}
                    </ElementsConsumer>
                  );
                }}
              />
              <Route path="/not-found" component={NotFound} />
              <Route path="/" exact component={Movies} />

              <Redirect to="/not-found" />
            </Switch>
          </div>
        </Elements>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
