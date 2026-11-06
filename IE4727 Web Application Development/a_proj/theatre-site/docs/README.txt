THEATRE SITE (NODE.JS, EXPRESS AND MYSQL)

This project uses Express routes, fetch/JSON, a mysql2/promise connection pool,
and MySQL SELECT queries. The pages use the Bootstrap layout.

SETUP

1. Install Node.js and MySQL Server.
2. Open sql/schema.sql in MySQL Workbench and run it when you want a fresh
   theatre database. It deletes and recreates the theatre database, then adds
   the tables, sample shows, poster links and performance dates.
3. Open a terminal in this folder and install the packages:
   npm.cmd install
4. Edit the MySQL host, username and password near the top of js/server.js.
5. Start the website:
   npm.cmd start
6. Open http://localhost:3000

SHOW AND CALENDAR DATA

The show cards, detail popup, show page and calendar read their show and
performance data from MySQL. Every sample show with a poster has at least two
different performance dates, scheduled across different weekdays. The
performances table stores a date and time for each show; it does not restrict
which day of the week a show can run.

The cart page uses the selected show and date, and the View Cart button opens a
popup with the tickets added. Cart selections are saved in the browser.
Ticket types and sample prices are in js/script.js. The site does not process
payments.

CONTACT MESSAGES

The Contact Us form sends its entries to the Express server, which saves them
in the MySQL contact_messages table. Start the site with npm.cmd start and make
sure MySQL is running before submitting the form.

For a new setup, sql/schema.sql creates this table with the rest of the sample
database. If you already have the theatre database and want to keep its current
show and calendar data, run sql/create_contact_messages.sql once instead.
Running sql/schema.sql again deletes and recreates the theatre database, so it
also deletes saved contact messages.

To view messages in MySQL Workbench, run:

SELECT id, name, email, message, submitted_at
FROM theatre.contact_messages
ORDER BY submitted_at DESC;

IMAGE FILES

Theatre map: images/theatre-map.jpg. Show posters are in images/posters and
banners are in images/banners. MySQL stores poster and banner paths, not the JPG
bytes. Express serves the files from the images folder.

PROJECT FOLDERS

html/        Website pages
css/         Stylesheet
js/          Browser script and Node.js server
sql/         MySQL database setup
images/      Posters, banners and SVG illustrations
docs/        Project instructions
package.json Node.js project settings (keep this in the project root)

