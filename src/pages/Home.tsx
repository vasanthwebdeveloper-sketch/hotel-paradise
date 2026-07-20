import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { RoomCategory } from "../types";
import ParadiseLogo from "../components/ParadiseLogo";
import { 
  Calendar as CalendarIcon, 
  Users, 
  Search, 
  Sparkles, 
  Wifi, 
  Coffee, 
  MapPin, 
  Award, 
  Tv, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Mic
} from "lucide-react";

export default function Home() {
  const { rooms, searchFilters, setSearchFilters, showNotification } = useApp();
  const navigate = useNavigate();

  // Local state for natural language smart search
  const [naturalQuery, setNaturalQuery] = useState("");
  const [aiParsing, setAiParsing] = useState(false);

  // Filter inputs (synced on search trigger)
  const [checkIn, setCheckIn] = useState(searchFilters.checkIn);
  const [checkOut, setCheckOut] = useState(searchFilters.checkOut);
  const [guests, setGuests] = useState(searchFilters.guestsCount);
  const [category, setCategory] = useState(searchFilters.category);

  // Get only featured rooms
  const featuredRooms = rooms.filter(r => r.featured).slice(0, 3);

  const handleStandardSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters(prev => ({
      ...prev,
      checkIn,
      checkOut,
      guestsCount: Number(guests),
      category
    }));
    navigate("/rooms");
  };

  // Natural Language AI Search parser
  const handleAiSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    setAiParsing(true);
    try {
      const res = await fetch("/api/chat/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: naturalQuery })
      });

      if (res.ok) {
        const filters = await res.json();
        // Set search filters globally
        setSearchFilters(prev => ({
          ...prev,
          checkIn,
          checkOut,
          guestsCount: filters.guestsCount || prev.guestsCount,
          category: filters.category || "All",
          maxPrice: filters.budget || 15000,
          seaView: filters.seaView || false,
          query: "" // Reset query so it applies the parsed state
        }));
        showNotification("AI Concierge successfully parsed your preferences! Redirecting to matching luxury rooms.", "success");
        navigate("/rooms");
      } else {
        showNotification("Unable to process AI Search. Redirecting with standard filters.", "info");
        navigate("/rooms");
      }
    } catch (e) {
      console.error("AI Search Error:", e);
      navigate("/rooms");
    } finally {
      setAiParsing(false);
    }
  };

  const handleVoiceAssistantTrigger = () => {
    showNotification("Voice recognition initialized. Speak your query, e.g., 'Luxury suite under 10000'", "info");
    // Simulate voice detection
    setTimeout(() => {
      setNaturalQuery("Luxury suite under ₹10000 with Sea View");
      showNotification("Voice capture complete: 'Luxury suite under ₹10000 with Sea View'", "success");
    }, 2500);
  };

  const facilities = [
    { icon: Wifi, title: "Giga-Speed Wi-Fi", desc: "Enterprise mesh coverage across all beaches & suites." },
    { icon: Coffee, title: "Complementary Dining", desc: "Award-winning French-infused breakfasts included." },
    { icon: Award, title: "Therapeutic Cliff Spa", desc: "Unmatched panoramic body healing massages." },
    { icon: Tv, title: "High-Fidelity Cinema", desc: "In-room smart cinema audio bar integrations." },
  ];

  const faqs = [
    { q: "Is airport pickup and transit transit included?", a: "Yes, we offer complementary luxury sedan airport pickups for all Suite and Presidential Villa guests. Standard rooms can reserve transit service for a small flat fare of ₹1200." },
    { q: "Can I cancel my room booking online?", a: "Absolutely. At Hotel Paradise, we provide a zero-penalty cancellation guarantee up to 24 hours before your active check-in window directly from your client dashboard." },
    { q: "Are pets permitted in rooms or beaches?", a: "To ensure supreme safety and tranquility for all guests, we host dedicated pet-friendly coastal villas on our North Coast Wing, while general towers are pet-free." },
    { q: "Do the Deluxe rooms have personal balconies?", a: "Yes, all Deluxe, Suite, and Presidential room types feature expansive open-air balconies overlooking either the deep blue ocean or our lush tropical courtyard garden." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream/30">
      {/* Grand Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Background Image with elegant luxury dark gradient overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=2000" 
            alt="Hotel Paradise resort overview" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-65 scale-105 transition-transform duration-[10000ms] hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-5xl px-4 text-center z-10 space-y-6">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-gold font-bold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 backdrop-blur-sm inline-block">
            Welcome to Absolute Serenity
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-wide leading-tight">
            Where Ocean Meets <br/>
            <span className="text-gold italic font-normal font-serif">Luxury</span> Perfection
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-base text-white/80 font-light leading-relaxed">
            Unwind in paradise. Stay in our premier rooms overlooking private tropical cliffside gardens and white-sand coastal beaches. Fully integrated with automated AI concierge features.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a 
              href="#booking-anchor" 
              className="px-8 py-3 bg-gold hover:bg-gold/90 text-charcoal font-bold text-xs uppercase tracking-widest rounded-md shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Book Your Stay
            </a>
            <Link 
              to="/rooms" 
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-md backdrop-blur-sm border border-white/25 transition-transform hover:-translate-y-0.5"
            >
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation & Smart Search Anchor */}
      <div id="booking-anchor" className="relative mx-auto max-w-6xl w-full px-4 -mt-16 z-30">
        <div className="bg-white rounded-xl shadow-2xl border border-gold/15 overflow-hidden">
          {/* Section tabs */}
          <div className="bg-charcoal text-white/60 flex items-center border-b border-gold/10 text-xs uppercase tracking-wider font-semibold">
            <div className="px-6 py-4 bg-white text-charcoal flex items-center gap-2 border-r border-gold/10">
              <CalendarIcon className="h-4 w-4 text-gold" />
              Standard Reservation
            </div>
            <div className="px-6 py-4 flex items-center gap-2 text-white/85 bg-gold/10 font-bold border-r border-gold/10">
              <Sparkles className="h-4 w-4 text-gold animate-bounce" />
              AI-Powered Smart Search
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Standard Reservation inputs (6 columns) */}
            <form onSubmit={handleStandardSearch} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Check In</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Check Out</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Guests</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none bg-white"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                  <option value={5}>5 Adults</option>
                </select>
              </div>

              <button 
                type="submit" 
                id="btn-std-search"
                className="w-full py-2 bg-charcoal hover:bg-gold hover:text-charcoal text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-md transition-all h-9 flex items-center justify-center gap-2"
              >
                <Search className="h-3.5 w-3.5" />
                Find Room
              </button>
            </form>

            {/* Separator */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <div className="h-12 w-[1px] bg-gray-200"></div>
            </div>

            {/* AI Smart Search widget (4 columns) */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Ask our AI Concierge
              </span>
              <form onSubmit={handleAiSmartSearch} className="relative flex items-center">
                <input 
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder='e.g., "Sea view room under ₹5000"'
                  className="w-full pl-3 pr-16 py-2.5 bg-cream/10 border border-gold/30 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold outline-none placeholder-gray-400 font-sans"
                  disabled={aiParsing}
                />
                <div className="absolute right-1 flex items-center gap-1">
                  <button 
                    type="button" 
                    onClick={handleVoiceAssistantTrigger}
                    className="p-1.5 text-gold/80 hover:text-gold rounded-full hover:bg-gray-100"
                    title="Voice search assistant"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    type="submit" 
                    id="btn-ai-search"
                    className="p-1.5 bg-gold hover:bg-gold/90 text-charcoal rounded-md shadow transition-colors"
                    disabled={aiParsing}
                  >
                    {aiParsing ? (
                      <div className="h-3.5 w-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </form>
              <div className="flex gap-2 flex-wrap pt-0.5">
                <button 
                  onClick={() => setNaturalQuery("Luxury room under ₹5000")}
                  className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  "under ₹5000"
                </button>
                <button 
                  onClick={() => setNaturalQuery("Sea view suite for couple")}
                  className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  "sea view suite"
                </button>
                <button 
                  onClick={() => setNaturalQuery("Room for 4 adults")}
                  className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  "4 adults"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Luxury Rooms */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">Unmatched Accommodations</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-charcoal">
            Featured Rooms & Suites
          </h2>
          <div className="h-0.5 w-24 bg-gold mx-auto"></div>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
            Each room represents the pinnacle of hospitality, furnished with elegant custom wooden designs, continuous automated butler integrations, and sweeping balcony layouts.
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-gold/10 hover:shadow-2xl transition-all duration-500 group flex flex-col"
              >
                {/* Image Container with zoom */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={(room.images && room.images[0]) || null} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md border border-gold/30 text-[9px] uppercase tracking-widest text-gold font-bold px-3 py-1 rounded">
                    {room.category}
                  </span>
                  {room.seaView && (
                    <span className="absolute top-4 right-4 bg-teal-500 text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded shadow">
                      Ocean View
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded shadow">
                    <span className="font-serif text-lg font-bold text-charcoal">₹{room.price}</span>
                    <span className="text-[10px] text-gray-500 lowercase"> / Night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-gold">
                      {"★".repeat(Math.round(room.rating))}
                      <span className="text-xs text-gray-400 font-semibold ml-1">({room.rating})</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-gold transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                      {room.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {room.amenities.slice(0, 4).map((a, i) => (
                      <span key={i} className="text-[9px] px-2.5 py-1 bg-cream border border-gold/10 rounded-full text-accent-brown">
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                      Up to {room.maxGuests} guests &bull; {room.size} sqft
                    </span>
                    <Link 
                      to={`/rooms/${room.id}`}
                      className="text-xs font-bold text-gold hover:text-accent-brown flex items-center gap-1 group/btn"
                    >
                      More Details
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-10">
          <Link 
            to="/rooms" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-charcoal hover:bg-gold hover:text-charcoal text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-md transition-all duration-300"
          >
            Explore All Accommodations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Luxury Resort Facilities */}
      <section className="py-20 bg-charcoal text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">Uncompromising Standard</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide">
              Paradise Resort Offerings
            </h2>
            <div className="h-0.5 w-24 bg-gold"></div>
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
              At Hotel Paradise, our five-star standards go far beyond static structures. We feature a seamless, modern, client-authoritative service layer designed to enrich every physical aspect of your stay.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {facilities.map((fac, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-2.5 bg-gold/10 border border-gold/30 rounded-lg text-gold shrink-0">
                    <fac.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gold">{fac.title}</h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <ParadiseLogo size="xl" className="w-full max-w-md shadow-2xl" />
          </div>
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="py-20 bg-cream/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">Frequently Asked</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal">Resort Policy & Support</h2>
            <div className="h-0.5 w-24 bg-gold mx-auto"></div>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gold/10 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-gold shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-gray-500 mt-2.5 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
