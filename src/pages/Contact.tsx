import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const { showNotification } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showNotification("Message sent! Our luxury customer staff will reach out in 2 hours.", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-gold/15 pb-6 text-center max-w-2xl mx-auto space-y-1">
        <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">24/7 Concierge Office</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-charcoal">
          Connect with Paradise
        </h1>
        <p className="text-xs text-gray-400 font-light mt-1">
          Have an inquiry regarding elite reservations, wedding venues, or helipad access? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Details Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gold/15 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold"></div>

            <h3 className="font-serif text-lg font-bold text-charcoal">Resort Locations</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-charcoal">Coastal Head Office</h4>
                  <p className="text-gray-500 mt-1">20, Bordoni Road, Amin Bazar, Savar, Dhaka (Coastal Reserve Wing)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-50 pt-3">
                <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-charcoal">Direct Reception Desk</h4>
                  <p className="text-gray-500 mt-1">+88 0123 456 789 (Int'l lines)</p>
                  <p className="text-[10px] text-gold mt-0.5">Complimentary butler calls for active bookings</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-50 pt-3">
                <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-charcoal">Concierge Email</h4>
                  <p className="text-gray-500 mt-1">concierge@hotelparadise.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Map */}
          <div className="bg-white p-4 rounded-xl border border-gold/10 shadow-sm space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gold" />
              Interactive Map Simulation
            </span>
            <div className="h-48 w-full bg-slate-100 rounded-lg relative overflow-hidden border border-gray-200">
              {/* Map Canvas Background */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" 
                className="w-full h-full object-cover opacity-35" 
                alt="Map context"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="p-2.5 bg-gold text-charcoal rounded-full animate-bounce shadow-md">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="bg-charcoal/95 text-white p-2 rounded shadow text-[10px] max-w-[200px]">
                  <strong className="text-gold">Hotel Paradise</strong> <br />
                  Savar Coastal Reserve Wing
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gold/15 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gold"></div>

          <h3 className="font-serif text-xl font-bold text-charcoal">Direct Inquiry Form</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2.5 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full p-2.5 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Subject Preference</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Booking Presidential suite"
                className="w-full p-2.5 border border-gray-200 rounded outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Message Inquiry</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your custom requests, dates and wedding specs here..."
                className="w-full p-2.5 border border-gray-200 rounded outline-none h-32 resize-none focus:ring-1 focus:ring-gold"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gold hover:bg-gold/90 text-charcoal font-bold uppercase tracking-widest text-xs rounded shadow transition-all duration-300 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="h-4 w-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Inquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
