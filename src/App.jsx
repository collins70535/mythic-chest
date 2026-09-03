import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import CartDrawer from "./components/CartDrawer"
import Navbar from "./components/Navbar"
import { CartProvider } from "./context/CartContext"

import AboutPage from "./pages/AboutPage"
import CheckoutPage from "./pages/CheckoutPage"
import CollectionPage from "./pages/CollectionPage"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import HallOfFamePage from "./pages/HallOfFamePage"

function AppContent() {
  const location = useLocation()

  if (location.pathname === "/hall-of-fame-2026") {
    return <HallOfFamePage />
  }

  return (
    <CartProvider>
      <div className="min-h-screen text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/collections/:categoryId" element={<CollectionPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>

        <CartDrawer />
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
