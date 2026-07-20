import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Room, Review } from "../types";
import { 
  Calendar as CalendarIcon, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Award, 
  TrendingDown, 
  ThumbsUp, 
  AlertCircle,
  MessageSquarePlus,
  Send,
  Star,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  Clock
} from "lucide-react";

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rooms, user, toggleWishlist, wishlist, createBooking, showNotification } = useApp();

  const [room, setRoom] = useState<Room | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Checkout pricing state
  const [checkIn, setCheckIn] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Tomorrow
  );
  const [checkOut, setCheckOut] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 3 Days later
  );
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [couponInput, setCouponInput] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");

  // AI & review states
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calendar dates
  const [calendarDates, setCalendarDates] = useState<{ day: number; available: boolean; dateString: string }[]>([]);

  // UPI Payment Gateway States
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<"qr" | "id">("qr");
  const [upiIdInput, setUpiIdInput] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "approved" | "failed">("idle");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [isVerifyingId, setIsVerifyingId] = useState(false);

  // Fetch specific room details
  useEffect(() => {
    if (!id) return;
    const r = rooms.find((x) => x.id === id);
    if (r) {
      setRoom(r);
      setActiveImage(r.images[0]);
      setLoading(false);
      fetchReviews(r.id);
      fetchAiSummary(r.id);
    } else {
      setLoading(false);
    }
  }, [id, rooms]);

  // Generate availability calendar mock
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const futureDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      // Mock random availability
      const available = Math.random() > 0.15; // 85% availability
      dates.push({
        day: futureDate.getDate(),
        available,
        dateString: futureDate.toISOString().split("T")[0]
      });
    }
    setCalendarDates(dates);
  }, [id]);

  const fetchReviews = async (roomId: string) => {
    try {
      const res = await fetch(`/api/reviews/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
    }
  };

  const fetchAiSummary = async (roomId: string) => {
    setLoadingAiSummary(true);
    try {
      const res = await fetch(`/api/reviews/summary/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary);
      }
    } catch (e) {
      console.error("Failed to fetch AI summary:", e);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  // Timer effect for UPI payment session
  useEffect(() => {
    let interval: any;
    if (showPaymentGateway && timerSeconds > 0 && paymentStep === "idle") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && showPaymentGateway) {
      setPaymentStep("failed");
      showNotification("UPI payment gateway session has expired.", "error");
    }
    return () => clearInterval(interval);
  }, [showPaymentGateway, timerSeconds, paymentStep]);

  // Format time (e.g. 04:59)
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Pricing math
  const getDaysCount = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 0 : diffDays;
  };

  const days = getDaysCount();
  const basePrice = room ? room.price * days : 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const finalPrice = basePrice - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const coupons = await res.json();
        const found = coupons.find(
          (c: any) => c.code.toUpperCase() === couponInput.toUpperCase()
        );
        if (found) {
          setDiscountPercent(found.discountPercent);
          setAppliedCoupon(found.code);
          showNotification(`Coupon ${found.code} applied! Saved ${found.discountPercent}%`, "success");
        } else {
          showNotification("Invalid coupon code.", "error");
        }
      }
    } catch (e) {
      console.error("Coupon check failed:", e);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      showNotification("Please login to complete booking reservations.", "info");
      return;
    }

    if (days <= 0) {
      showNotification("Check-out date must be after check-in date", "error");
      return;
    }

    setTimerSeconds(300);
    setPaymentStep("idle");
    setUpiIdInput("");
    setCopiedVpa(false);
    setShowPaymentGateway(true);
  };

  const handleCompleteUpiBooking = async (vpaUsed?: string) => {
    setPaymentStep("processing");

    // Simulate merchant verification loop (2.5 seconds)
    setTimeout(async () => {
      try {
        const generatedTxnId = "TXN" + Math.floor(10000000000 + Math.random() * 90000000000);
        const payload = {
          roomId: room!.id,
          checkIn,
          checkOut,
          guestsCount,
          couponCode: appliedCoupon || undefined,
          paymentMethod: `BHIM UPI (${vpaUsed || "QR Code Scan"})`,
          transactionId: generatedTxnId
        };

        const res = await createBooking(payload);
        if (res.booking) {
          setPaymentStep("approved");
          showNotification("UPI payment validated. Reservation secured!", "success");
          setTimeout(() => {
            setShowPaymentGateway(false);
            navigate("/dashboard");
          }, 1500);
        } else {
          setPaymentStep("failed");
          showNotification(res.error || "UPI payment verification failed.", "error");
        }
      } catch (err) {
        console.error(err);
        setPaymentStep("failed");
      }
    }, 2500);
  };

  const handleLikeReview = async (reviewId: string) => {
    try {
      const res = await fetch("/api/reviews/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, likes: data.likes } : r));
        showNotification("Review liked!", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to submit reviews.", "info");
      return;
    }
    if (!newReviewComment.trim()) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room!.id,
          userId: user.id,
          rating: newReviewRating,
          comments: newReviewComment
        })
      });

      if (res.ok) {
        const added = await res.json();
        setReviews([added, ...reviews]);
        setNewReviewComment("");
        setShowReviewForm(false);
        showNotification("Grateful for your luxury review submission!", "success");
        // Recalculate AI summary
        fetchAiSummary(room!.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500">Unveiling room architecture...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold">Suite Not Found</h3>
        <p className="text-sm text-gray-500">The selected room model could not be loaded.</p>
        <Link to="/rooms" className="text-gold font-bold underline text-xs">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Return button */}
      <Link to="/rooms" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold hover:text-accent-brown">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sanctuary Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Gallery, Info, Reviews (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Photos Showcase */}
          <div className="space-y-3">
            <div className="h-96 w-full rounded-xl overflow-hidden border border-gold/15 relative">
              <img src={activeImage || null} alt={room.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => toggleWishlist(room.id)}
                className="absolute top-4 right-4 p-2 bg-white/95 text-gray-400 hover:text-rose-500 rounded-full shadow-md"
              >
                <Heart className={`h-5 w-5 ${wishlist.includes(room.id) ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>
            <div className="flex gap-3">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-24 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? "border-gold scale-95" : "border-transparent opacity-75 hover:opacity-100"}`}
                >
                  <img src={img || null} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Room Title & Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded font-bold">
                {room.category} Class
              </span>
              <div className="flex items-center gap-1.5 text-gold text-sm font-semibold">
                {"★".repeat(Math.round(room.rating))}
                <span className="text-gray-400 font-normal">({room.rating} rating)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">{room.name}</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              {room.description}
            </p>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-white p-4 rounded-xl border border-gold/10">
              <div className="text-center">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Room Size</span>
                <span className="font-semibold text-charcoal text-sm">{room.size} sqft</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Bed Type</span>
                <span className="font-semibold text-charcoal text-sm">{room.bedType}</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Max Guests</span>
                <span className="font-semibold text-charcoal text-sm">{room.maxGuests} Adults</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Sea View</span>
                <span className="font-semibold text-charcoal text-sm">{room.seaView ? "Yes" : "Courtyard"}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Availability Calendar */}
          <div className="space-y-3 bg-white p-6 rounded-xl border border-gold/10">
            <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-1.5">
              <CalendarIcon className="h-5 w-5 text-gold" />
              Real-Time Availability Calendar
            </h3>
            <p className="text-[10px] text-gray-400 font-light">
              We update vacancies continuously. Red indices represent dates booked by priority club reservations.
            </p>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="font-semibold text-gray-400">{d}</span>
              ))}
              {calendarDates.map((d, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-md font-bold flex flex-col items-center justify-center transition-colors ${
                    d.available
                      ? "bg-teal-50 text-teal-800 border border-teal-100"
                      : "bg-red-50 text-red-400 line-through border border-red-100 cursor-not-allowed"
                  }`}
                  title={d.available ? "Suite Available" : "Booked"}
                >
                  <span>{d.day}</span>
                  <span className="text-[7px] tracking-tighter uppercase">{d.available ? "Vacant" : "Booked"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Reviews Synthesis */}
          <div className="bg-gradient-to-br from-charcoal to-charcoal/90 text-white p-6 rounded-xl border border-gold/25 shadow-xl relative overflow-hidden">
            {/* Elegant luxury ambient background lights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 bg-gold/15 rounded-lg border border-gold/20 text-gold">
                <Sparkles className="h-5 w-5 animate-spin" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-gold">AI Guest Review Summary</h3>
                <p className="text-[9px] text-white/50 uppercase tracking-widest">Synthesized Live by Gemini 3.5 Flash</p>
              </div>
            </div>

            {loadingAiSummary ? (
              <div className="space-y-2 py-4 animate-pulse">
                <div className="h-3 w-full bg-white/10 rounded"></div>
                <div className="h-3 w-4/5 bg-white/10 rounded"></div>
                <div className="h-3 w-2/3 bg-white/10 rounded"></div>
              </div>
            ) : (
              <p className="text-xs text-white/80 leading-relaxed font-light italic">
                "{aiSummary || "Excellent cozy layouts, premium pristine sheets, and outstanding sea view orientations make this suite a master recommendation of fine hospitality."}"
              </p>
            )}
          </div>

          {/* User Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal">
                Guest Reviews ({reviews.length})
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-bold text-gold hover:text-accent-brown flex items-center gap-1 bg-gold/5 px-3 py-1.5 rounded-lg border border-gold/20"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Write Review
              </button>
            </div>

            {/* New Review Submit Panel */}
            {showReviewForm && (
              <form onSubmit={handleAddReviewSubmit} className="bg-white p-5 rounded-xl border border-gold/20 space-y-4 shadow-sm animate-zoomIn">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-gray-500">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="text-gold"
                      >
                        <Star className={`h-5 w-5 ${newReviewRating >= star ? "fill-gold text-gold" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe your luxury experiences at Hotel Paradise..."
                    className="w-full p-3 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none h-24 font-sans resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-1.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-gold text-charcoal rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* List Reviews */}
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No direct written comments submitted for this suite yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-xl border border-gold/5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar || null} alt={rev.userName} className="h-8 w-8 rounded-full bg-gold/10 border border-gold/20" />
                        <div>
                          <h4 className="text-xs font-semibold text-charcoal">{rev.userName}</h4>
                          <span className="text-[9px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex text-gold">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {rev.comments}
                    </p>

                    <button
                      onClick={() => handleLikeReview(rev.id)}
                      className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold hover:text-gold"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful ({rev.likes})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Price alerts, Prediction trends, Checkout card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Price Prediction Card */}
          <div className="bg-white p-5 rounded-xl border border-gold/15 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-emerald-500" />
                AI Price Analysis
              </span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">
                Best day to book
              </span>
            </div>

            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Based on historical occupancy metrics, prices for <span className="font-semibold text-charcoal">{room.name}</span> surge by <span className="text-gold font-bold">18% on Saturdays</span>. We recommend booking today to lock in our low midweek tier.
            </p>

            {/* Price Trend Chart Simulation */}
            <div className="space-y-2 pt-2">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">6-Month Price Projection</span>
              <div className="flex justify-between items-end h-24 pt-4 border-b border-gray-100">
                {room.priceTrend.map((t, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-grow space-y-2 group">
                    <span className="text-[8px] text-gold font-bold hidden group-hover:block absolute -mt-5 bg-charcoal text-white px-1.5 rounded shadow">
                      ₹{t.price}
                    </span>
                    <div 
                      className="w-4 bg-gold/30 hover:bg-gold rounded-t transition-all"
                      style={{ height: `${(t.price / 16000) * 100}%` }}
                    ></div>
                    <span className="text-[8px] text-gray-400 font-semibold uppercase">{t.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Booking Form */}
          <div className="bg-charcoal text-white p-6 rounded-xl border border-gold/25 shadow-2xl space-y-6 sticky top-24">
            <div className="text-center pb-4 border-b border-white/10">
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold">Your Luxury Stay</span>
              <h3 className="font-serif text-2xl font-bold mt-1">Reserve Suite</h3>
            </div>

            <div className="space-y-4">
              {/* Check-In */}
              <div>
                <label className="block text-[9px] uppercase font-bold tracking-wider text-white/60 mb-1">Check In</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                />
              </div>

              {/* Check-Out */}
              <div>
                <label className="block text-[9px] uppercase font-bold tracking-wider text-white/60 mb-1">Check Out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                />
              </div>

              {/* Guest Counts */}
              <div>
                <label className="block text-[9px] uppercase font-bold tracking-wider text-white/60 mb-1">Guests Capacity</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none text-white bg-charcoal"
                >
                  {Array.from({ length: room.maxGuests }).map((_, idx) => (
                    <option key={idx} value={idx + 1} className="text-charcoal bg-white">
                      {idx + 1} Guest{idx > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupon Code Panel */}
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-bold tracking-wider text-white/60 mb-1">Promo Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-grow px-3 py-2 bg-white/10 border border-white/20 rounded-md text-xs uppercase placeholder-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-wider rounded hover:bg-gold/90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <span className="text-[10px] text-emerald-400 block font-bold mt-1">
                    ✓ Applied Coupon: {appliedCoupon} ({discountPercent}% Discount)
                  </span>
                )}
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Room Base Rate</span>
                <span>₹{room.price} / night</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Resort Stay Duration</span>
                <span>{days} night{days > 1 ? "s" : ""}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Special Coupon Savings</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="h-[1px] bg-white/10 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">Total Est. Price</span>
                <span className="font-serif text-xl font-bold text-gold">₹{finalPrice}</span>
              </div>
            </div>

            {/* Submit Reservation button */}
            <button
              onClick={handleBookNow}
              id="btn-reserve-suite"
              className="w-full py-3 bg-gold hover:bg-gold/90 text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              Complete Reservation
            </button>
            <p className="text-[9px] text-white/50 text-center font-light leading-snug">
              Secure payments powered by Stripe, UPI & Razorpay. Zero cancel charges up to 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* UPI Payment Gateway Overlay Modal */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#121212] border-2 border-gold/40 rounded-2xl w-full max-w-lg relative shadow-[0_0_50px_rgba(200,164,93,0.3)] overflow-hidden text-white font-sans flex flex-col">
            
            {/* Top gold line */}
            <div className="h-1.5 bg-gradient-to-r from-gold/40 via-gold to-gold/40 w-full"></div>
            
            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header */}
              <div className="text-center relative">
                <button
                  onClick={() => setShowPaymentGateway(false)}
                  disabled={paymentStep === "processing"}
                  className="absolute right-0 top-0 text-white/50 hover:text-white text-lg disabled:opacity-30"
                >
                  ✕
                </button>
                <div className="flex justify-center mb-2">
                  <ShieldCheck className="h-10 w-10 text-gold" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
                  Hotel Paradise Checkout
                </h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-bold mt-1">
                  BHIM UPI Secure Gateway
                </p>
              </div>

              {/* Amount to pay */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold block">Reserving Stay</span>
                  <span className="text-xs text-white/80 font-serif font-semibold">{room.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold block">Total Amount</span>
                  <span className="text-xl font-bold text-gold font-serif">₹{finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {paymentStep === "idle" && (
                <>
                  {/* Timer Alert */}
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg py-2 px-3 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      Session expiry in:
                    </span>
                    <span className="font-mono font-bold tracking-wider">{formatTimer(timerSeconds)}</span>
                  </div>

                  {/* Tabs Selection */}
                  <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setActivePaymentTab("qr")}
                      className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all ${
                        activePaymentTab === "qr"
                          ? "bg-gold text-charcoal shadow-md"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      Scan QR Code
                    </button>
                    <button
                      onClick={() => setActivePaymentTab("id")}
                      className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all ${
                        activePaymentTab === "id"
                          ? "bg-gold text-charcoal shadow-md"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Smartphone className="h-4 w-4" />
                      Enter UPI ID
                    </button>
                  </div>

                  {/* Tab Content: QR CODE */}
                  {activePaymentTab === "qr" && (
                    <div className="space-y-4 animate-fadeIn text-center">
                      <p className="text-xs text-white/60 font-light leading-relaxed max-w-sm mx-auto">
                        Scan this QR code using any UPI-linked banking app (Google Pay, PhonePe, Paytm, or BHIM) to instantly complete payment.
                      </p>
                      
                      {/* Stylized QR Code with Gold Border & Live Scan Line */}
                      <div className="relative w-48 h-48 mx-auto p-3 bg-white rounded-xl border-2 border-gold shadow-[0_0_25px_rgba(200,164,93,0.3)] flex items-center justify-center overflow-hidden">
                        {/* Scanning bar effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
                        
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Anchor squares */}
                          <path d="M5,5 h15 v15 h-15 z M8,8 h9 v9 h-9 z M11,11 h3 v3 h-3 z" fill="#1C1C1C" />
                          <path d="M75,5 h15 v15 h-15 z M78,8 h9 v9 h-9 z M81,11 h3 v3 h-3 z" fill="#1C1C1C" />
                          <path d="M5,75 h15 v15 h-15 z M8,78 h9 v9 h-9 z M11,81 h3 v3 h-3 z" fill="#1C1C1C" />
                          
                          {/* Simulated QR codes density */}
                          <path d="M25,5 h5 v5 h-5 z M35,5 h5 v5 h-5 z M45,5 h10 v5 h-10 z M60,5 h10 v5 h-10 z" fill="#1C1C1C" />
                          <path d="M5,25 h5 v5 h-5 z M5,35 h5 v10 h-5 z M5,50 h5 v5 h-5 z M5,60 h5 v10 h-5 z" fill="#1C1C1C" />
                          <path d="M25,25 h15 v5 h-15 z M45,25 h5 v10 h-5 z M55,25 h10 v5 h-10 z M75,25 h20 v5 h-20 z" fill="#1C1C1C" />
                          <path d="M25,40 h5 v5 h-5 z M35,40 h15 v5 h-15 z M55,40 h5 v15 h-5 z M65,40 h30 v5 h-30 z" fill="#1C1C1C" />
                          <path d="M25,55 h10 v5 h-10 z M40,55 h10 v15 h-10 z M55,55 h5 v5 h-5 z M75,55 h15 v5 h-15 z" fill="#1C1C1C" />
                          <path d="M25,70 h20 v5 h-20 z M50,70 h10 v5 h-10 z M65,70 h5 v15 h-5 z M75,70 h5 v5 h-5 z" fill="#1C1C1C" />
                          <path d="M25,85 h5 v5 h-5 z M35,85 h10 v5 h-10 z M50,85 h20 v5 h-20 z M75,85 h20 v5 h-20 z" fill="#1C1C1C" />
                          
                          {/* Center Brand Badge */}
                          <rect x="42" y="42" width="16" height="16" rx="3" fill="#1C1C1C" />
                          <text x="50" y="52" fill="#C8A45D" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="serif">P</text>
                        </svg>
                      </div>

                      <div className="text-center font-mono text-[11px] text-white/50 flex items-center justify-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-md w-max mx-auto border border-white/5">
                        <span>UPI VPA: <strong className="text-gold">paradise@hdfcbank</strong></span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("paradise@hdfcbank");
                            setCopiedVpa(true);
                            showNotification("VPA copied to clipboard", "success");
                            setTimeout(() => setCopiedVpa(false), 2000);
                          }}
                          className="hover:text-gold transition-colors ml-1"
                        >
                          {copiedVpa ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      {/* Mock App launch buttons */}
                      <div className="space-y-2 pt-2">
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-white/40 text-center">Fast Launch apps</span>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleCompleteUpiBooking("Google Pay App")}
                            className="flex flex-col items-center gap-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 w-16 text-center transition-all group animate-bounce"
                          >
                            <span className="text-[14px] font-bold text-blue-400 group-hover:scale-110 transition-transform">G</span>
                            <span className="text-[8px] text-white/70">GPay</span>
                          </button>
                          <button
                            onClick={() => handleCompleteUpiBooking("PhonePe App")}
                            className="flex flex-col items-center gap-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 w-16 text-center transition-all group"
                          >
                            <span className="text-[14px] font-bold text-purple-400 group-hover:scale-110 transition-transform">P</span>
                            <span className="text-[8px] text-white/70">PhonePe</span>
                          </button>
                          <button
                            onClick={() => handleCompleteUpiBooking("Paytm App")}
                            className="flex flex-col items-center gap-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 w-16 text-center transition-all group"
                          >
                            <span className="text-[14px] font-bold text-sky-400 group-hover:scale-110 transition-transform">Pay</span>
                            <span className="text-[8px] text-white/70">Paytm</span>
                          </button>
                          <button
                            onClick={() => handleCompleteUpiBooking("BHIM App")}
                            className="flex flex-col items-center gap-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 w-16 text-center transition-all group"
                          >
                            <span className="text-[14px] font-bold text-orange-400 group-hover:scale-110 transition-transform">B</span>
                            <span className="text-[8px] text-white/70">BHIM</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleCompleteUpiBooking("QR Code Quick-Demo")}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                          <Check className="h-4 w-4" />
                          Simulate QR Scan Success
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: UPI ID Input */}
                  {activePaymentTab === "id" && (
                    <div className="space-y-4 animate-fadeIn">
                      <p className="text-xs text-white/60 font-light leading-relaxed">
                        Enter your Virtual Private Address (VPA) or registered UPI ID below. A payment request notification will be sent immediately to your UPI-enabled device.
                      </p>

                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50">Your UPI ID (VPA)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="e.g. vasanth@okaxis"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold/80 bg-gold/10 px-2 py-0.5 rounded uppercase">
                            Required
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!upiIdInput.includes("@")) {
                              showNotification("Please enter a valid VPA containing '@' symbol (e.g., name@okaxis)", "error");
                              return;
                            }
                            handleCompleteUpiBooking(upiIdInput);
                          }}
                          className="w-full py-3 bg-gold hover:bg-gold/90 text-charcoal font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5"
                        >
                          <Send className="h-4 w-4" />
                          Verify & Pay ₹{finalPrice.toLocaleString("en-IN")}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step: Processing */}
              {paymentStep === "processing" && (
                <div className="text-center py-10 space-y-6 animate-pulse">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <Loader2 className="h-16 w-16 text-gold animate-spin" />
                    <ShieldCheck className="h-8 w-8 text-gold absolute" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white uppercase tracking-wider">Verifying Transfer...</h4>
                    <p className="text-xs text-white/60 font-light max-w-xs mx-auto leading-relaxed">
                      Awaiting authorization loop from NPCI bank nodes. Please do not close or refresh this reservation window.
                    </p>
                  </div>
                </div>
              )}

              {/* Step: Approved */}
              {paymentStep === "approved" && (
                <div className="text-center py-10 space-y-6 animate-scaleIn">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">Payment Received!</h4>
                    <p className="text-xs text-white/70 font-light max-w-xs mx-auto">
                      Your bank transfer of <strong className="text-gold">₹{finalPrice.toLocaleString("en-IN")}</strong> has been validated. Securing your luxury suite reservation...
                    </p>
                  </div>
                </div>
              )}

              {/* Step: Failed / Expired */}
              {paymentStep === "failed" && (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                    <ShieldAlert className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-red-400 uppercase tracking-wider">Payment Failed</h4>
                    <p className="text-xs text-white/60 font-light max-w-xs mx-auto">
                      The UPI transaction was declined or has timed out. Please double-check your credentials and retry.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => setPaymentStep("idle")}
                      className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setShowPaymentGateway(false)}
                      className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Close Gateway
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Trust Details */}
              <div className="border-t border-white/5 pt-4 text-center space-y-2 text-[10px] text-white/40">
                <div className="flex justify-center items-center gap-4">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-gold" /> PCI-DSS Compliant</span>
                  <span>•</span>
                  <span>NPCI Unified Payments</span>
                  <span>•</span>
                  <span>Direct Bank Settlement</span>
                </div>
                <p className="font-light leading-normal max-w-xs mx-auto">
                  Powered by India's National Payments Corporation. Zero extra processing surcharges applied.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
