const express = require('express');
const cors = require('cors');
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'theatre',
  port: 3306,
});

app.use(cors()); // Allows frontend to safely communicate with backend
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,                // 587 for TLS, or 465 for SSL
    secure: false,
    auth: {
      user: 'charlee3279@gmail.com', 
      pass: 'tqxw djly cmfo yojb' 
    }
  })

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

async function sendMail(targetEmail, subject, htmlText) {
  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: process.env.THEATRE_MAIL_FROM || process.env.SMTP_USER,
    to: targetEmail,
    subject,
    html: htmlText,
  });
  return true;
}

// Featured List
app.get('/api/artwork', async(req, res) => {
  try {
    const [artwork] = await pool.query("SELECT title, image_type, image_path, show_id FROM artwork");
    res.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork: ", error)
    res.status(500).json({error: "Failed to fetch artwork"});
  }
});


app.get('/api/shows', async(req, res) => {
  try {
    const [shows] = await pool.query(`
      SELECT s.id, s.title, s.genre, a.image_path AS poster_image
      FROM shows s
      LEFT JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
    `);
    res.json(shows);
  } catch (error) {
    console.error("Error fetching shows: ", error);
    res.status(500).json({error: "Failed to fetch shows"});
  }
})

// Show Details
app.get('/api/shows/:showId', async (req, res) => {
  try {
    const [shows] = await pool.query(`
      SELECT s.id, s.title, s.genre, s.tagline, s.description, s.runtime, s.venue, a.image_path AS poster_image, 
        (SELECT DATE_FORMAT(MIN(p.performance_date), '%Y-%m-%d')
         FROM performances p WHERE p.show_id = s.id) AS season_start,
        (SELECT DATE_FORMAT(MAX(p.performance_date), '%Y-%m-%d')
         FROM performances p WHERE p.show_id = s.id) AS season_end
      FROM shows s
      JOIN artwork a ON s.id = a.show_id
      WHERE s.id = ?
    `, [req.params.showId]);

    if (shows.length === 0) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    return res.json(shows[0]);
  } catch (error) {
    console.error('Error fetching show:', error);
    return res.status(500).json({ error: 'Failed to fetch show.' });
  }
});

// Calendar
app.get('/api/performances', async (req, res) => {
  const { month, show_id: showId } = req.query;
  if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'A month in YYYY-MM format is required.' });
  }
  if (showId !== undefined && (typeof showId !== 'string' || showId.length > 80)) {
    return res.status(400).json({ error: 'The show filter is invalid.' });
  }

  const query = `
  SELECT p.id, p.show_id, DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS date,
    TIME_FORMAT(p.performance_time, '%H:%i') AS time, p.seats_available,
    s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
    a.image_path AS poster_image
  FROM performances p
  JOIN shows s ON s.id = p.show_id
  JOIN artwork a ON a.show_id = p.show_id AND a.image_type = 'poster'
  WHERE p.performance_date >= ? AND p.performance_date < DATE_ADD(?, INTERVAL 1 MONTH)
    ${showId ? 'AND p.show_id = ?' : ''}
  ORDER BY p.performance_date, p.performance_time, s.title`
  const params = [`${month}-01`, `${month}-01`];
  if (showId) params.push(showId);

  try {
    const [rows] = await pool.query(query, params)
    return res.json(rows);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({error: "Failed to fetch"})
  }
});

app.get('/api/performances/:performanceId', async(req, res) => {
  try {
    const [performances] = await pool.query(`
      SELECT p.id, p.show_id, DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS date,
        TIME_FORMAT(p.performance_time, '%H:%i') AS time, p.seats_available,
        s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
        a.image_path AS poster_image
      FROM performances p
      JOIN shows s ON s.id = p.show_id
      JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
      WHERE p.id = ? AND p.performance_date >= CURDATE()
    `, [req.params.performanceId]);

    if (performances.length === 0) {
      return res.status(404).json({ error: 'Upcoming performance not found.' });
    }

    return res.json(performances[0]);
  } catch (error) {
    console.error('Error fetching performance:', error);
    return res.status(500).json({ error: 'Failed to fetch performance.' });
  }
});

