import { BrowserRouter, Routes, Route } from "react-router-dom"

import CartDrawer from "./components/CartDrawer"
import Navbar from "./components/Navbar"
import { CartProvider } from "./context/CartContext"

import AboutPage from "./pages/AboutPage"
import CheckoutPage from "./pages/CheckoutPage"
import CollectionPage from "./pages/CollectionPage"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
