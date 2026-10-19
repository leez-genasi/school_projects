import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  MenuAttributeBadge,
  ProductDialog,
  PromotionArtwork,
  SiteFooter,
  SiteHeader,
  type SelectedMenuItem,
} from "../components"
import { assets, categoryLinks, menuSections, promotions } from "../data"

function PromotionCards() {
  return (
    <div className="promotion-grid menu-promotion-grid">
      {promotions.map((promotion) => (
        <article className="promotion-card" key={promotion.title}>
          <PromotionArtwork promotion={promotion} circle="5a8b6.svg" />
          <h3>{promotion.title}</h3>
          <p>{promotion.description}</p>
        </article>
      ))}
    </div>
  )
}

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(
    null,
  )
  const [activeSection, setActiveSection] = useState("menu-promotions")
  const [searchParams, setSearchParams] = useSearchParams()
  const lockedSection = useRef<string | null>(null)
  const unlockTimer = useRef<number | null>(null)

  useEffect(() => {
    const requestedSection = searchParams.get("section")
    if (!requestedSection) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(requestedSection)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [searchParams])

  useEffect(() => {
    const sections = categoryLinks
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    function updateActiveSection() {
      if (lockedSection.current) {
        setActiveSection(lockedSection.current)
        return
      }

      const categoryNav = document.querySelector(".category-nav")
      const activationLine =
        window.innerWidth <= 900
          ? (categoryNav?.getBoundingClientRect().bottom ?? 210) + 15
          : 220
      let currentSection = sections[0]?.id ?? "menu-promotions"

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          currentSection = section.id
        } else {
          break
        }
      }

      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40

      if (reachedPageEnd && sections.length > 0) {
        currentSection = sections[sections.length - 1].id
      }

      setActiveSection(currentSection)
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
      if (unlockTimer.current) window.clearTimeout(unlockTimer.current)
    }
  }, [])

  function navigateToSection(sectionId: string) {
    if (unlockTimer.current) window.clearTimeout(unlockTimer.current)

    lockedSection.current = sectionId
    setActiveSection(sectionId)
    setSearchParams({ section: sectionId }, { replace: true })

    unlockTimer.current = window.setTimeout(() => {
      lockedSection.current = null
      unlockTimer.current = null
    }, 850)
  }

  return (
    <div className="site-shell menu-page">
      <SiteHeader />
      <main>
        <section className="menu-hero">
          <h1>Menu</h1>
          <p>Handcrafted from our home and heart.</p>
        </section>

        <div className="menu-layout">
          <aside className="category-nav" aria-label="Menu categories">
            {categoryLinks.map((category) => (
              <button
                className={activeSection === category.id ? "is-active" : ""}
                type="button"
                onClick={() => navigateToSection(category.id)}
                aria-current={
                  activeSection === category.id ? "true" : undefined
                }
                key={category.id}
              >
                <span className="category-icon">
                  <img src={`${assets}/${category.icon}`} alt="" />
                </span>
                <span>{category.label}</span>
              </button>
            ))}
            <div
              className="menu-attribute-legend"
              aria-label="Menu attribute symbols"
            >
              <MenuAttributeBadge type="iced" />
              <MenuAttributeBadge type="hot" />
              <MenuAttributeBadge type="vegetarian" />
            </div>
          </aside>

          <div className="menu-content">
            <section className="menu-promotions" id="menu-promotions">
              <h2 className="menu-script-heading">Promotions</h2>
              <PromotionCards />
            </section>

            {menuSections.map((section) => (
              <section
                className="menu-section"
                id={section.id}
                key={section.id}
              >
                <h2 className="menu-script-heading">{section.title}</h2>
                <div className="menu-item-grid">
                  {section.items.map((item) => (
                    <article className="menu-item" key={item.name}>
                      <button
                        className="menu-item-trigger"
                        type="button"
                        onClick={() =>
                          setSelectedItem({
                            ...item,
                            category: section.title,
                          })
                        }
                      >
                        <div className="menu-item-image">
                          <img
                            src={`${assets}/${item.image}`}
                            alt={item.name}
                          />
                        </div>
                        <div className="menu-item-details">
                          <h3>{item.name}</h3>
                          <p>{item.price}</p>
                        </div>
                        {item.attributes.length > 0 && (
                          <div className="menu-item-attributes">
                            {item.attributes.map((attribute) => (
                              <MenuAttributeBadge
                                key={attribute}
                                type={attribute}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      {selectedItem && (
        <ProductDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
