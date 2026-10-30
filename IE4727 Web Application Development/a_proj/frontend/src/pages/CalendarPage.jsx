import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { getPerformances } from '../services/theatreApi.js';
import './CalendarPage.css';

const dateKey = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

const formatTime = (value) => {
  if (!value) return 'Time to be announced';
  const [hour, minute] = value.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function CalendarPage() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(() => {
    const requestedDate = searchParams.get('date');
    const parsed = requestedDate ? new Date(`${requestedDate}T12:00:00`) : new Date();
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [month, setMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const [performanceResult, setPerformanceResult] = useState(null);
  const activeShowId = searchParams.get('show');
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
  const requestKey = `${monthKey}:${activeShowId || ''}`;
  const currentResult = performanceResult?.key === requestKey ? performanceResult : null;
  const performances = currentResult?.performances || [];
  const loadState = !currentResult ? 'loading' : currentResult.error ? 'error' : 'ready';
  const error = currentResult?.error || '';

  useEffect(() => {
    let active = true;
    getPerformances({ month: monthKey, ...(activeShowId ? { show_id: activeShowId } : {}) })
      .then((items) => {
        if (!active) return;
        setPerformanceResult({ key: requestKey, performances: items });
      })
      .catch((requestError) => {
        if (!active) return;
        setPerformanceResult({ key: requestKey, error: requestError.message });
      });

    return () => {
      active = false;
    };
  }, [activeShowId, monthKey, requestKey]);

  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const count = new Date(year, monthIndex + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  }, [month]);

  const datePerformances = performances.filter((item) => item.date === dateKey(selected));

  const moveMonth = (amount) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(nextMonth);
    setSelected(nextMonth);
  };

  return (
    <PageLayout mainClassName="cal-page">
      <div className="cal-layout">
        <section className="cal-left" aria-label="Performance calendar">
          <div className="month-head">
            <button className="month-btn" type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>‹</button>
            <h1>{month.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })}</h1>
            <button className="month-btn" type="button" aria-label="Next month" onClick={() => moveMonth(1)}>›</button>
          </div>
          <div className="weekdays" aria-hidden="true">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="day-grid">
            {days.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const key = dateKey(date);
              const hasShows = performances.some((item) => item.date === key);
              const isSelected = key === dateKey(selected);
              const className = hasShows
                ? (isSelected ? 'selected-show' : 'has-show')
                : (isSelected ? 'selected' : 'day');

              return (
                <button
                  className={className}
                  key={key}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(date)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <p className="small dim"><span className="show-dot" /> Show dates</p>
        </section>
        <section className="cal-right" aria-live="polite">
          <p className="eyebrow">
            {selected.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          {loadState === 'loading' && <p role="status">Loading performances…</p>}
          {loadState === 'error' && <p className="text-danger" role="alert">Calendar unavailable: {error}</p>}
          {loadState === 'ready' && datePerformances.length === 0 && (
            <div className="calendar-empty">No performance is scheduled on this date. Choose a marked date to see its shows.</div>
          )}
          {loadState === 'ready' && datePerformances.map((performance) => (
            <article className={`date-card${performance.poster_image ? ' has-poster' : ''}`} key={performance.id}>
              {performance.poster_image && (
                <div className="date-art show-art">
                  <img src={performance.poster_image} alt={`${performance.title} poster`} loading="lazy" />
                </div>
              )}
              <div className="show-copy">
                <p className="eyebrow">{performance.genre} | {formatTime(performance.time)}</p>
                <h2>{performance.title}</h2>
                <p>{performance.description}</p>
                <p className="small text-secondary">Runtime: {performance.runtime}<br />
                Venue: {performance.venue}</p>
                <div className="button-row">
                  <Link className="btn outline" to={`/show/${encodeURIComponent(performance.show_id)}`}>More details</Link>
                  <Link className="btn btn-black" to={`/cart?performance=${encodeURIComponent(performance.id)}`}>Book now</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </PageLayout>
  );
}
