import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { getPerformance, getPerformances, getShows } from '../services/theatreApi.js';
import './CalendarPage.css';
import './CartPage.css';

// TODO: Replace these example ticket prices with prices supplied by the backend.
const ticketTypes = [
  { name: 'Diamond with Pre-Show Lounge Access', price: 240 },
  { name: 'Sparkling VIP', price: 200 },
  { name: 'A Reserve', price: 180 },
  { name: 'B Reserve', price: 150 },
  { name: 'C Reserve', price: 120 },
  { name: 'D Reserve', price: 90 },
  { name: 'Grand Circle Box (4 seats)', price: 600, unit: 'box' },
];

const dateKey = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatTime = (value) => {
  if (!value) return 'Time to be announced';
  const [hour, minute] = value.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' });
};

const formatMoney = (amount) => new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
}).format(amount);

function readSavedCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('theatreCart') || '[]');
    if (!Array.isArray(stored)) throw new Error('Saved cart data is not a list.');
    return { items: stored, error: '' };
  } catch (error) {
    return { items: [], error: `Saved cart could not be read: ${error.message}` };
  }
}

export default function CartPage() {
  const [searchParams] = useSearchParams();
  const requestedShow = searchParams.get('show') || '';
  const requestedPerformance = searchParams.get('performance');
  const [shows, setShows] = useState([]);
  const [activeShowId, setActiveShowId] = useState(requestedShow);
  const [selected, setSelected] = useState(() => new Date());
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showsState, setShowsState] = useState('loading');
  const [showsError, setShowsError] = useState('');
  const [performanceResult, setPerformanceResult] = useState(null);
  const [cartSnapshot, setCartSnapshot] = useState(readSavedCart);
  const cart = cartSnapshot.items;
  const cartError = cartSnapshot.error;
  const [cartOpen, setCartOpen] = useState(false);
  const [focusPerformance, setFocusPerformance] = useState(null);
  const [focusedPerformanceError, setFocusedPerformanceError] = useState('');
  const activeMonthKey = monthKey(month);
  const performanceRequestKey = `${activeMonthKey}:${activeShowId}`;
  const currentPerformanceResult = performanceResult?.key === performanceRequestKey
    ? performanceResult
    : null;
  const performances = currentPerformanceResult?.items || [];
  const performancesState = !currentPerformanceResult
    ? 'loading'
    : currentPerformanceResult.error ? 'error' : 'ready';
  const performancesError = currentPerformanceResult?.error || '';

  useEffect(() => {
    let active = true;
    getShows()
      .then((items) => {
        if (!active) return;
        setShows(items);
        setShowsState('ready');
        if (!requestedShow && !requestedPerformance && items.length) setActiveShowId(items[0].id);
      })
      .catch((error) => {
        if (!active) return;
        setShowsError(error.message);
        setShowsState('error');
      });

    return () => {
      active = false;
    };
  }, [requestedShow, requestedPerformance]);

  useEffect(() => {
    let active = true;
    getPerformances({ month: activeMonthKey, ...(activeShowId ? { show_id: activeShowId } : {}) })
      .then((items) => {
        if (!active) return;
        setPerformanceResult({ key: performanceRequestKey, items });
      })
      .catch((error) => {
        if (!active) return;
        setPerformanceResult({ key: performanceRequestKey, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [activeShowId, activeMonthKey, performanceRequestKey]);

  useEffect(() => {
    if (!requestedPerformance) return undefined;
    let active = true;
    getPerformance(requestedPerformance)
      .then((performance) => {
        if (!active) return;
        setFocusPerformance(performance);
        setSelected(new Date(`${performance.date}T12:00:00`));
        setMonth(new Date(`${performance.date}T12:00:00`));
        setActiveShowId(performance.show_id);
      })
      .catch((error) => {
        if (active) setFocusedPerformanceError(error.message);
      });
    return () => {
      active = false;
    };
  }, [requestedPerformance]);

  function saveCart(items) {
    try {
      localStorage.setItem('theatreCart', JSON.stringify(items));
      setCartSnapshot({ items, error: '' });
    } catch (error) {
      setCartSnapshot({ items, error: `Cart changes could not be saved: ${error.message}` });
    }
  }

  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const count = new Date(year, monthIndex + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  }, [month]);

  const selectedShow = shows.find((show) => String(show.id) === String(activeShowId));
  const selectedPerformance = performances.find(
    (performance) => performance.date === dateKey(selected)
      && String(performance.show_id) === String(activeShowId)
      && (!focusPerformance || String(performance.id) === String(focusPerformance.id)),
  );
  const upcomingPerformances = performances.filter(
    (performance) => performance.date === dateKey(selected)
      && String(performance.show_id) === String(activeShowId),
  );
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addTicket(performance, ticket) {
    const existing = cart.find((item) => item.performanceId === performance.id && item.ticketType === ticket.name);
    const updated = existing
      ? cart.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, {
        performanceId: performance.id,
        showId: performance.show_id,
        title: performance.title,
        date: performance.date,
        time: performance.time,
        venue: performance.venue,
        ticketType: ticket.name,
        unit: ticket.unit || 'ticket',
        price: ticket.price,
        quantity: 1,
      }];
    saveCart(updated);
  }

  function moveMonth(amount) {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(nextMonth);
    setSelected(nextMonth);
    setFocusPerformance(null);
  }

  return (
    <PageLayout mainClassName="checkout">
      <section className="show-picker">
        <h2>Shows</h2>
        {showsState === 'ready' && shows.length === 0 && <p>No shows are available yet.</p>}
        <div className="show-grid">
          {shows.map((show) => (
            <button
              className={`show-button${String(show.id) === String(activeShowId) ? ' active' : ''}`}
              key={show.id}
              type="button"
              onClick={() => {
                setActiveShowId(show.id);
                setFocusPerformance(null);
              }}
            >
              <strong>{show.title}</strong>
              <p className="mb-0 mt-2">{show.genre}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="cal-layout checkout-layout">
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
              const hasShows = performances.some(
                (item) => item.date === key && String(item.show_id) === String(activeShowId),
              );
              const isSelected = key === dateKey(selected);
              const className = hasShows
                ? (isSelected ? 'selected-show' : 'has-show')
                : (isSelected ? 'selected' : 'day');
              return (
                <button className={className} key={key} type="button" onClick={() => {
                  setSelected(date);
                  setFocusPerformance(null);
                }}>
                  {day}
                </button>
              );
            })}
          </div>
          <p className="small dim"><span className="show-dot" /> Show dates</p>
        </section>

        <section className="cal-right">
          <div className="checkout-head">
            <div>
              <p className="eyebrow mb-1">{selected.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h1 className="mb-0">{selectedShow?.title || 'Choose a show'}</h1>
            </div>
            <button className="btn btn-black" type="button" onClick={() => setCartOpen(true)}>
              View Cart ({cartCount})
            </button>
          </div>
          {showsState === 'loading' && <p role="status">Loading shows…</p>}
          {showsState === 'error' && <p className="text-danger" role="alert">Shows are unavailable: {showsError}</p>}
          {performancesState === 'loading' && <p role="status">Loading performances…</p>}
          {performancesState === 'error' && <p className="text-danger" role="alert">Performances are unavailable: {performancesError}</p>}
          {focusedPerformanceError && <p className="text-danger" role="alert">Requested performance is unavailable: {focusedPerformanceError}</p>}
          {performancesState === 'ready' && upcomingPerformances.length === 0 && (
            <div className="calendar-empty">No performance for this show on this date. Choose a marked date or another show.</div>
          )}
          {performancesState === 'ready' && selectedPerformance && (
            <section className="ticket">
              <p className="performance">
                {selectedPerformance.date} · {formatTime(selectedPerformance.time)} · {selectedPerformance.venue}
              </p>
              <p className="small note">Example ticket prices. Add a ticket to save it in your cart.</p>
              <div className="ticket-list">
                {ticketTypes.map((ticket) => (
                  <div className="ticket-option" key={ticket.name}>
                    <div className="option-details">
                      <strong>{ticket.name}</strong>
                      <span>{formatMoney(ticket.price)}{ticket.unit === 'box' ? ' per box' : ' each'}</span>
                    </div>
                    <button className="btn outline" type="button" onClick={() => addTicket(selectedPerformance, ticket)}>Add to Cart</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>

      {cartOpen && (
        <div className="cart-overlay" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}>
          <section className="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <header className="cart-dialog-header">
              <h2 id="cart-title">Your Cart</h2>
              <button className="btn-close" type="button" aria-label="Close cart" onClick={() => setCartOpen(false)} />
            </header>
            {cartError && <p className="text-danger" role="alert">{cartError}</p>}
            {cart.length === 0 ? (
              <p>Your cart is empty. Add tickets to see them here.</p>
            ) : (
              <div className="cart-list">
                {cart.map((item, index) => (
                  <article className="cart-item" key={`${item.performanceId}-${item.ticketType}`}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.date} · {formatTime(item.time)}</p>
                      <p>{item.ticketType} · {formatMoney(item.price)}{item.unit === 'box' ? ' per box' : ' each'}</p>
                    </div>
                    <div className="cart-controls">
                      <span>{item.quantity} ×</span>
                      <strong>{formatMoney(item.price * item.quantity)}</strong>
                      <button className="btn outline" type="button" onClick={() => saveCart(cart.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <br />
            <p className="cart-total mb-0">Total: <strong>{formatMoney(cartTotal)}</strong></p>
            <footer className="cart-dialog-footer">
              <div className="cart-cta">
                <Link className="btn btn-outline-dark" to="/calendar">View Showtimes</Link>
                <button className="btn btn-outline-dark" type="button" onClick={() => saveCart([])} disabled={cart.length === 0 && !cartError}>Clear Cart</button>
              </div>
              <Link className="btn btn-black" to="/calendar">Checkout</Link>
            </footer>
          </section>
        </div>
      )}
    </PageLayout>
  );
}
