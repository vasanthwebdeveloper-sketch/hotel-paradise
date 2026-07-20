import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { 
  User as UserIcon, 
  Calendar, 
  Heart, 
  Trash2, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react";

const compressImage = (dataUrl: string, maxWidth = 160, maxHeight = 160): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
  });
};

export default function Dashboard() {
  const { user, bookings, rooms, wishlist, toggleWishlist, cancelBooking, showNotification, updateUser } = useApp();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || "");

  // Wishlisted rooms list
  const savedRooms = rooms.filter(r => wishlist.includes(r.id));

  // Filter out cancelled bookings so they are removed from the dashboard view
  const activeBookings = bookings.filter(b => b.status !== "Cancelled");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      // Save to localStorage for persistent local storage fix
      if (profileAvatar) {
        try {
          localStorage.setItem(`custom_avatar_${user.email}`, profileAvatar);
        } catch (storageErr) {
          console.warn("Could not save full custom avatar to localStorage due to quota limits:", storageErr);
        }
      }
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name: profileName, avatar: profileAvatar })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const localAvatar = localStorage.getItem(`custom_avatar_${data.user.email}`);
          if (localAvatar) {
            data.user.avatar = localAvatar;
          }
          updateUser(data.user);
        }
        showNotification("Profile details successfully updated!", "success");
        setEditingProfile(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadInvoice = (booking: any) => {
    // Generate a simple print-friendly text invoice and download it
    const invoiceContent = `
========================================
             HOTEL PARADISE
         Luxury Resort & Sea
========================================
INVOICE FOR RESERVATION: ${booking.id}
Date: ${new Date(booking.createdAt).toLocaleDateString()}
----------------------------------------
GUEST DETAILS:
Name: ${booking.userName}
Email: ${booking.userEmail}

RESERVATION DETAILS:
Room Name: ${booking.roomName}
Check-In Date: ${booking.checkIn}
Check-Out Date: ${booking.checkOut}
Total Guests: ${booking.guestsCount} adults

FINANCIALS:
Subtotal: ₹${booking.totalPrice}
Coupon: ${booking.couponCode || "None"}
Grand Total (Paid via Stripe): ₹${booking.totalPrice}
Status: ${booking.status.toUpperCase()}
----------------------------------------
Thank you for staying at Hotel Paradise!
Where serenity meets luxury perfection.
========================================
`;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Invoice text file successfully downloaded!", "success");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <XCircle className="h-14 w-14 text-rose-500 mx-auto" />
        <h3 className="font-serif text-3xl font-bold">Access Denied</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Please login or register to view your private guest dashboard, reserving logs, and saved wishlist items.
        </p>
        <button 
          onClick={() => {
            // Trigger login modal by triggering header button clicks
            const loginBtn = document.getElementById("btn-login-trigger");
            if (loginBtn) loginBtn.click();
          }}
          className="px-8 py-2.5 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow"
        >
          Access Login Gateway
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-gold/15 pb-6">
        <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">Paradise Club</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-charcoal">
          Your Guest Dashboard
        </h1>
        <p className="text-xs text-gray-400 font-light mt-1">
          Review your upcoming resort itineraries, manage security credentials, and view saved room layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Details (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gold/15 p-6 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold"></div>

            <div className="text-center space-y-3">
              {(!editingProfile && (!user.avatar || user.avatar.includes("seed=John") || user.avatar.includes("seed=Admin"))) ? (
                <div className="h-24 w-24 rounded-full border-2 border-gold/30 bg-gold/5 mx-auto flex items-center justify-center font-serif text-3xl font-bold text-gold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "J"}
                </div>
              ) : (editingProfile && (!profileAvatar || profileAvatar.includes("seed=John") || profileAvatar.includes("seed=Admin"))) ? (
                <div className="h-24 w-24 rounded-full border-2 border-gold/30 bg-gold/5 mx-auto flex items-center justify-center font-serif text-3xl font-bold text-gold">
                  {profileName ? profileName.charAt(0).toUpperCase() : "J"}
                </div>
              ) : (
                <img 
                  src={(editingProfile ? profileAvatar : user.avatar) || null} 
                  alt={user.name} 
                  className="h-24 w-24 rounded-full border-2 border-gold/30 bg-gold/5 mx-auto p-1 object-cover"
                />
              )}
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal">{user.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                  {user.role === "admin" ? "Paradise Host (Admin)" : "Elite Club Member"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Account Email:</span>
                <span className="font-semibold text-charcoal lowercase">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Joined Date:</span>
                <span className="font-semibold text-charcoal">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {editingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 pt-3 border-t border-gray-100 animate-fadeIn text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Update Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-2 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">Custom Profile Picture</label>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] uppercase tracking-wider text-gray-400">Choose a Local Image File</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              if (typeof reader.result === "string") {
                                const compressed = await compressImage(reader.result);
                                setProfileAvatar(compressed);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar-file-upload"
                        className="cursor-pointer px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-600 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-all inline-block"
                      >
                        Upload Local File
                      </label>
                      {profileAvatar && profileAvatar.startsWith("data:image/") && (
                        <span className="text-[9px] text-emerald-600 font-semibold">✓ Image Selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-gold text-charcoal text-[10px] font-bold rounded uppercase"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => {
                  setEditingProfile(true);
                  setProfileName(user?.name || "");
                  setProfileAvatar(user?.avatar || "");
                }}
                className="w-full py-2 bg-gray-50 hover:bg-gold/10 text-gray-600 hover:text-gold text-xs font-bold uppercase tracking-wider rounded border border-gray-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile details
              </button>
            )}
          </div>
        </div>

        {/* Booking History & Wishlist (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Reservation Logs */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
              <Calendar className="h-6 w-6 text-gold" />
              Active Resort Reservations
            </h3>

            {activeBookings.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-xl border border-gold/10 text-gray-400 space-y-3">
                <Calendar className="h-10 w-10 text-gold/30 mx-auto" />
                <p className="text-xs">You have no active or completed luxury reservations currently registered.</p>
                <Link 
                  to="/rooms" 
                  className="inline-block px-6 py-2 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest rounded"
                >
                  Book Your Suite
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-xl border border-gold/10 overflow-hidden shadow-sm flex flex-col sm:flex-row group"
                  >
                    {/* Room Thumbnail */}
                    <div className="h-32 sm:h-auto sm:w-44 shrink-0 overflow-hidden relative">
                      <img src={booking.roomImage || null} alt={booking.roomName} className="w-full h-full object-cover" />
                    </div>

                    {/* Booking Content */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-gold">ID: {booking.id}</span>
                          <span className={`text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-charcoal group-hover:text-gold transition-colors">
                          {booking.roomName}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-500 pt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                            <span>In: <strong className="text-charcoal">{booking.checkIn}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                            <span>Out: <strong className="text-charcoal">{booking.checkOut}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[10px] text-gray-400">Total Price:</span>
                            <span className="font-serif font-bold text-gold text-sm ml-1">₹{booking.totalPrice}</span>
                          </div>
                          {booking.paymentMethod && (
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                                ✓ Paid via {booking.paymentMethod}
                              </span>
                              {booking.transactionId && (
                                <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                                  Ref: {booking.transactionId}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "Confirmed" && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="px-3 py-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider rounded border border-transparent hover:border-red-100 flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDownloadInvoice(booking)}
                            className="px-3 py-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-charcoal text-[10px] font-bold uppercase tracking-wider rounded border border-gold/15 transition-all flex items-center gap-1"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Wishlist Items */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500 shrink-0" />
              Saved Luxury Wishlist ({savedRooms.length})
            </h3>

            {savedRooms.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-white p-6 rounded-xl border border-gold/5">
                No luxury suites added to your wishlist currently. Click on the heart icon during browsing to save.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedRooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-xl border border-gold/10 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div className="h-40 overflow-hidden relative">
                      <img src={(room.images && room.images[0]) || null} alt={room.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => toggleWishlist(room.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 text-rose-500 rounded-full"
                      >
                        <Heart className="h-3.5 w-3.5 fill-rose-500" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-charcoal line-clamp-1">{room.name}</h4>
                        <span className="text-[10px] text-gold font-bold">₹{room.price} / Night</span>
                      </div>

                      <Link
                        to={`/rooms/${room.id}`}
                        className="block w-full text-center py-2 bg-charcoal hover:bg-gold hover:text-charcoal text-white font-bold text-[9px] uppercase tracking-wider rounded shadow transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
