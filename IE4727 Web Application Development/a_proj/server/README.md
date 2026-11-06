# Theatre API

Run the API from this directory with `npm start`. It listens on port 3000 by default.

The API connects to the local MySQL `theatre` database and expects the tables in
the project's theatre schema, including `performances.seats_available`,
`ticket_types`, `orders`, `order_items`, and `contact_messages`. The legacy
schema file at `../theatre-black-white-site/sql/schema.sql` starts by dropping
and recreating the database; do not import it over a database containing data.

The frontend uses the Vite development proxy for `/api` and `/contactForm`,
targeting `127.0.0.1:3000` explicitly to avoid other local servers bound to
`localhost:3000`.
Available booking endpoints are `GET /api/ticket-types` and
`POST /api/orders`. Contact messages are saved through `POST /contactForm`.

Confirmation emails are optional. Set `SMTP_USER` and `SMTP_PASS` to enable
mail, and optionally set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, and
`THEATRE_MAIL_FROM`. Keep these values in the process environment; do not add
credentials to source files.
