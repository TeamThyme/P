const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const { pool } = require('../db');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes //
// #1 - Products (All) - UNUSED
app.get('/products', (req, res) => {
  pool
    .query('SELECT * FROM "product info" LIMIT 5')
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send('Error in server route #1'));
});

// #2 - Products (Single)
app.get('/products/:pId', (req, res) => {
  return pool
    .query(
      `SELECT
        product.id,
        product.name,
        product.slogan,
        product.description,
        product.category,
        product.default_price,
        (
          SELECT json_agg(featuresObj)
          FROM (
            SELECT
              features.feature,
              features.value
            FROM features
            WHERE features.product_id = $1
          ) AS featuresObj
        ) AS features
        FROM product
        WHERE id = $1`
    , [req.params.pId])
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => console.error(err));
});

// #3 - Styles
app.get('/products/:pId/styles', (req, res) => {
  return pool
    .query(
      `SELECT
        product.id AS product_id,
        (
          SELECT json_agg(stylesObj)
          FROM (
            SELECT
              styles.id AS style_id,
              styles.name,
              styles.original_price,
              styles.sale_price,
              styles.default_style AS "default?",
              (
                SELECT json_agg(photosObj)
                FROM (
                  SELECT thumbnail_url, url
                  FROM photos
                  WHERE photos.style_id = styles.id
                ) AS photosObj
              ) AS photos, (
                SELECT json_object_agg (
                  skus.id,
                  json_build_object('quantity', skus.quantity, 'size', skus.size)
                ) AS skus
                FROM skus
                WHERE skus.style_id = styles.id
              ) AS skus
              FROM styles
              WHERE product_id = $1
          ) AS stylesObj
        ) AS results
        FROM product
        WHERE id = $1`
    , [req.params.pId])
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => console.error(err));
});

// #4 - Related
app.get('/products/:pId/related', (req, res) => {
  pool
    .query(`SELECT "related_product_id" FROM related WHERE current_product_id = $1`
    , [request.params.pId])
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => console.error(err));
});


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
