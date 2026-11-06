const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;
app.use(express.json());

// Change these values to match your MySQL Server.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ie4727_project'
});

async function getPerformances(filters) {
  let conditions = [];
  let values = [];

  if (filters.date) {
    conditions.push('p.performance_date = ?');
    values.push(filters.date);
  }
  if (filters.month) {
    conditions.push("DATE_FORMAT(p.performance_date, '%Y-%m') = ?");
    values.push(filters.month);
  }
  if (filters.show_id) {
    conditions.push('p.show_id = ?');
    values.push(filters.show_id);
  }
  if (filters.from) {
    conditions.push('p.performance_date >= ?');
    values.push(filters.from);
  }

  let where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const sql = `
    SELECT p.id, p.show_id,
      DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS date,
      TIME_FORMAT(p.performance_time, '%H:%i') AS time,
      s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
      a.image_path AS poster_image
    FROM performances p
    JOIN shows s ON s.id = p.show_id
    JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
    ${where}
    ORDER BY p.performance_date, p.performance_time, s.title
  `;
  const [rows] = await pool.query(sql, values);
  return rows;
}

async function getShow(showId) {
  const [rows] = await pool.query(`
    SELECT s.*, a.image_path AS poster_image,
      (SELECT DATE_FORMAT(MIN(p.performance_date), '%Y-%m-%d')
       FROM performances p WHERE p.show_id = s.id) AS season_start,
      (SELECT DATE_FORMAT(MAX(p.performance_date), '%Y-%m-%d')
       FROM performances p WHERE p.show_id = s.id) AS season_end
    FROM shows s
    JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
    WHERE s.id = ?
  `, [showId]);

  if (!rows.length) return null;
  rows[0].performances = await getPerformances({ show_id: showId });
  return rows[0];
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';

  if (!cleanName || cleanName.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254 ||
      !cleanMessage || cleanMessage.length > 5000) {
    return res.status(400).json({ error: 'Enter a valid name, email and message.' });
  }

  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [cleanName, cleanEmail, cleanMessage]
    );
    res.status(201).json({ message: 'Your message has been sent.' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not save your message. Please try again.' });
  }
});

app.get('/api/shows', async (req, res) => {
  try {
    const [shows] = await pool.query(`
      SELECT DISTINCT s.id, s.title
      FROM shows s
      JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
      ORDER BY s.title
    `);
    let result = [];
    for (const show of shows) {
      result.push(await getShow(show.id));
    }
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not load shows. Check the MySQL connection and sql/schema.sql.' });
  }
});

app.get('/api/shows/:id', async (req, res) => {
  try {
    const show = await getShow(req.params.id);
    if (!show) return res.status(404).json({ error: 'Show not found.' });
    res.json(show);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not load show details. Check the MySQL connection and sql/schema.sql.' });
  }
});

app.get('/api/artwork', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT title, image_path, image_type, show_id FROM artwork ORDER BY image_type, title'
    );
    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not load theatre artwork.' });
  }
});

app.get('/api/performances', async (req, res) => {
  try {
    res.json(await getPerformances(req.query));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not load performances. Check the MySQL connection and sql/schema.sql.' });
  }
});

app.get('/api/performances/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.show_id,
        DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS date,
        TIME_FORMAT(p.performance_time, '%H:%i') AS time,
        s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
        a.image_path AS poster_image
      FROM performances p
      JOIN shows s ON s.id = p.show_id
      JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
      WHERE p.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Performance not found.' });
    res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not load performance. Check the MySQL connection and sql/schema.sql.' });
  }
});

const projectRoot = path.join(__dirname, '..');
const htmlFolder = path.join(projectRoot, 'html');

app.use('/css', express.static(path.join(projectRoot, 'css')));
app.use('/images', express.static(path.join(projectRoot, 'images')));
app.get('/js/script.js', (req, res) => res.sendFile(path.join(__dirname, 'script.js')));
app.use(express.static(htmlFolder));

async function startServer() {
  try {
    await pool.query('SELECT 1');
    app.listen(port, () => {
      console.log('Theatre site running at http://localhost:' + port);
    });
  } catch (error) {
    console.log('Could not connect to MySQL:', error.message);
    console.log('Check the connection settings in js/server.js and run sql/schema.sql.');
  }
}

startServer();
