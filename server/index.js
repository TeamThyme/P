const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3005;
const db = require('../db');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/products/:product_id', (req, res) => {

});
// 2. Product Information - Returns all product level information for a specified product id
//     `GET /products/:product_id`
//     Parameters
//     - product_id - integer - required ID of the product requested
//     Response: `Status: 200 OK`

app.get('/products/:product_id/related', (req, res) => {

});
// 4. Related Products - Returns the ids of products related to the product specified
//     `GET /products/:product_id/related`
//     Parameters:
//     - product_id - integer - required ID of the product requested
//     Response: `Status: 200 OK`

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
