const cors = require('cors');
const dotenv = require('dotenv')
const express = require('express');
// const uuid = require('uuid').v5;
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({ path: './config.env' }); //dont forget to create config.env file in your root directory

//routes
app.get('/', (req, res) => {
  res.send('Just for testing I am sending this to the client side.');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('PRODUCT: ', product);
  console.log('PRODUCT PRICE: ', product.price);
  const idempotencyKey = uuidv4(); //prevent user to get chagred twice for the same product

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      // have access to the customer object
      return stripe.charges
        .create(
          {
            amount: product.price * 100, // *100 to convert it into dollar from cents
            currency: 'usd',
            customer: customer.id, // set the customer id
            description: `Purchase of ${product.name}`,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          {
            idempotencyKey,
          }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log('ERROR: ', err);
        });
    });
});

//listening
app.listen(8282, () => console.log('Listening at port 8282'));
