// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');  // MySQL connection from db.js

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(express.json());

// serve all HTML/CSS/JS files from this folder
// (put admin.html and lpg-id.html in the SAME folder as server.js)
app.use(express.static(path.join(__dirname)));

/*
  ROUTE 1: Create / Update consumer
  Called from admin.html with:
  fetch('/api/consumers/create', {...})
*/
app.post('/api/consumers/create', (req, res) => {
  const { consumerId, mobile, customerName, distributorName, lpgId } = req.body;

  if (!consumerId || !mobile || !customerName || !distributorName || !lpgId) {
    return res.json({ success: false, message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO customers (consumer_id, mobile, customer_name, distributor_name, lpg_id)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      customer_name = VALUES(customer_name),
      distributor_name = VALUES(distributor_name),
      lpg_id = VALUES(lpg_id)
  `;

  db.query(
    sql,
    [consumerId, mobile, customerName, distributorName, lpgId],
    (err, result) => {
      if (err) {
        console.error('DB error (create):', err);
        return res.json({ success: false, message: 'Database error while saving.' });
      }
      return res.json({ success: true, message: 'Consumer saved successfully.' });
    }
  );
});

/*
  ROUTE 2: Retrieve consumer details by Consumer ID + Mobile
  Called from lpg-id.html with:
  fetch('/api/consumers/retrieve', {...})
*/
app.post('/api/consumers/retrieve', (req, res) => {
  const { consumerId, mobile } = req.body;

  if (!consumerId || !mobile) {
    return res.json({ success: false, message: 'Consumer ID and Mobile are required.' });
  }

  const sql = `
    SELECT consumer_id, mobile, customer_name, distributor_name, lpg_id
    FROM customers
    WHERE consumer_id = ? AND mobile = ?
    LIMIT 1
  `;

  db.query(sql, [consumerId, mobile], (err, results) => {
    if (err) {
      console.error('DB error (retrieve):', err);
      return res.json({ success: false, message: 'Database error while retrieving.' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'No record found for given details.' });
    }

    return res.json({
      success: true,
      consumer: results[0]
    });
  });
});

/*
  ROUTE 3: Search distributors by pincode / city / area
  (for your search-distributor.html)
*/
app.post('/api/distributors/search', (req, res) => {
  const { pincode, city, area } = req.body;

  let sql = `
    SELECT id, distributor_name, contact_person, phone, alt_phone,
           email, address_line, area, city, pincode, timings
    FROM distributors
  `;
  const conditions = [];
  const params = [];

  if (pincode && pincode.trim() !== '') {
    conditions.push('pincode = ?');
    params.push(pincode.trim());
  }
  if (city && city.trim() !== '') {
    conditions.push('city LIKE ?');
    params.push('%' + city.trim() + '%');
  }
  if (area && area.trim() !== '') {
    conditions.push('area LIKE ?');
    params.push('%' + area.trim() + '%');
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('DB error (distributor search):', err);
      return res.json({
        success: false,
        message: 'Database error while searching distributors.'
      });
    }

    if (results.length === 0) {
      return res.json({
        success: false,
        message: 'No distributors found for given location.'
      });
    }

    return res.json({
      success: true,
      distributors: results
    });
  });
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔗 Open http://localhost:${PORT}/admin.html or /lpg-id.html`);
});