app.get('/api/ticket-types', async (req, res) => {
  try {
    const [ticketTypes] = await pool.query(
      'SELECT id, name, price FROM ticket_types ORDER BY price DESC',
    );
    return res.json(ticketTypes);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket types.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { name, email, phone, items } = req.body || {};
  const validPhone = typeof phone === 'string' && /^[0-9+ ()-]{7,25}$/.test(phone.trim());
  if (
    typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 150 ||
    typeof email !== 'string' || email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !validPhone ||
    !Array.isArray(items) || items.length < 1 || items.length > 30
  ) {
    return res.status(400).json({ error: 'Enter valid contact details and at least one ticket.' });
  }

  const normalizedItems = [];
  const seenItems = new Set();
  for (const item of items) {
    const performanceId = Number(item?.performanceId);
    const ticketTypeId = Number(item?.ticketTypeId);
    const quantity = Number(item?.quantity);
    const itemKey = `${performanceId}:${ticketTypeId}`;
    if (
      !Number.isSafeInteger(performanceId) || performanceId < 1 ||
      !Number.isSafeInteger(ticketTypeId) || ticketTypeId < 1 ||
      !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10 ||
      seenItems.has(itemKey)
    ) {
      return res.status(400).json({ error: 'A ticket selection is invalid.' });
    }
    seenItems.add(itemKey);
    normalizedItems.push({ performanceId, ticketTypeId, quantity });
  }
  normalizedItems.sort((left, right) => left.performanceId - right.performanceId
    || left.ticketTypeId - right.ticketTypeId);

  let connection;
  let transactionStarted = false;
  let orderId;
  let totalCents = 0;
  const reservedItems = [];
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;

    for (const item of normalizedItems) {
      const [rows] = await connection.execute(`
        SELECT p.id AS performance_id, p.show_id, p.performance_date,
          TIME_FORMAT(p.performance_time, '%H:%i') AS show_time,
          p.seats_available, s.title, s.venue,
          t.id AS ticket_type_id, t.name AS ticket_name, t.price
        FROM performances p
        JOIN shows s ON s.id = p.show_id
        JOIN ticket_types t ON t.id = ?
        WHERE p.id = ? AND p.performance_date >= CURDATE()
        FOR UPDATE
      `, [item.ticketTypeId, item.performanceId]);
      const row = rows[0];
      if (!row) {
        const error = new Error('One of the selected performances or ticket types is no longer available.');
        error.status = 409;
        throw error;
      }
      if (Number(row.seats_available) < item.quantity) {
        const error = new Error(`Not enough seats remain for ${row.title}.`);
        error.status = 409;
        throw error;
      }

      const priceCents = Math.round(Number(row.price) * 100);
      totalCents += priceCents * item.quantity;
      reservedItems.push({
        ...row,
        ...item,
        price: priceCents / 100,
      });
    }

    const customerName = name.trim();
    const customerEmail = email.trim();
    const customerPhone = phone.trim();
    const total = totalCents / 100;
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_name, customer_email, phone, total) VALUES (?, ?, ?, ?)',
      [customerName, customerEmail, customerPhone, total],
    );
    orderId = orderResult.insertId;

    for (const item of reservedItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, performance_id, ticket_type_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.performanceId, item.ticketTypeId, item.quantity, item.price],
      );
      const [updateResult] = await connection.execute(
        'UPDATE performances SET seats_available = seats_available - ? WHERE id = ? AND seats_available >= ?',
        [item.quantity, item.performanceId, item.quantity],
      );
      if (updateResult.affectedRows !== 1) {
        const error = new Error(`A performance sold out while reserving ${item.title}.`);
        error.status = 409;
        throw error;
      }
    }

    await connection.commit();
    transactionStarted = false;
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error rolling back order:', rollbackError);
      }
    }
    console.error('Error creating order:', error);
    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'Failed to save the reservation.',
    });
  } finally {
    if (connection) connection.release();
  }

  let emailSent = false;
  try {
    const ticketSummary = reservedItems.map((item) =>
      `<li>${escapeHtml(item.title)} — ${escapeHtml(item.ticket_name)} × ${item.quantity}: S$${(item.price * item.quantity).toFixed(2)}</li>`,
    ).join('');
    emailSent = await sendMail(
      email.trim(),
      `Theatre ticket reservation #${orderId}`,
      `<p>Hello ${escapeHtml(name.trim())},</p><p>Your reservation #${orderId} has been saved. Payment is not collected.</p><ul>${ticketSummary}</ul><p>Total: S$${(totalCents / 100).toFixed(2)}</p>`,
    );
  } catch (error) {
    console.error(`Ticket confirmation email failed for order #${orderId}:`, error);
  }

  return res.status(201).json({
    message: 'Your reservation was saved.',
    orderId,
    total: totalCents / 100,
    emailSent,
  });
});

// Contact Form
app.post('/contactForm', async(req, res) => {
  const { name, email, subject, message } = req.body || {};
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();
  try {
    await pool.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanSubject, cleanMessage],
    );
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ error: 'Failed to save your message.' });
  }
  let emailSent = false;
  try {
    emailSent = await sendMail(
      cleanEmail,
      'We received your message - Theatre',
      `<p>Hello ${escapeHtml(cleanName)},</p><p>We received your message and saved it. Our team will review it and get back to you if a reply is needed.</p><p>Your subject: ${escapeHtml(cleanSubject)}</p>`,
    );
  } catch (error) {
    console.error('Contact confirmation email failed:', error);
  }

  return res.status(201).json({
    message: 'Your message was saved.',
    emailSent,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));