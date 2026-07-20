import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Room, RoomCategory } from "../types";
import { Link } from "react-router-dom";
import { 
  SlidersHorizontal, 
  Grid, 
  List, 
  Heart, 
  Sparkles, 
  Eye, 
  Compass, 
  CheckCircle2, 
  X, 
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function RoomListing() {
  const { rooms, loadingRooms, toggleWishlist, wishlist, searchFilters, setSearchFilters, showNotification } = useApp();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState(searchFilters.category);
  const [maxPrice, setMaxPrice] = useState(searchFilters.maxPrice);
  const [seaViewOnly, setSeaViewOnly] = useState(searchFilters.seaView);
  const [sortBy, setSortBy] = useState<string>("rating");

  // Comparison State
  const [compareList, setCompareList] = useState<Room[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  // Sync state with global search filters on mount or when searchFilters update
  useEffect(() => {
    setSelectedCategory(searchFilters.category);
    setMaxPrice(searchFilters.maxPrice);
    setSeaViewOnly(searchFilters.seaView);
  }, [searchFilters]);

  // Apply filters
  const filteredRooms = rooms
    .filter((room) => {
      // Category check
      if (selectedCategory !== "All" && room.category !== selectedCategory) return false;
      // Price check
      if (room.price > maxPrice) return false;
      // Sea view check
      if (seaViewOnly && !room.seaView) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice(15000);
    setSeaViewOnly(false);
    setSortBy("rating");
    setSearchFilters(prev => ({
      ...prev,
      category: "All",
      maxPrice: 15000,
      seaView: false
    }));
    showNotification("Filters reset to default luxury standard.", "info");
  };

  const toggleCompare = (room: Room) => {
    const exists = compareList.find((r) => r.id === room.id);
    if (exists) {
      setCompareList(compareList.filter((r) => r.id !== room.id));
    } else {
      if (compareList.length >= 3) {
        showNotification("You can compare up to 3 luxury rooms side-by-side.", "error");
        return;
      }
      setCompareList([...compareList, room]);
      setShowCompareDrawer(true);
    }
  };

  const isComparing = (roomId: string) => {
    return !!compareList.find((r) => r.id === roomId);
  };

  return (
    <div className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-gold/15 pb-6">
        <div className="space-y-1.5">
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-gold font-bold">Paradise Sanctuary</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-charcoal">
            Find Your Retreat
          </h1>
          <p className="text-xs text-gray-400 font-light max-w-xl">
            Browse our list of available rooms and customizable ocean suites. Use our comparison engine to analyze details side-by-side.
          </p>
        </div>

        {/* Layout controls & Sort */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center border border-gold/20 rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-gold text-charcoal" : "hover:bg-gold/10 text-gray-400"}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-gold text-charcoal" : "hover:bg-gold/10 text-gray-400"}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 border border-gold/20 rounded-md px-3 py-1.5 bg-white text-xs text-charcoal font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-gold shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="rating">Sort: High Rating</option>
              <option value="price_low">Sort: Price Low-High</option>
              <option value="price_high">Sort: Price High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-gold/15 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="font-serif text-base font-bold text-charcoal flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-gold" />
              Custom Filter
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-gold hover:text-accent-brown flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-gray-500">Suite Categories</label>
            <div className="flex flex-col gap-2 pt-1.5">
              {["All", RoomCategory.DELUXE, RoomCategory.SUITE, RoomCategory.FAMILY].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-3 py-2 rounded-md transition-all flex justify-between items-center ${
                    selectedCategory === cat
                      ? "bg-gold/10 text-gold font-bold border-l-4 border-gold"
                      : "text-gray-600 hover:bg-gold/15 hover:text-gold font-medium"
                  }`}
                >
                  <span>{cat} Category</span>
                  <span className="text-[10px] text-gray-400">
                    ({cat === "All" ? rooms.length : rooms.filter(r => r.category === cat).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <label className="uppercase font-bold tracking-wider text-gray-500">Max Budget</label>
              <span className="font-serif font-bold text-gold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={2500}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹2,500</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Ocean View Toggle */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Sea View Only</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Filter for coastal panoramas</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seaViewOnly}
                onChange={(e) => setSeaViewOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gold/35 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>
        </div>

        {/* Rooms Listing List */}
        <div className="lg:col-span-3">
          {loadingRooms ? (
            <div className="space-y-6">
              {[1, 2].map(n => (
                <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gold/10 space-y-4">
              <Compass className="h-12 w-12 text-gold/55 mx-auto animate-spin" />
              <h3 className="font-serif text-xl font-bold text-charcoal">No retreats found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No matching room formats align with your selected filters. Try resetting the price slider or categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-gold text-charcoal text-xs font-bold uppercase tracking-wider rounded-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-md border border-gold/10 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={(room.images && room.images[0]) || null}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-charcoal/85 backdrop-blur-sm text-[9px] uppercase tracking-widest text-gold font-bold px-2.5 py-1 rounded">
                        {room.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={() => toggleWishlist(room.id)}
                        className="p-1.5 bg-white/95 text-gray-400 hover:text-rose-500 rounded-full shadow transition-colors"
                        title="Save to Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${wishlist.includes(room.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded shadow">
                      <span className="font-serif text-base font-bold text-charcoal">₹{room.price}</span>
                      <span className="text-[10px] text-gray-500"> / Night</span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gold">
                          {"★".repeat(Math.round(room.rating))}
                          <span className="text-[11px] text-gray-400 font-semibold ml-1">({room.rating})</span>
                        </div>
                        {room.seaView && (
                          <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded">Sea View</span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-charcoal mt-1 group-hover:text-gold transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-light mt-1.5 line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    {/* Amenities list */}
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[8px] px-2 py-0.5 bg-gray-50 rounded text-gray-500">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between">
                      <button
                        onClick={() => toggleCompare(room)}
                        className={`text-[10px] font-bold tracking-wider uppercase transition-colors px-2 py-1.5 rounded ${
                          isComparing(room.id)
                            ? "bg-gold text-charcoal"
                            : "bg-gray-100 text-gray-500 hover:bg-gold/10 hover:text-gold"
                        }`}
                      >
                        {isComparing(room.id) ? "Comparing ✓" : "Compare Suite"}
                      </button>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="text-xs font-bold text-gold hover:text-accent-brown flex items-center gap-1 group/btn"
                      >
                        Reserve Room
                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List Layout */
            <div className="space-y-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-md border border-gold/10 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
                >
                  <div className="relative h-48 md:h-auto md:w-80 shrink-0 overflow-hidden">
                    <img
                      src={(room.images && room.images[0]) || null}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-charcoal/85 backdrop-blur-sm text-[9px] uppercase tracking-widest text-gold font-bold px-2.5 py-1 rounded">
                      {room.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gold">
                          {"★".repeat(Math.round(room.rating))}
                          <span className="text-xs text-gray-400 font-semibold ml-1">({room.rating})</span>
                        </div>
                        <span className="font-serif text-lg font-bold text-gold">₹{room.price} <span className="text-[10px] text-gray-400 font-sans lowercase">/ Night</span></span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-charcoal mt-1 group-hover:text-gold transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-light mt-2 line-clamp-3">
                        {room.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {room.amenities.slice(0, 5).map((a, i) => (
                        <span key={i} className="text-[9px] px-2.5 py-1 bg-cream/30 border border-gold/10 rounded-full text-accent-brown">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {room.size} sqft &bull; {room.bedType} &bull; Up to {room.maxGuests} guests
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCompare(room)}
                          className={`text-[10px] font-bold uppercase transition-colors px-3 py-1.5 rounded ${
                            isComparing(room.id) ? "bg-gold text-charcoal" : "bg-gray-100 hover:bg-gold/15"
                          }`}
                        >
                          Compare
                        </button>
                        <Link
                          to={`/rooms/${room.id}`}
                          className="px-4 py-2 bg-gold hover:bg-gold/90 text-charcoal font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Drawer / Side Sheet */}
      {showCompareDrawer && compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gold shadow-2xl p-6 transform transition-transform animate-slideUp max-h-[50vh] overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-gold/10 rounded text-gold shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                <h3 className="font-serif text-lg font-bold text-charcoal">Compare Rooms ({compareList.length}/3)</h3>
              </div>
              <button
                onClick={() => setShowCompareDrawer(false)}
                className="p-1 text-gray-400 hover:text-charcoal rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Parameters Label column */}
              <div className="hidden md:flex flex-col justify-around text-xs font-bold text-gray-400 uppercase tracking-wider space-y-4 py-2 bg-gray-50 p-4 rounded-lg">
                <div>Room Name</div>
                <div className="border-t border-gray-200/50 pt-2">Price / Night</div>
                <div className="border-t border-gray-200/50 pt-2">Category</div>
                <div className="border-t border-gray-200/50 pt-2">Capacity</div>
                <div className="border-t border-gray-200/50 pt-2">Room Size</div>
                <div className="border-t border-gray-200/50 pt-2">Amenities</div>
                <div className="border-t border-gray-200/50 pt-2">Action</div>
              </div>

              {/* Compared rooms */}
              {compareList.map((room) => (
                <div key={room.id} className="border border-gold/15 p-4 rounded-xl relative space-y-4 shadow-sm bg-white">
                  <button
                    onClick={() => toggleCompare(room)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    title="Remove Comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <img src={(room.images && room.images[0]) || null} alt={room.name} className="h-12 w-12 rounded object-cover border border-gold/20" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-charcoal line-clamp-1">{room.name}</h4>
                      <span className="text-[10px] text-gold font-bold">₹{room.price} / Night</span>
                    </div>
                  </div>

                  {/* Responsive parameters for small screens / standard list */}
                  <div className="text-xs space-y-2.5 pt-2">
                    <div className="flex justify-between md:block">
                      <span className="text-gray-400 md:hidden font-semibold">Category: </span>
                      <span className="font-semibold text-gray-700">{room.category}</span>
                    </div>
                    <div className="flex justify-between md:block border-t border-gray-100 pt-2 md:pt-0">
                      <span className="text-gray-400 md:hidden font-semibold">Max Guests: </span>
                      <span className="font-semibold text-gray-700">{room.maxGuests} Guests</span>
                    </div>
                    <div className="flex justify-between md:block border-t border-gray-100 pt-2 md:pt-0">
                      <span className="text-gray-400 md:hidden font-semibold">Room Size: </span>
                      <span className="font-semibold text-gray-700">{room.size} Sqft</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 md:pt-0">
                      <span className="text-gray-400 md:hidden font-semibold">Amenities: </span>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{room.amenities.slice(0, 4).join(", ")}</p>
                    </div>
                  </div>

                  <Link
                    to={`/rooms/${room.id}`}
                    className="block w-full text-center py-2 bg-charcoal hover:bg-gold hover:text-charcoal text-white font-bold text-[10px] uppercase tracking-wider rounded shadow transition-colors"
                  >
                    View & Reserve Suite
                  </Link>
                </div>
              ))}

              {/* Empty placeholder slot to encourage comparison */}
              {compareList.length < 3 && (
                <div className="border-2 border-dashed border-gold/25 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[160px]">
                  <SlidersHorizontal className="h-6 w-6 text-gold/30 shrink-0" />
                  <p className="text-[10px] text-gray-400">Add another luxury suite to compare features side-by-side.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
