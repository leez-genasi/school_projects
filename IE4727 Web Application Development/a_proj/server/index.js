const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const { Connection } = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ie4727_project',
  port: 3306,
});

app.use(cors()); // Allows frontend to safely communicate with backend
app.use(express.json());

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
    const [shows] = await pool.query("SELECT id, title, genre FROM shows");
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
  const month = req.query.month + "-01"

  const query = `
  SELECT p.id, p.show_id, s.title, s.genre, DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS date, p.performance_time AS time, s.description, s.runtime, s.venue, a.image_path AS poster_image, s.genre
  FROM performances p
  JOIN shows s ON s.id = p.show_id
  JOIN artwork a ON a.show_id = p.show_id AND a.image_type = 'poster'
  WHERE performance_date >= "${month}" AND performance_date < DATE_ADD("${month}", INTERVAL 1 MONTH)
  ORDER BY p.performance_date, p.performance_time, s.title`

  try {
    const [rows] = await pool.query(query)
    return res.json(rows);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({error: "Failed to fetch"})
  }
});

app.get('/api/performance/:showId', async(req, res) => {
  console.log(req.params);
  try {
    const [shows] = await pool.query(`
      SELECT *
      FROM performances
      WHERE show_id = ?
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

// DB Connection template
// app.get('/songs', async (req, res) => {
//   try {
//     const [rows] = await connection.query('SELECT * FROM songs');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching songs:', error);
//     res.status(500).json({ error: 'Failed to fetch songs' });
//   }
// });

// Contact Form
app.post('/contactForm', async(req, res) => {
  const { name, targetEmail, body } = req.body;
  const htmlText = `<p>Hello ${name},</p><p>We have receieved your message.<p><br><br><p><b>Message: </b>${body}<p>`
  const subject = "Theatre: We have receieved your message"
  console.log(targetEmail.trim())
  console.log(name.trim())
  console.log(htmlText)

  try {
    const info = await sendMail(targetEmail.trim(), subject, htmlText)

    return res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Email API Error: ", error);
    return res.status(500).json({error: "Failed to send email"});
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Nodemailer Config
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,                // 587 for TLS, or 465 for SSL
  secure: false,
  auth: {
    user: 'charlee3279@gmail.com', 
    pass: 'tqxw djly cmfo yojb' 
  }
});

async function sendMail(targetEmail, subject, htmlText) {
  const mailOptions = {
    from: `"Charlette" <charlee3279@gmail.com>`,
    to: targetEmail,
    subject: subject,
    html: htmlText
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};