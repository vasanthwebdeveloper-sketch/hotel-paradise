export enum RoomCategory {
  DELUXE = "Deluxe",
  SUITE = "Suite",
  EXECUTIVE = "Executive",
  PRESIDENTIAL = "Presidential",
  FAMILY = "Family",
}

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  price: number; // Price in INR (₹)
  description: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  rating: number;
  reviewsCount: number;
  size: number; // square feet
  bedType: string;
  status: "Available" | "Booked" | "Maintenance";
  seaView: boolean;
  priceTrend: { month: string; price: number }[]; // For price prediction features
  featured: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  totalPrice: number;
  status: "Confirmed" | "Cancelled" | "Pending";
  couponCode?: string;
  createdAt: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface Review {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comments: string;
  likes: number;
  images?: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: "admin" | "user";
  wishlist: string[]; // roomIds
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  bookingsTrend: { date: string; bookings: number; revenue: number }[];
  categoryDistribution: { name: string; value: number }[];
}
