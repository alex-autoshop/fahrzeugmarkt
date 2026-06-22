import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import MySearches from "@/pages/MySearches";
import CarPark from "@/pages/CarPark";
import Sell from "@/pages/Sell";
import CarDetail from "@/pages/CarDetail";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollTop />
      <TopBar />
      <main className="app-x min-h-[calc(100vh-3.5rem)] pb-24 pt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suche" element={<Search />} />
          <Route path="/meine-suchen" element={<MySearches />} />
          <Route path="/merkliste" element={<CarPark />} />
          <Route path="/verkaufen" element={<Sell />} />
          <Route path="/auto/:id" element={<CarDetail />} />
          <Route path="/nachrichten" element={<Messages />} />
          <Route path="/benachrichtigungen" element={<Notifications />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
