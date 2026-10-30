import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { getArtwork } from '../services/theatreApi.js';
import './HomePage.css';

const featuredTitles = ['Moulin Rouge', 'Hamilton', 'Hadestown', 'Six'];

const banners = [
  { src: '/images/banners/hamilton.jpg', alt: 'Hamilton' },
  { src: '/images/banners/hadestown.jpg', alt: 'Hadestown' },
  { src: '/images/banners/greatest-showman.jpg', alt: 'The Greatest Showman' },
];

export default function HomePage() {
  const [artwork, setArtwork] = useState([]);
  const [artworkState, setArtworkState] = useState('loading');
  const [artworkError, setArtworkError] = useState('');

  useEffect(() => {
    let active = true;
    getArtwork()
      .then((items) => {
        if (!active) return;
        setArtwork(items.filter((item) => item.image_type === 'poster'));
        setArtworkState('ready');
      })
      .catch((error) => {
        if (!active) return;
        setArtworkError(error.message);
        setArtworkState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const featured = featuredTitles
    .map((title) => artwork.find((item) => item.title === title))
    .filter(Boolean);

  return (
    <PageLayout>
      <section className="container-fluid px-0">
        <div id="showCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {banners.map((banner, index) => (
              <button
                key={banner.src}
                type="button"
                data-bs-target="#showCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner">
            {banners.map((banner, index) => (
              <div className={`carousel-item${index === 0 ? ' active' : ''}`} key={banner.src}>
                <img className="banner" src={banner.src} alt={banner.alt} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#showCarousel" data-bs-slide="prev" aria-label="Previous banner">
            <span className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#showCarousel" data-bs-slide="next" aria-label="Next banner">
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </section>

      <section className="container featured-section">
        <h1 className="text-center mb-3">Featured Shows</h1>
        {artworkState === 'loading' && <p role="status">Loading featured shows…</p>}
        {artworkState === 'error' && <p className="text-danger" role="alert">Featured shows are unavailable: {artworkError}</p>}
        {artworkState === 'ready' && featured.length === 0 && (
          <p className="empty-state">No featured shows are available yet.</p>
        )}
        {featured.length > 0 && (
          <div className="poster-grid">
            {featured.map((poster) => (
              <article className="show-card poster-card" key={poster.show_id || poster.title}>
                {poster.show_id ? (
                  <Link className="poster-link" to={`/show/${encodeURIComponent(poster.show_id)}`}>
                    <div className="show-art">
                      <img src={poster.image_path} alt={`${poster.title} poster`} loading="lazy" />
                    </div>
                    <div className="poster-info"><h2>{poster.title}</h2></div>
                  </Link>
                ) : (
                  <div className="poster-link poster-display">
                    <div className="show-art">
                      <img src={poster.image_path} alt={`${poster.title} poster`} loading="lazy" />
                    </div>
                    <div className="poster-info"><h2>{poster.title}</h2></div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
        <div className="text-center mt-2">
          <Link className="btn outline" to="/calendar">See More</Link>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-grid">
          <article className="text-center">
            <Link className="feature-link" to="/behind-the-curtain">
              <h2>About Theatre</h2>
              <img src="/images/theatre.svg" alt="" />
              <div className="feature-copy">
                <p>Meet the artists, makers and stage crew who bring each live performance to life.</p>
                <span className="btn outline">See More</span>
              </div>
            </Link>
          </article>
          <article className="text-center">
            <Link className="feature-link" to="/behind-the-curtain#donate">
              <h2>Become a Donor</h2>
              <img src="/images/donor.svg" alt="" />
              <div className="feature-copy">
                <p>Your gift supports new work, emerging artists and a more welcoming theatre for everyone.</p>
                <span className="btn outline">See More</span>
              </div>
            </Link>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
