import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ButtonLink, SiteFooter, SiteHeader } from "../components"
import { assets, beanProfiles } from "../data"

export default function BeansPage() {
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
    <div className="site-shell beans-page">
      <SiteHeader />
      <main>
        <section className="beans-hero">
          <div className="beans-hero-copy">
            <p className="beans-eyebrow">From origin to cup</p>
            <h1>Our Beans</h1>
            <p className="beans-hero-intro">
              Coffee with enough character to energise a deadline—and enough
              comfort to make campus feel a little more like home.
            </p>
            <div className="beans-actions">
              <ButtonLink
                href="/beans?section=roast-profiles"
                className="beans-primary-button"
              >
                Explore the roast
              </ButtonLink>
              <ButtonLink
                href="/menu?section=coffee"
                className="beans-outline-button"
              >
                View the menu
              </ButtonLink>
            </div>
          </div>
          <figure className="beans-hero-media">
            <img
              src={`${assets}/beans-hero.jpg`}
              alt="A close view of roasted coffee beans"
            />
            <figcaption>Photo by Mike Kenneally on Unsplash</figcaption>
          </figure>
        </section>

        <section className="beans-source">
          <figure className="beans-source-media">
            <img
              src={`${assets}/beans-harvest.jpg`}
              alt="Hands harvesting ripe coffee cherries"
            />
            <figcaption>Photo by The Manh on Unsplash</figcaption>
          </figure>
          <div className="beans-source-copy">
            <p className="beans-eyebrow">Better coffee starts earlier</p>
            <h2>Chosen with intention</h2>
            <p>
              Great coffee begins long before it reaches our bar. We prioritise
              seasonal specialty lots with clear flavour, dependable quality,
              and traceable sourcing information.
            </p>
            <p>
              Our menu is designed around a balanced house profile, while
              seasonal coffees give curious drinkers something new to discover.
            </p>
            <dl className="beans-facts">
              <div>
                <dt>House style</dt>
                <dd>Sweet, balanced, comforting</dd>
              </div>
              <div>
                <dt>Roast approach</dt>
                <dd>Developed for espresso, milk, and ice</dd>
              </div>
              <div>
                <dt>Quality focus</dt>
                <dd>Clarity, consistency, and natural sweetness</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="beans-roasts" id="roast-profiles">
          <div className="beans-section-heading">
            <p className="beans-eyebrow">Find your cup</p>
            <h2>Flavour profiles</h2>
            <p>
              Start with the tasting notes that sound most like your kind of
              study break.
            </p>
          </div>
          <div className="bean-profile-grid">
            {beanProfiles.map((profile) => (
              <article className="bean-profile-card" key={profile.country}>
                <h3>{profile.country}</h3>
                <p className="bean-profile-notes">{profile.notes}</p>
                <p>{profile.description}</p>
                <p className="bean-profile-pairing">{profile.pairing}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="beans-cta">
          <div>
            <p className="beans-eyebrow">Ready for a study break?</p>
            <h2>Meet your next cup.</h2>
          </div>
          <div className="beans-actions">
            <ButtonLink href="/menu?section=coffee">Browse coffee</ButtonLink>
            <ButtonLink
              href="/?section=find-us"
              className="beans-outline-button"
            >
              Find an outlet
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
