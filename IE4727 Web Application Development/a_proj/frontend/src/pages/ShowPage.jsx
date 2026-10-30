import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { getShow } from '../services/theatreApi.js';
import './ShowPage.css';

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
  const currentResult = showResult?.showId === showId ? showResult : null;
  const show = currentResult?.show;
  const loadState = !currentResult ? 'loading' : currentResult.error ? 'error' : 'ready';
  const error = currentResult?.error || '';

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
        <div className="row g-4">
          <aside className="col-md-4 show-performance-details">
            <h2 className="h5">Performance details</h2>
            <p><strong>Dates</strong><br />{dateRange}</p>
            <p className="mb-0"><strong>Venue</strong><br />{show.venue}<br />Singapore</p>
          </aside>
          <section className="col-md-8">
            <p className="eyebrow">About the show</p>
            <h2>A story for the stage</h2>
            <p className="lead">{show.description}</p>
            <p>Run time: {show.runtime}</p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
