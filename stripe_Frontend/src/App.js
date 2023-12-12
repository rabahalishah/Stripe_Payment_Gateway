import logo from './logo.svg';
import './App.css';
import StripeCheckout from 'react-stripe-checkout';
import { useState } from 'react';

function App() {
  const [product, setProduct] = useState({
    name: 'React from FB',
    price: 10,
    productBy: 'facebook',
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    //stripe do not work with http make sure to use https
    return fetch(`http://localhost:8282/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log('RESPONSE: ', response);
        const { status } = response;

        console.log('STATUS: ', status);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          token={makePayment}
          name="Buy React"
          amount={product.price * 100}
          shippingAddress
          billingAddress
        >
          <button className="btn.large blue">
            Buy React in just {product.price}
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
