import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}