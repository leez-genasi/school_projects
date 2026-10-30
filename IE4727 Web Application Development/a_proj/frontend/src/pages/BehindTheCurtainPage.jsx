import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import './BehindTheCurtainPage.css';

export default function BehindTheCurtainPage() {
  const location = useLocation();
  const [curtainVisible, setCurtainVisible] = useState(true);

  useEffect(() => {
    const openTimer = window.setTimeout(() => setCurtainVisible(false), 1200);
    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [location.hash]);

  return (
    <PageLayout mainClassName="container curtain-page">
      {curtainVisible && (
        <div className="curtain-screen" aria-hidden="true">
          <div className="curtain-panel curtain-left" />
          <div className="curtain-panel curtain-right" />
        </div>
      )}
      <p className="eyebrow">The people and craft</p>
      <h1>Behind the Curtain</h1>
      <div className="row top-gap">
        <section className="col-md-7">
          <p className="lead">A little theatre is made by a lot of people.</p>
          <p>Artists, makers, stage managers and crew work together long before the lights go down. We bring their ideas to the stage and make a place for audiences to share a story.</p>
        </section>
        <section className="col-md-5" id="donate">
          <p className="eyebrow">Support the arts</p>
          <h2 className="h4">Become a donor</h2>
          <p>Your support helps us create new work and welcome more people into the theatre.</p>
          <Link className="btn btn-black" to="/visit#contact">Get in touch</Link>
        </section>
      </div>
    </PageLayout>
  );
}
