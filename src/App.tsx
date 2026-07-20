import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";

// ScrollToTop component to reset window scroll on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as any, // "instant" ensures immediate scroll to top before rendering
    });
  }, [pathname]);

  return null;
}

// Pages
import Home from "./pages/Home";
import RoomListing from "./pages/RoomListing";
import RoomDetails from "./pages/RoomDetails";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";

// Alert/Notification banner Component
function NotificationBanner() {
  const { notification } = useApp();

  if (!notification.type || !notification.message) return null;

  const bgStyles = {
    success: "bg-emerald-600 text-white border-emerald-500",
    error: "bg-rose-600 text-white border-rose-500",
    info: "bg-blue-600 text-white border-blue-500"
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideDown max-w-sm w-full">
      <div className={`p-4 rounded-lg shadow-2xl border flex items-center justify-between gap-3 ${bgStyles[notification.type]}`}>
        <p className="text-xs font-semibold uppercase tracking-wider">{notification.message}</p>
      </div>
    </div>
  );
}

function MainAppLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#121212]">
      <NotificationBanner />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomListing />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
          {/* Wildcard catch all redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MainAppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
