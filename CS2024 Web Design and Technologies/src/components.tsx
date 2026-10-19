import { useEffect, useState, type ReactNode } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  assets,
  promotions,
  type MenuAttribute,
  type MenuItem,
  type Outlet,
} from "./data"

export function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const classes = `button-link ${className}`

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    )
  }

  return (
    <Link className={classes} to={href}>
      {children}
    </Link>
  )
}

const attributeLabels: Record<MenuAttribute, string> = {
  iced: "Iced",
  hot: "Hot",
  vegetarian: "Vegetarian",
}

function MenuAttributeIcon({ type }: { type: MenuAttribute }) {
  if (type === "iced") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11M9.8 3.8 12 6l2.2-2.2M9.8 20.2 12 18l2.2 2.2M3.5 9.2 6.4 10l-.5-3M20.5 14.8l-2.9-.8.5 3M20.5 9.2l-2.9.8.5-3M3.5 14.8l2.9-.8-.5 3" />
      </svg>
    )
  }

  if (type === "hot") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.5 2.5c1 4-2.7 5.5-2.7 9 0 1.5.8 2.7 2.2 3.4-.2-2.5 2.2-3.6 2.6-5.9 1.7 1.8 2.9 3.7 2.9 6.1A5.5 5.5 0 0 1 12 20.5a5.5 5.5 0 0 1-5.5-5.4c0-4.2 3.9-6.5 6-12.6Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 3.5C13 3.8 7.2 6.5 5.2 11.4c-1.1 2.8-.4 5.6 1.7 7.1 2.3 1.6 5.5.8 7.3-1.5 2.8-3.6 2.3-8.1 6.3-13.5ZM4 21c2.7-4.4 6.2-7.7 11.2-10.4" />
    </svg>
  )
}

export function MenuAttributeBadge({ type }: { type: MenuAttribute }) {
  return (
    <span className={`menu-attribute menu-attribute-${type}`}>
      <MenuAttributeIcon type={type} />
      <span>{attributeLabels[type]}</span>
    </span>
  )
}

function getOutletStatus() {
  const singaporeHour = Number(
    new Intl.DateTimeFormat("en-SG", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    }).format(new Date()),
  )

  return singaporeHour >= 10 && singaporeHour < 22
}

export function OutletMeta({ outlet }: { outlet: Outlet }) {
  const isOpen = getOutletStatus()

  return (
    <>
      <p className="outlet-label">{outlet.label}</p>
      <div className="outlet-badges">
        <span className={`outlet-status ${isOpen ? "is-open" : "is-closed"}`}>
          {isOpen ? "Open now" : "Closed"}
        </span>
        {outlet.amenities.map((amenity) => (
          <span className="outlet-amenity" key={amenity}>
            {amenity}
          </span>
        ))}
      </div>
      <p className="outlet-hours">Open daily · 10 AM–10 PM</p>
    </>
  )
}

export function PromotionArtwork({
  promotion,
  circle = "3625e.svg",
}: {
  promotion: typeof promotions[number]
  circle?: string
}) {
  return (
    <div className={`promotion-art ${promotion.className}`}>
      <img className="promo-circle" src={`${assets}/${circle}`} alt="" />
      <img
        className="promo-composite"
        src={promotion.image}
        alt={promotion.alt}
      />
    </div>
  )
}

export type SelectedMenuItem = MenuItem & { category: string }

const productDescriptions: Record<string, string> = {
  Coffee:
    "Made to order for a focused study session or a quick break between classes.",
  Tea: "A comforting, aromatic cup for slower afternoons and study breaks.",
  Matcha:
    "A smooth matcha drink with balanced sweetness and an energising finish.",
  Bites:
    "An easy campus snack for busy days, short breaks, and study sessions.",
}

export function ProductDialog({
  item,
  onClose,
}: {
  item: SelectedMenuItem
  onClose: () => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.body.classList.add("dialog-open")
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.classList.remove("dialog-open")
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="product-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <div
        className="product-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
      >
        <button
          className="product-dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          autoFocus
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="product-dialog-image">
          <img src={`${assets}/${item.image}`} alt={item.name} />
        </div>
        <div className="product-dialog-content">
          <p className="product-dialog-category">{item.category}</p>
          <div className="product-dialog-heading">
            <h2 id="product-dialog-title">{item.name}</h2>
            <p>{item.price}</p>
          </div>
          {item.attributes.length > 0 && (
            <div className="menu-item-attributes">
              {item.attributes.map((attribute) => (
                <MenuAttributeBadge key={attribute} type={attribute} />
              ))}
            </div>
          )}
          <p className="product-dialog-description">
            {productDescriptions[item.category]}
          </p>
          <ul className="product-dialog-facts">
            <li>Available at all Shiki Coffee outlets</li>
            <li>Ask our team about allergens and customisations</li>
          </ul>
          <ButtonLink href="/?section=find-us">Find an outlet</ButtonLink>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [promoVisible, setPromoVisible] = useState(
    () => sessionStorage.getItem("shiki-promo-dismissed") !== "true",
  )
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.search])

  const navigation = (
    <>
      <NavLink to="/menu">Menu</NavLink>
      <Link to="/?section=find-us">Find Us</Link>
      <NavLink to="/about">About Us</NavLink>
      <NavLink to="/beans">Our Beans</NavLink>
    </>
  )

  function dismissPromo() {
    sessionStorage.setItem("shiki-promo-dismissed", "true")
    setPromoVisible(false)
  }

  return (
    <header
      className={`site-header${promoVisible ? "" : " promo-dismissed"}`}
    >
      {promoVisible && (
        <div className="promo-banner">
          <Link className="promo-message" to="/?section=find-us">
            Midterms Special! Buy one coffee, get a free pastry! Come find us!
          </Link>
          <button
            className="promo-dismiss"
            type="button"
            onClick={dismissPromo}
            aria-label="Dismiss promotion"
          >
            ×
          </button>
        </div>
      )}
      <nav className="nav-bar" aria-label="Main navigation">
        <div className="nav-links nav-left">
          <NavLink to="/menu">Menu</NavLink>
          <Link to="/?section=find-us">Find Us</Link>
        </div>
        <Link className="nav-logo" to="/" aria-label="Shiki Coffee home">
          <img src={`${assets}/a5ec6.png`} alt="" />
        </Link>
        <div className="nav-links nav-right">
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/beans">Our Beans</NavLink>
        </div>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <nav
        className={`mobile-navigation ${mobileOpen ? "is-open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {navigation}
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-inner">
        <img
          className="footer-logo"
          src={`${assets}/a5ec6.png`}
          alt="Shiki Coffee"
        />
        <div className="footer-column">
          <h2>Shiki Coffee</h2>
          <Link to="/">Home</Link>
          <Link to="/?section=find-us">Find Us</Link>
          <Link to="/about">About Us</Link>
        </div>
        <div className="footer-column">
          <h2>Menu</h2>
          <Link to="/menu?section=coffee">Coffee</Link>
          <Link to="/menu?section=tea">Tea</Link>
          <Link to="/menu?section=matcha">Matcha</Link>
        </div>
      </div>
    </footer>
  )
}
