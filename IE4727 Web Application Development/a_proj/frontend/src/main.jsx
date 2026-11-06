import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import VisitPage from './pages/VisitPage.jsx'
import BehindTheCurtainPage from './pages/BehindTheCurtainPage.jsx'
import ShowPage from './pages/ShowPage.jsx'
import CartPage from './pages/CartPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/visit" element={<VisitPage />} />
        <Route path="/behind-the-curtain" element={<BehindTheCurtainPage />} />
        <Route path="/show/:showId" element={<ShowPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
