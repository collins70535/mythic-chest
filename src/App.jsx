import { BrowserRouter, Routes, Route } from "react-router-dom"

import CartDrawer from "./components/CartDrawer"
import Navbar from "./components/Navbar"
import { CartProvider } from "./context/CartContext"

import CheckoutPage from "./pages/CheckoutPage"
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
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>

          <CartDrawer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
