import { useEffect } from "react"
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"
import AboutPage from "./pages/AboutPage"
import BeansPage from "./pages/BeansPage"
import HomePage from "./pages/HomePage"
import MenuPage from "./pages/MenuPage"

function RouteScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (!new URLSearchParams(location.search).has("section")) {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [location.pathname, location.search])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/beans" element={<BeansPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
