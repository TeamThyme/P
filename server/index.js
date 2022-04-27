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
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => res.status(500).send('Error in server route #1'));
});

// #2 - Products (Single)
app.get('/products/:pId', (req, res) => {
  const pId = req.params.pId - 37310;
  let product = [];
  pool
    .query(`SELECT * FROM "product info" WHERE "id" = ${pId}`)
    .then((result) => (product = result.rows))
    .catch((err) => res.status(500).send('Error in server route #2'));
  pool
    .query(`select feature, value from features where product_id = ${pId}`)
    .then((result) => {
      // product[0].features = result.rows;
      // product[0].id = Number(product[0].id) + 37310;
      res.status(200).send(product);
    })
    .catch((err) => console.error(err));
});

// #3 - Styles
app.get('/products/:pId/styles', (req, res) => {
  const pId = req.params.pId - 37310;
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
              WHERE product_id = ${pId}
          ) AS stylesObj
        ) AS results
        FROM product
        WHERE id = ${pId} + 37310`
    )
    .then((result) => {
      for (let i = 0; i < result.rows[0].results.length; i++) {
        result.rows[0].results[i].style_id += 220997;
        let skusResult =  result.rows[0].results[i]['skus']
        for (let sku in skusResult) {
          skusResult[String(Number(sku) + 1281031)] = skusResult[sku];
          delete skusResult[sku];
        }
      }
      res.status(200).send(result.rows);
    })
    .catch((err) => console.error(err));
});

// #4 - Related
app.get('/products/:pId/related', (req, res) => {
  const pId = req.params.pId - 37310;
  let related = [];
  pool
    .query(
      `SELECT "related_product_id" FROM related WHERE current_product_id = ${pId}`,
    )
    .then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        related.push(result.rows[i].related_product_id + 37310);
      }
      res.status(200).send(related);
    })
    .catch((err) => console.error(err));
});


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
