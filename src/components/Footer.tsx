import React from "react";
import { Link } from "react-router-dom";
import { Hotel, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import ParadiseLogo from "./ParadiseLogo";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t border-gold/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <ParadiseLogo inline={true} />
            <p className="text-xs text-white/60 leading-relaxed">
              Experience the perfect harmony of pristine coastlines, tropical cliffside gardens, and award-winning fine dining. At Hotel Paradise, every service is customized, and every moment is an everlasting memory.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-gold hover:text-charcoal rounded-full transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold hover:text-charcoal rounded-full transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold hover:text-charcoal rounded-full transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">Home & Rooms</Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-gold transition-colors">Luxury Room Listings</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">Resort Contact & Directions</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gold transition-colors">Your Active Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Core Facilities */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold mb-4">Resort Amenities</h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>Cliffside Open-Air Infinity Pool</li>
              <li>Five-Star Gourmet Dining Hall</li>
              <li>Automated AI In-Room Assistant</li>
              <li>Full Oceanfront Balconies</li>
              <li>Private Beachside Fire pits</li>
              <li>Integrated Airport Shuttle Transit</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold mb-4">Paradise Office</h4>
            <div className="space-y-3 text-xs text-white/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>20, Bordoni Road, Amin Bazar, Savar, Dhaka (Coastal Reserve Wing)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span>+88 0123 456 789 (Sales & Booking)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>booking@hotelparadise.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            &copy; {new Date().getFullYear()} Hotel Paradise. All rights reserved. Designed for elite luxury.
          </div>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest text-[9px]">Stripe / Razorpay Secure Payments</span>
            <div className="h-4 w-[1px] bg-white/25"></div>
            <span className="uppercase tracking-widest text-[9px]">AI-Powered Concierge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
