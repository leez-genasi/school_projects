# Implementation checklist
- [ ] for empty
- [X] for done and need to verified
- [0] for verified and working

## Backend and MySQL

- [O] Configure the backend to connect to the `theatre` MySQL database using environment-based credentials and a reusable connection pool.
- [O] Apply and verify the database schema and seed data in `theatre-site/sql/schema.sql`.
- [O] Add `GET /api/artwork` for featured poster records. Return `title`, `image_type`, `image_path`, and `show_id`.
- [O] Add `GET /api/shows` for the show selector. Return each show's `id`, `title`, and `genre`.
- [ ] Add `GET /api/shows/:showId` for show details. Return show text, venue, runtime, season dates, and any performance summary needed by the UI.
- [O] Add `GET /api/performances` with optional `month`, `show_id`, and `from` filters. Return `id`, `show_id`, date, time, venue, show title, genre, description, runtime, and poster image where available.
- [ ] Add `GET /api/performances/:performanceId` so a calendar booking link can select a specific performance.
- [O] Add `POST /api/contact`
    - [O] Validate contact form submissions
- [ ] Return consistent JSON error responses and appropriate HTTP status codes from all API endpoints.
- [ ] Configure and verify the frontend `/api` development proxy against the running backend.

## Ticket prices and cart

- [ ] Replace the example ticket prices in `src/pages/CartPage.jsx` with prices supplied by the backend.
- [ ] Decide whether carts remain browser-local or are saved to a customer/session on the backend.
- [ ] Implement an order/checkout endpoint and server-side price and availability validation before accepting a purchase.
- [ ] Add clear success and failure states for checkout once the purchase flow is defined.

## Frontend integration and verification

- [ ] Verify that the Home page loads the featured artwork returned by `/api/artwork`.
- [ ] Verify that Calendar filters and displays performances for each month, date, and selected show.
- [ ] Fix and verify show ID mapping across show links, URL parameters, and API responses; ensure URLs use the database show ID rather than an array index or performance ID.
- [ ] Verify that `#/show/:showId` loads the correct show, including when opened directly or refreshed.
- [ ] Verify that Cart handles a requested `performance` query, ticket selection, saved-cart errors, and updated backend prices.
- [ ] Verify contact form validation, submission, and error handling against the backend.
- [ ] Add or update tests for the API client, page loading/error states, routes, and cart behavior.
- [ ] Check responsive layouts, hash links to page sections, and the shared navbar/footer across all routes.
