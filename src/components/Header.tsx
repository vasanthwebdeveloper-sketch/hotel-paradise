import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AlignRight, X, Hotel, User as UserIcon, LogOut, ShieldAlert, Heart, Calendar, Home as HomeIcon, Phone } from "lucide-react";
import ParadiseLogo from "./ParadiseLogo";

export default function Header() {
  const { user, wishlist, logout, login, register } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Rooms", href: "/rooms", icon: Hotel },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    
    if (isRegistering) {
      const success = await register(emailInput, passwordInput);
      if (success) {
        setIsRegistering(false);
        setPasswordInput("");
      }
    } else {
      const success = await login(emailInput, passwordInput);
      if (success) {
        setShowLoginModal(false);
        setEmailInput("");
        setPasswordInput("");
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-charcoal/95 text-white shadow-xl backdrop-blur-md border-b border-gold/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" id="header-logo-link" className="group">
                <ParadiseLogo inline={true} />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  id={`nav-${item.name.toLowerCase()}`}
                  className={`text-sm tracking-wider uppercase font-medium transition-all ${
                    isActive(item.href)
                      ? "text-gold border-b-2 border-gold pb-1 font-semibold"
                      : "text-white/80 hover:text-gold hover:translate-y-[-1px]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user && (
                <Link
                  to="/dashboard"
                  id="nav-dashboard"
                  className={`text-sm tracking-wider uppercase font-medium transition-all flex items-center gap-1.5 ${
                    isActive("/dashboard")
                      ? "text-gold border-b-2 border-gold pb-1 font-semibold"
                      : "text-white/80 hover:text-gold"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  id="nav-admin"
                  className={`text-sm tracking-wider uppercase font-semibold text-amber-300 transition-all flex items-center gap-1 hover:text-gold ${
                    isActive("/admin") ? "border-b-2 border-gold pb-1" : ""
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 text-gold animate-bounce" />
                  Admin
                </Link>
              )}
            </nav>

            {/* User Profile / Login */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {wishlist.length > 0 && (
                    <Link
                      to="/dashboard"
                      id="nav-wishlist-link"
                      className="relative p-1.5 text-white/80 hover:text-rose-400 transition-colors"
                      title="View Wishlist"
                    >
                      <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] text-white font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    </Link>
                  )}

                  <div className="h-8 w-[1px] bg-white/20"></div>

                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group"
                    title="Go to Dashboard"
                  >
                    {!user.avatar || user.avatar.includes("seed=John") || user.avatar.includes("seed=Admin") ? (
                      <div className="h-10 w-10 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-serif text-sm font-bold transition-all group-hover:border-gold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "J"}
                      </div>
                    ) : (
                      <img
                        src={user.avatar || null}
                        alt={user.name}
                        className="h-10 w-10 rounded-full border border-gold/30 bg-white/10 object-cover"
                      />
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-white/95 group-hover:text-gold transition-colors">{user.name}</span>
                      <span className="text-[10px] text-white/60 lowercase">{user.email}</span>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    id="btn-logout"
                    className="p-2 text-white/60 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setShowLoginModal(true);
                    }}
                    id="btn-login-trigger"
                    className="px-5 py-2 text-white hover:text-gold text-xs tracking-widest uppercase font-semibold border border-white/25 hover:border-gold rounded-md transition-all duration-300"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setShowLoginModal(true);
                    }}
                    id="btn-register-trigger"
                    className="px-5 py-2 bg-gold hover:bg-gold/90 text-charcoal font-semibold text-xs tracking-widest uppercase rounded-md shadow-md hover:shadow-gold/20 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user && wishlist.length > 0 && (
                <Link to="/dashboard" className="relative p-1.5 text-rose-400">
                  <Heart className="h-5 w-5 fill-rose-400" />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-[9px] text-white rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="btn-mobile-menu"
                className="p-2 text-white/80 hover:text-gold transition-colors duration-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <AlignRight className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-charcoal border-t border-gold/15 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href) ? "bg-gold/10 text-gold" : "text-white/80 hover:bg-white/5 hover:text-gold"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive("/dashboard") ? "bg-gold/10 text-gold" : "text-white/80 hover:bg-white/5 hover:text-gold"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 shrink-0" />
                <span>Dashboard</span>
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive("/admin") ? "bg-gold/10 text-gold" : "text-amber-300 hover:bg-white/5 hover:text-gold"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>Admin Panel</span>
              </Link>
            )}

            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="flex items-center justify-between px-3">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group"
                  >
                    {!user.avatar || user.avatar.includes("seed=John") || user.avatar.includes("seed=Admin") ? (
                      <div className="h-9 w-9 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-serif text-xs font-bold transition-all group-hover:border-gold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "J"}
                      </div>
                    ) : (
                      <img src={user.avatar || null} alt={user.name} className="h-9 w-9 rounded-full border border-gold/30 object-cover" />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{user.name}</div>
                      <div className="text-xs text-white/60 lowercase">{user.email}</div>
                    </div>
                  </Link>
                  <button onClick={logout} className="p-2 text-red-400 hover:bg-white/5 rounded-full">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsRegistering(false);
                      setShowLoginModal(true);
                    }}
                    className="w-full text-center py-2.5 border border-white/20 text-white font-bold uppercase tracking-wider text-[11px] rounded-md hover:bg-white/5 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsRegistering(true);
                      setShowLoginModal(true);
                    }}
                    className="w-full text-center py-2.5 bg-gold text-charcoal font-bold uppercase tracking-wider text-[11px] rounded-md hover:bg-gold/90 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Elegant Login / Verification Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-charcoal rounded-xl shadow-2xl border border-gold/20 max-w-md w-full p-6 relative animate-zoomIn overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold"></div>

            <button
              onClick={() => {
                setShowLoginModal(false);
                setIsRegistering(false);
              }}
              id="btn-close-login"
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <span className="font-serif text-xs uppercase tracking-[0.2em] text-gold font-semibold">Welcome to</span>
              <h3 className="font-serif text-2xl font-bold tracking-wide mt-1 text-charcoal">
                {isRegistering ? "Paradise Registration" : "Paradise Access"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isRegistering 
                  ? "Register with your email and password to start booking your stay." 
                  : "Enter your email and password to access your bookings and suites."}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                className="w-full py-2.5 bg-gold hover:bg-gold/95 text-charcoal font-bold text-xs uppercase tracking-widest rounded-md shadow-md transition-all duration-300"
              >
                {isRegistering ? "Register Account" : "Log In"}
              </button>

              <div className="pt-3 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  {isRegistering ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="text-gold font-bold hover:underline"
                      >
                        Log In
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="text-gold font-bold hover:underline"
                      >
                        Register First
                      </button>
                    </>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
