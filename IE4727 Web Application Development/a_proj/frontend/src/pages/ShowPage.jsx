import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { getShow, getTicketTypes } from '../services/theatreApi.js';
import './ShowPage.css';

function formatMoney(value) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(Number(value));
}

function formatDate(value, includeYear = false) {
  if (!value) return 'Dates to be announced';
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(new Date(`${value}T12:00:00`));
}

export default function ShowPage() {
  const { showId } = useParams();
  const [showResult, setShowResult] = useState(null);
  const [ticketTypesResult, setTicketTypesResult] = useState(null);
  const currentResult = showResult?.showId === showId ? showResult : null;
  const show = currentResult?.show;
  const loadState = !currentResult ? 'loading' : currentResult.error ? 'error' : 'ready';
  const error = currentResult?.error || '';
  const currentTicketTypesResult = ticketTypesResult?.showId === showId ? ticketTypesResult : null;

  useEffect(() => {
    let active = true;
    getShow(showId)
      .then((result) => {
        if (!active) return;
        setShowResult({ showId, show: result });
        document.title = `${result.title} | Theatre`;
      })
      .catch((requestError) => {
        if (!active) return;
        setShowResult({ showId, error: requestError.message });
      });

    getTicketTypes()
      .then((items) => {
        if (!Array.isArray(items)) {
          throw new Error('The server returned an invalid ticket list.');
        }
        if (active) setTicketTypesResult({ showId, items });
      })
      .catch((requestError) => {
        if (active) setTicketTypesResult({ showId, error: requestError.message });
      });

    return () => {
      active = false;
    };
  }, [showId]);

  if (loadState === 'loading') {
    return <PageLayout><p className="container py-5" role="status">Loading show details…</p></PageLayout>;
  }

  if (loadState === 'error') {
    return <PageLayout><p className="container py-5 text-danger" role="alert">Show details are unavailable: {error}</p></PageLayout>;
  }

  const dateRange = show.season_start
    ? `${formatDate(show.season_start)} – ${formatDate(show.season_end, true)}`
    : 'Dates to be announced';

  return (
    <PageLayout>
      <header className="show-hero text-center">
        <div className="container py-5">
          <p className="eyebrow">{show.genre || 'Live performance'}</p>
          <h1>{show.title}</h1>
          <p className="lead">{show.tagline}</p>
          <div className="button-row">
            <Link className="btn btn-light" to={`/calendar?show=${encodeURIComponent(showId)}`}>View Showtimes</Link>
            <Link className="btn btn-outline-light" to={`/cart?show=${encodeURIComponent(showId)}`}>Book Now</Link>
          </div>
        </div>
      </header>
      <div className="container py-5">
        <div className="main-container">
          <aside className="show-production-details">
            <p className="eyebrow">Production Details</p>
            <p><strong>Genre</strong><br />{showResult.show.genre}</p>
            <p><strong>Runtime</strong><br />{showResult.show.runtime}</p>
            <p className="mb-0"><strong>Venue</strong><br />{show.venue}<br />Singapore</p>
          </aside>
          <div className="vert-divider" aria-hidden="true" />
          <section className="show-description">
            <p className="eyebrow">About the show</p>
            <h2>" {showResult.show.tagline}</h2>
            <p className="lead">{show.description}</p>
          </section>
        </div>
        <div className="hor-divider" />
        <section className="show-details">
          <section className="show-performance-details">
            <h2 className="h5">Performance details</h2>
            <p><strong>Dates</strong><br />{dateRange}</p>
            <p><strong>Terms</strong><br />Tickets are subject to availability. Please arrive 30 minutes before the performance</p>
          </section>
          <section className="show-performance-tickets">
            <h2 className="h5">Ticket prices</h2>
            {!currentTicketTypesResult && <p role="status">Loading ticket types…</p>}
            {currentTicketTypesResult?.error && (
              <p className="text-danger" role="alert">
                Ticket prices are unavailable: {currentTicketTypesResult.error}
              </p>
            )}
            {currentTicketTypesResult?.items?.length === 0 && (
              <p>No ticket types are available at this time.</p>
            )}
            {currentTicketTypesResult?.items?.length > 0 && (
              <>
                <p className="ticket-prices-note">
                  Prices shown are per ticket. Availability may vary by performance.
                </p>
                <table className="ticket-prices"><tbody>
                  {currentTicketTypesResult.items.map((ticket) => (
                    <tr className="ticket-price" key={ticket.id}>
                      <td>{ticket.name}</td>
                      <td><strong>{formatMoney(ticket.price)}</strong></td>
                    </tr>
                  ))}
                </tbody></table>
              </>
            )}
          </section>
        </section>
      </div>
    </PageLayout>
  );
}
