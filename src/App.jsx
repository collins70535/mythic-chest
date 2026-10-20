import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"

import CartDrawer from "./components/CartDrawer"
import Navbar from "./components/Navbar"
import { COMING_SOON } from "./config/comingSoon"
import { CartProvider } from "./context/CartContext"

import AboutPage from "./pages/AboutPage"
import CheckoutPage from "./pages/CheckoutPage"
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage"
import CollectionPage from "./pages/CollectionPage"
import CustomApparelPage from "./pages/CustomApparelPage"
import GarmentDesignerPage from "./pages/GarmentDesignerPage"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import HallOfFamePage from "./pages/HallOfFamePage"
import HallOfFamePayPage from "./pages/HallOfFamePayPage"

function AppContent() {
  const location = useLocation()

  if (location.pathname === "/hall-of-fame-2026/pay") {
    return <HallOfFamePayPage />
  }

  if (location.pathname === "/hall-of-fame-2026") {
    return <HallOfFamePage />
  }

  return (
    <CartProvider>
      <div className="min-h-screen text-white">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-amber-400 px-4 py-3 font-bold text-[#12091f] focus:not-sr-only"
        >
          Skip to main content
        </a>
        <Navbar />

        <div id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/checkout"
              element={COMING_SOON ? <Navigate to="/" replace /> : <CheckoutPage />}
            />
            <Route
              path="/checkout/success"
              element={COMING_SOON ? <Navigate to="/" replace /> : <CheckoutSuccessPage />}
            />
            <Route path="/collections/:categoryId" element={<CollectionPage />} />
            <Route path="/custom-apparel" element={<CustomApparelPage />} />
            <Route path="/custom/:garmentSlug" element={<GarmentDesignerPage />} />
            <Route
              path="/custom-tee"
              element={<Navigate to="/custom-apparel" replace />}
            />
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </div>

        {!COMING_SOON && <CartDrawer />}
      </div>
    </CartProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
