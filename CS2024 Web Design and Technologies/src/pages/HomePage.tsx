import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  ButtonLink,
  OutletMeta,
  PromotionArtwork,
  SiteFooter,
  SiteHeader,
} from "../components"
import {
  assets,
  features,
  featuredOutlet,
  locations,
  promotions,
} from "../data"

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const sectionId = new URLSearchParams(location.search).get("section")
    if (!sectionId) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.search])

  return (
    <div className="site-shell">
      <SiteHeader />

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1>Shiki Coffee</h1>
            <p>Fueling creativity, one sip at a time</p>
            <div className="hero-actions">
              <ButtonLink
                href="/?section=find-us"
                className="hero-location-button"
              >
                Find an outlet
              </ButtonLink>
              <ButtonLink href="/menu" className="hero-menu-button">
                Menu
              </ButtonLink>
            </div>
          </div>
          <div className="coffee-cups" aria-hidden="true">
            <div className="cup cup-left">
              <img className="cup-photo" src={`${assets}/01623.png`} alt="" />
              <img className="cup-logo" src={`${assets}/a5ec6.png`} alt="" />
            </div>
            <div className="cup cup-center">
              <img className="cup-photo" src={`${assets}/01623.png`} alt="" />
              <img className="cup-logo" src={`${assets}/a5ec6.png`} alt="" />
            </div>
            <div className="cup cup-right">
              <img className="cup-photo" src={`${assets}/01623.png`} alt="" />
              <img className="cup-logo" src={`${assets}/a5ec6.png`} alt="" />
            </div>
          </div>
        </section>

        <section
          className="features"
          id="about"
          aria-label="Shiki Coffee features"
        >
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <img
                  src={feature.image}
                  alt=""
                  style={{ objectPosition: feature.position }}
                />
                <div className="feature-shade" />
                <div className="feature-copy">
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                  <ButtonLink href={feature.href}>{feature.action}</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section promotions" id="promotions">
          <h2 className="script-heading">Promotions:</h2>
          <div className="promotion-grid">
            {promotions.map((promotion) => (
              <article className="promotion-card" key={promotion.title}>
                <PromotionArtwork promotion={promotion} />
                <h3>{promotion.title}</h3>
                <p>{promotion.description}</p>
              </article>
            ))}
          </div>
          <ButtonLink href="/menu">See our menu!</ButtonLink>
        </section>

        <section className="content-section locations" id="find-us">
          <h2 className="script-heading">Find us:</h2>
          <div className="location-layout">
            <article className="featured-location">
              <img
                src={`${assets}/3edfa.png`}
                alt="Bright interior of Shiki Coffee"
              />
              <div className="location-info">
                <div>
                  <h3>{featuredOutlet.address}</h3>
                  <OutletMeta outlet={featuredOutlet} />
                </div>
                <ButtonLink
                  href={`https://maps.google.com/?q=${encodeURIComponent(featuredOutlet.address)}`}
                >
                  Get Directions
                </ButtonLink>
              </div>
            </article>
            <div className="location-list">
              {locations.map((outlet) => (
                <article
                  className="location-card"
                  key={`outlet-${outlet.address}`}
                >
                  <div>
                    <h3>{outlet.address}</h3>
                    <OutletMeta outlet={outlet} />
                  </div>
                  <ButtonLink
                    href={`https://maps.google.com/?q=${encodeURIComponent(outlet.address)}`}
                  >
                    Get Directions
                  </ButtonLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section contact" id="contact">
          <h2 className="script-heading">Contact Us:</h2>
          <div className="contact-grid">
            <a href="mailto:shikicoffee@gmail.com">
              <img src={`${assets}/da108.svg`} alt="" />
              <span>shikicoffee@gmail.com</span>
            </a>
            <a href="tel:+6582347890">
              <img src={`${assets}/c117c.svg`} alt="" />
              <span>+65 8234 7890</span>
            </a>
            <a href="https://instagram.com/shiki_coffee">
              <img src={`${assets}/ca5d8.svg`} alt="" />
              <span>@shiki_coffee</span>
            </a>
            <a href="https://tiktok.com/@shiki_coffee">
              <img src={`${assets}/1862b.svg`} alt="" />
              <span>@shiki_coffee</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
