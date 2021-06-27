import React from "react";

import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";

import { saveRental, getPaymentIntent } from "./../services/rentalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserById } from "../services/userService";

class CheckoutForm extends React.Component {
  state = {
    client_secret: "",
    user: {},
  };
  async componentDidMount() {
    const { userId } = this.props.match.params;
    const { data: user } = await getUserById(userId);
    this.setState({ user });
  }
  handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const { stripe, elements } = this.props;

      if (!stripe || !elements) {
        return;
      }
      const { userId, movieId } = this.props.match.params;
      const { data: client_secret } = await getPaymentIntent(userId, movieId);
      const { data: user } = await getUserById(userId);

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
          },
        },
      });
      console.log(result);
      if (result.error) {
        toast.error(result.error.message);
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const out = await saveRental(
            userId,
            movieId,
            result.paymentIntent.payment_method,
            result.paymentIntent.payment_method_types[0]
          );
          toast.success("Payment Successful !");

          if (user.numOrders % 19 == 0 && user.numOrders > 0) {
            setTimeout(() => {
              this.props.history.replace("/congrats/" + out.data._id);
            }, 3000);
          } else {
            setTimeout(() => {
              this.props.history.replace("/movies");
            }, 3000);
          }
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  cardStyle = {
    style: {
      base: {
        color: "#32325d",

        fontFamily: "Arial, sans-serif",

        fontSmoothing: "antialiased",

        fontSize: "25px",

        "::placeholder": {
          color: "#32325d",
        },
        margin: "25px",
      },

      invalid: {
        color: "#fa755a",

        iconColor: "#fa755a",
      },
    },
  };
  render() {
    const { stripe } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="my-3">
        <ToastContainer />
        <CardElement options={this.cardStyle} />
        <button
          className="btn btn-primary btn-block mt-3"
          type="submit"
          disabled={!stripe}
        >
          Pay
        </button>
      </form>
    );
  }
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

class InjectedCheckout extends React.Component {
  InjectedCheckoutForm = () => {
    return (
      <ElementsConsumer>
        {({ elements, stripe }) => (
          <CheckoutForm {...this.props} elements={elements} stripe={stripe} />
        )}
      </ElementsConsumer>
    );
  };
  render() {
    return this.InjectedCheckoutForm();
  }
}
export default InjectedCheckout;
