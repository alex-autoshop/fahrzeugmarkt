import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import CarDetail from "@/pages/CarDetail";
import Sell from "@/pages/Sell";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auto/:id" element={<CarDetail />} />
        <Route path="/inserieren" element={<Sell />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
