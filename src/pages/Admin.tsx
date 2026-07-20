import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Room, Booking, RoomCategory, User } from "../types";
import { 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  Plus, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  Database,
  RefreshCw,
  X,
  FileText,
  Users
} from "lucide-react";

export default function Admin() {
  const { user, rooms, fetchRooms, showNotification, login } = useApp();
  
  const [activeTab, setActiveTab] = useState<"rooms" | "bookings" | "users">("rooms");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Admin stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    occupancyRate: 0,
    cancelledBookings: 0
  });

  // Booking details list
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Room modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Form Fields
  const [roomName, setRoomName] = useState("");
  const [roomCategory, setRoomCategory] = useState<RoomCategory>(RoomCategory.DELUXE);
  const [roomPrice, setRoomPrice] = useState(3000);
  const [roomDescription, setRoomDescription] = useState("");
  const [roomSize, setRoomSize] = useState(450);
  const [roomMaxGuests, setRoomMaxGuests] = useState(2);
  const [roomBedType, setRoomBedType] = useState("King Bed");
  const [roomSeaView, setRoomSeaView] = useState(false);
  const [roomImages, setRoomImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000"
  ]);

  const [loading, setLoading] = useState(true);

  // Fetch admin stats and list
  const fetchAdminData = async () => {
    try {
      const resStats = await fetch("/api/admin/stats");
      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }

      const resBookings = await fetch("/api/bookings");
      if (resBookings.ok) {
        const bookingsData = await resBookings.json();
        setAllBookings(bookingsData);
      }

      const resUsers = await fetch("/api/admin/users");
      if (resUsers.ok) {
        const usersData = await resUsers.json();
        setAllUsers(usersData);
      }
    } catch (e) {
      console.error("Admin fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  // Handle Save / Edit Room
  const handleSaveRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: roomName,
      category: roomCategory,
      price: Number(roomPrice),
      description: roomDescription,
      size: Number(roomSize),
      maxGuests: Number(roomMaxGuests),
      bedType: roomBedType,
      seaView: roomSeaView,
      images: roomImages,
      rating: 4.8,
      featured: true,
      priceTrend: [
        { month: "Jan", price: Number(roomPrice) - 300 },
        { month: "Mar", price: Number(roomPrice) },
        { month: "May", price: Number(roomPrice) + 800 },
        { month: "Jul", price: Number(roomPrice) + 1200 },
        { month: "Sep", price: Number(roomPrice) + 200 },
        { month: "Nov", price: Number(roomPrice) - 400 }
      ]
    };

    try {
      const endpoint = modalMode === "add" ? "/api/rooms" : `/api/rooms/${activeRoomId}`;
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotification(
          modalMode === "add" ? "New luxury suite added!" : "Suite architecture modified successfully.",
          "success"
        );
        setShowRoomModal(false);
        resetFormFields();
        await fetchRooms(); // Refresh public context
        await fetchAdminData(); // Refresh admin views
      } else {
        const err = await res.json();
        showNotification(err.error || "Failed to save room details.", "error");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditRoomTrigger = (room: Room) => {
    setModalMode("edit");
    setActiveRoomId(room.id);
    setRoomName(room.name);
    setRoomCategory(room.category);
    setRoomPrice(room.price);
    setRoomDescription(room.description);
    setRoomSize(room.size);
    setRoomMaxGuests(room.maxGuests);
    setRoomBedType(room.bedType);
    setRoomSeaView(room.seaView);
    setRoomImages(room.images);
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm("Are you sure you want to retire this luxury suite from Hotel Paradise listings?")) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Suite retired from Paradise listings.", "info");
        await fetchRooms();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manage Bookings (Confirm/Refund)
  const handleUpdateBookingStatus = async (bookingId: string, status: "Confirmed" | "Cancelled") => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showNotification(`Reservation status updated to: ${status}`, "success");
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeedTestData = async () => {
    if (!window.confirm("Restore Paradise default database? This will reset all modifications.")) return;
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (res.ok) {
        showNotification("Paradise database successfully reset to luxury seed metrics!", "success");
        await fetchRooms();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetFormFields = () => {
    setRoomName("");
    setRoomCategory(RoomCategory.DELUXE);
    setRoomPrice(3000);
    setRoomDescription("");
    setRoomSize(450);
    setRoomMaxGuests(2);
    setRoomBedType("King Bed");
    setRoomSeaView(false);
  };

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center space-y-8">
        <ShieldAlert className="h-16 w-16 text-gold mx-auto animate-pulse" />
        
        {user ? (
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-bold text-charcoal">Administrator Privileges Required</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              You are currently logged in as <strong className="text-charcoal">{user.name}</strong> ({user.email}). Only administrators can manage suites and reservations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
              <a
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 bg-gold text-charcoal text-center font-bold text-xs uppercase tracking-widest rounded shadow hover:bg-gold/90 transition-all"
              >
                Return to Resort Home
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-bold text-charcoal">Admin Portal Gateway</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Authorized staff credentials are required to access administrative reports and suite inventories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
              <button
                onClick={() => {
                  const loginBtn = document.getElementById("btn-login-trigger");
                  if (loginBtn) loginBtn.click();
                }}
                className="w-full sm:w-auto px-8 py-2.5 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded shadow hover:bg-gold/90 transition-all"
              >
                Staff Login Gateway
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-6">
        <div>
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-amber-500 font-bold">Paradise Administrative Panel</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-charcoal">
            Resort Administration
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Track real-time occupancy metrics, modify suite portfolios, confirm pending airport pick-ups, and review guest financial logs.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleSeedTestData}
            className="px-4 py-2 bg-charcoal text-white hover:bg-gold hover:text-charcoal border border-gold/20 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5"
          >
            <Database className="h-4 w-4" />
            Seed Database
          </button>
          <button
            onClick={() => {
              setModalMode("add");
              resetFormFields();
              setShowRoomModal(true);
            }}
            className="px-5 py-2 bg-gold hover:bg-gold/90 text-charcoal text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add New Suite
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Total revenue */}
        <div className="bg-white p-5 rounded-xl border border-gold/10 shadow-sm space-y-2 relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Total Est. Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-charcoal">₹{stats.totalRevenue}</span>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
              +12.4%
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[78%]"></div>
          </div>
        </div>

        {/* Total bookings */}
        <div className="bg-white p-5 rounded-xl border border-gold/10 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Total Bookings</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-charcoal">{stats.totalBookings} Reserved</span>
            <span className="text-amber-500 text-xs font-semibold">Active Season</span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[65%]"></div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-xl border border-gold/10 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Resort Occupancy</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-charcoal">{stats.occupancyRate}% Occupied</span>
            <span className="text-blue-500 text-xs font-semibold">Peak Season</span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[85%]"></div>
          </div>
        </div>

        {/* Cancellation statistics */}
        <div className="bg-white p-5 rounded-xl border border-gold/10 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Cancellations</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-charcoal">{stats.cancelledBookings} Cancelled</span>
            <span className="text-rose-500 text-xs font-semibold">Refunded</span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-[12%]"></div>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex border-b border-gold/20 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`px-5 py-3 border-b-2 font-serif text-sm font-semibold tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 ${
            activeTab === "rooms"
              ? "border-gold text-gold"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Suite Inventory ({rooms.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-3 border-b-2 font-serif text-sm font-semibold tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-gold text-gold"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Resort Guest Logs ({allBookings.length})
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 border-b-2 font-serif text-sm font-semibold tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 ${
            activeTab === "users"
              ? "border-gold text-gold"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          Registered Guest Database ({allUsers.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="animate-fadeIn">
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="h-5 w-5 text-gold shrink-0" />
              Suite Portfolio Manager
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div 
                  key={room.id} 
                  className="bg-white p-4 rounded-xl border border-gold/15 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <img src={(room.images && room.images[0]) || ""} alt={room.name} className="h-16 w-16 rounded object-cover border border-gold/10 shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm font-bold text-charcoal truncate">{room.name}</h4>
                      <span className="text-[9px] uppercase font-bold bg-gold/10 text-gold px-1.5 py-0.25 rounded shrink-0">{room.category}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">₹{room.price} / Night &bull; Up to {room.maxGuests} guests</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditRoomTrigger(room)}
                      className="p-1.5 bg-gray-50 text-gray-500 hover:text-gold rounded hover:bg-gold/10 transition-colors"
                      title="Edit Suite"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-1.5 bg-gray-50 text-gray-400 hover:text-rose-500 rounded hover:bg-rose-50 transition-colors"
                      title="Retire Suite"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
              <Calendar className="h-5 w-5 text-gold shrink-0" />
              Active Resort Guest Logs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-xl border border-gold/10 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] mb-2">
                      <span className="font-bold text-gold uppercase tracking-wider">ID: {booking.id}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded ${
                        booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-charcoal leading-tight">{booking.roomName}</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Guest: <strong className="text-charcoal">{booking.userName}</strong> ({booking.userEmail})</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Stay: {booking.checkIn} to {booking.checkOut}</span>
                      <span className="font-serif font-bold text-charcoal text-xs">₹{booking.totalPrice}</span>
                    </div>

                    {/* Admin quick triggers */}
                    {booking.status === "Confirmed" && (
                      <div className="flex justify-end gap-2 pt-2 mt-2 border-t border-gray-50">
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, "Cancelled")}
                          className="px-2.5 py-1 text-red-500 hover:bg-red-50 text-[9px] font-bold uppercase rounded border border-transparent hover:border-red-150"
                        >
                          Cancel / Refund
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
              <Users className="h-5 w-5 text-gold shrink-0" />
              Registered Guest Accounts
            </h3>

            <div className="bg-white rounded-xl border border-gold/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider text-[10px]">
                      <th className="p-4">Guest Profile</th>
                      <th className="p-4">Contact Email</th>
                      <th className="p-4">Account ID</th>
                      <th className="p-4">Staff Role</th>
                      <th className="p-4">Wishlist Items</th>
                      <th className="p-4">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-charcoal">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`}
                            alt={u.name}
                            className="h-9 w-9 rounded-full object-cover border border-gold/20"
                          />
                          <span className="font-bold">{u.name}</span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono">{u.email}</td>
                        <td className="p-4 text-gray-400 font-mono text-[10px]">{u.id}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin" 
                              ? "bg-amber-100 text-amber-800 border border-amber-200" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gold">
                          {(u.wishlist || []).length} rooms
                        </td>
                        <td className="p-4 text-gray-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Prior Session"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Elegant Add/Edit Room Modal Sheet */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gold/25 max-w-2xl w-full p-6 relative animate-zoomIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRoomModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-charcoal border-b border-gray-100 pb-3">
              {modalMode === "add" ? "Add New Luxury Suite" : "Edit Room Architecture"}
            </h3>

            <form onSubmit={handleSaveRoomSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Room Title</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Presidential Cliff Villa"
                    className="w-full p-2.5 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Suite Class</label>
                  <select
                    value={roomCategory}
                    onChange={(e) => setRoomCategory(e.target.value as RoomCategory)}
                    className="w-full p-2.5 border border-gray-300 rounded outline-none bg-white text-xs"
                  >
                    <option value={RoomCategory.DELUXE}>Deluxe</option>
                    <option value={RoomCategory.SUITE}>Suite</option>
                    <option value={RoomCategory.FAMILY}>Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Description Overview</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="Summarize structural highlights, premium layouts, scenic orientations..."
                  className="w-full p-2.5 border border-gray-300 rounded outline-none h-20 resize-none"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Price / Night</label>
                  <input
                    type="number"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Size (sqft)</label>
                  <input
                    type="number"
                    value={roomSize}
                    onChange={(e) => setRoomSize(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Bed Type</label>
                  <input
                    type="text"
                    value={roomBedType}
                    onChange={(e) => setRoomBedType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={roomMaxGuests}
                    onChange={(e) => setRoomMaxGuests(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <label className="text-[10px] uppercase font-bold text-gray-500">Includes Coastal Sea View:</label>
                <input
                  type="checkbox"
                  checked={roomSeaView}
                  onChange={(e) => setRoomSeaView(e.target.checked)}
                  className="accent-gold h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded text-xs uppercase font-bold tracking-wider hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold hover:bg-gold/95 text-charcoal rounded text-xs uppercase font-bold tracking-wider"
                >
                  Confirm & Save Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
