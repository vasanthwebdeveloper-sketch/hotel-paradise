import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Room, Booking } from "../types";

interface SearchFilters {
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  category: string;
  maxPrice: number;
  seaView: boolean;
  query: string;
}

interface AppContextType {
  user: User | null;
  loadingUser: boolean;
  wishlist: string[];
  bookings: Booking[];
  rooms: Room[];
  loadingRooms: boolean;
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  toggleWishlist: (roomId: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchRooms: () => Promise<void>;
  createBooking: (bookingData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    couponCode?: string;
    paymentMethod?: string;
    transactionId?: string;
  }) => Promise<any>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  notification: { message: string; type: "success" | "error" | "info" | null };
  showNotification: (message: string, type: "success" | "error" | "info") => void;
  mockGoogleLogin: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // We pre-seed Vijay Vasanth as our primary user from user metadata for a frictionless experience
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" | null }>({
    message: "",
    type: null
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
    checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 Days later
    guestsCount: 2,
    category: "All",
    maxPrice: 15000,
    seaView: false,
    query: ""
  });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 5000);
  };

  // Fetch rooms on load
  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookings/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    }
  };

  // Restore user session on startup if saved in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const savedEmail = localStorage.getItem("user_email");
      if (savedEmail) {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: savedEmail })
          });
          if (res.ok) {
            const data = await res.json();
            const localAvatar = localStorage.getItem(`custom_avatar_${data.user.email}`);
            if (localAvatar) {
              data.user.avatar = localAvatar;
            }
            setUser(data.user);
            setWishlist(data.user.wishlist || []);
          }
        } catch (e) {
          console.error("Failed to restore session:", e);
        }
      }
      setLoadingUser(false);
    };
    restoreSession();
    fetchRooms();
  }, []);

  // Fetch bookings when user state changes
  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const login = async (email: string, password = "password"): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        // Merge custom avatar from localStorage
        const localAvatar = localStorage.getItem(`custom_avatar_${data.user.email}`);
        if (localAvatar) {
          data.user.avatar = localAvatar;
        }
        setUser(data.user);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem("user_email", data.user.email);
        showNotification(`Welcome back, ${data.user.name || "Guest"}!`, "success");
        return true;
      } else {
        const err = await res.json();
        showNotification(err.error || "Login failed", "error");
        return false;
      }
    } catch (e) {
      console.error("Login failed:", e);
      showNotification("Network error. Please try again.", "error");
      return false;
    }
  };

  const register = async (email: string, password = "password"): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        showNotification(`Account registered successfully! Please log in with your credentials.`, "success");
        return true;
      } else {
        const err = await res.json();
        showNotification(err.error || "Registration failed", "error");
        return false;
      }
    } catch (e) {
      console.error("Registration failed:", e);
      showNotification("Network error. Please try again.", "error");
      return false;
    }
  };

  const mockGoogleLogin = async () => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe (Google)",
          email: "john.doe@example.com",
          avatar: "https://lh3.googleusercontent.com/a/default-user"
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Merge custom avatar from localStorage
        const localAvatar = localStorage.getItem(`custom_avatar_${data.user.email}`);
        if (localAvatar) {
          data.user.avatar = localAvatar;
        }
        setUser(data.user);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem("user_email", data.user.email);
        showNotification("Successfully logged in with Google Account!", "success");
      }
    } catch (e) {
      console.error("Google Login failed:", e);
      showNotification("Google Authentication error", "error");
    }
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem("user_email");
    showNotification("Successfully logged out from Hotel Paradise.", "info");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const toggleWishlist = async (roomId: string) => {
    if (!user) {
      showNotification("Please login to manage your wishlist.", "info");
      return;
    }
    try {
      const res = await fetch("/api/auth/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, roomId })
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist);
        showNotification(
          data.wishlist.includes(roomId) ? "Added to your luxury wishlist!" : "Removed from your wishlist.",
          "success"
        );
      }
    } catch (e) {
      console.error("Wishlist toggle failed:", e);
    }
  };

  const createBooking = async (bookingData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    couponCode?: string;
    paymentMethod?: string;
    transactionId?: string;
  }) => {
    if (!user) {
      showNotification("Please login to complete your booking.", "error");
      return { error: "Login required" };
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingData, userId: user.id })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification("Luxury reservation successfully confirmed!", "success");
        await fetchBookings();
        return { booking: data.booking };
      } else {
        showNotification(data.error || "Reservation failed", "error");
        return { error: data.error };
      }
    } catch (e) {
      console.error("Booking failed:", e);
      showNotification("Network error while reserving", "error");
      return { error: "Network error" };
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });

      if (res.ok) {
        showNotification("Reservation successfully cancelled.", "info");
        await fetchBookings();
        return true;
      } else {
        const data = await res.json();
        showNotification(data.error || "Cancellation failed", "error");
        return false;
      }
    } catch (e) {
      console.error("Cancel failed:", e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        wishlist,
        bookings,
        rooms,
        loadingRooms,
        searchFilters,
        setSearchFilters,
        login,
        register,
        logout,
        toggleWishlist,
        fetchBookings,
        fetchRooms,
        createBooking,
        cancelBooking,
        notification,
        showNotification,
        mockGoogleLogin,
        updateUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
