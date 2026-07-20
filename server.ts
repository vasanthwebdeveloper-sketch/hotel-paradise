import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { RoomCategory, Room, Booking, Review, User, Blog, Coupon, ChatMessage } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with custom telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Database file path
const DB_FILE = path.join(process.cwd(), "src", "db", "db.json");

// Ensure db directory exists
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Interfaces for our Database Structure
interface Database {
  users: User[];
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  blogs: Blog[];
  coupons: Coupon[];
}

// Initial seed data
const initialData: Database = {
  users: [
    {
      id: "admin-1",
      name: "Admin Paradise",
      email: "admin@hotelparadise.com",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
      role: "admin",
      wishlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
      role: "user",
      wishlist: ["room-1", "room-5"],
      createdAt: new Date().toISOString()
    }
  ],
  rooms: [
    {
      id: "room-1",
      name: "Luxury Super Deluxe",
      category: RoomCategory.DELUXE,
      price: 4500,
      description: "Immerse yourself in complete luxury. The Luxury Super Deluxe features double-insulated glass walls overlooking our royal courtyard garden, high-thread-count Egyptian sheets, and high-speed Wi-Fi. Perfect for individuals or couples seeking premium tranquility.",
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "King Bed", "Minibar", "AC", "Smart TV", "Bathtub", "Ocean View", "Room Service"],
      maxGuests: 2,
      rating: 4.8,
      reviewsCount: 12,
      size: 420,
      bedType: "King Bed",
      status: "Available",
      seaView: true,
      priceTrend: [
        { month: "Jan", price: 4200 },
        { month: "Feb", price: 4300 },
        { month: "Mar", price: 4500 },
        { month: "Apr", price: 4800 },
        { month: "May", price: 5200 },
        { month: "Jun", price: 4500 }
      ],
      featured: true
    },
    {
      id: "room-2",
      name: "Simple Family Room",
      category: RoomCategory.FAMILY,
      price: 3900,
      description: "A functional, spacious room optimized for a family getaway. Offering two twin beds and one master king bed, a cozy study corner, and direct sliding door access to the main resort children's activity pool.",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "Double Beds", "AC", "Smart TV", "Mini Fridge", "Kids Toys Slot", "Safe"],
      maxGuests: 4,
      rating: 4.5,
      reviewsCount: 16,
      size: 550,
      bedType: "1 King + 2 Twin Beds",
      status: "Available",
      seaView: false,
      priceTrend: [
        { month: "Jan", price: 3800 },
        { month: "Feb", price: 3800 },
        { month: "Mar", price: 3900 },
        { month: "Apr", price: 4200 },
        { month: "May", price: 4600 },
        { month: "Jun", price: 3900 }
      ],
      featured: true
    },
    {
      id: "room-3",
      name: "Luxury Family Deluxe",
      category: RoomCategory.FAMILY,
      price: 6500,
      description: "Sophisticated styling meets expansive space in our premium Family Suite. Complete with an open-air balcony lounge, two elegant master bathrooms, a kitchen pantry corner, and continuous premium automated voice assistant integration.",
      images: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "2 King Beds", "Balcony Lounge", "Kitchenette", "2 Bathrooms", "AC", "Home Cinema", "Smart Voice Assistant"],
      maxGuests: 5,
      rating: 4.9,
      reviewsCount: 8,
      size: 720,
      bedType: "2 King Beds",
      status: "Available",
      seaView: true,
      priceTrend: [
        { month: "Jan", price: 6000 },
        { month: "Feb", price: 6100 },
        { month: "Mar", price: 6500 },
        { month: "Apr", price: 7000 },
        { month: "May", price: 7500 },
        { month: "Jun", price: 6500 }
      ],
      featured: false
    },
    {
      id: "room-4",
      name: "Single Super Deluxe",
      category: RoomCategory.DELUXE,
      price: 2800,
      description: "Tailored specifically for corporate travelers or solo backpackers, our Single Super Deluxe pairs a plush luxury Queen size bed with high-fidelity sound, an ergonomic workstation, and dynamic workstation setup.",
      images: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "Queen Bed", "Desk Workstation", "Ergonomic Chair", "AC", "Smart TV", "Coffee Machine"],
      maxGuests: 1,
      rating: 4.4,
      reviewsCount: 22,
      size: 310,
      bedType: "Queen Bed",
      status: "Available",
      seaView: false,
      priceTrend: [
        { month: "Jan", price: 2700 },
        { month: "Feb", price: 2750 },
        { month: "Mar", price: 2800 },
        { month: "Apr", price: 2900 },
        { month: "May", price: 3200 },
        { month: "Jun", price: 2800 }
      ],
      featured: false
    },
    {
      id: "room-5",
      name: "Presidential Royal Suite",
      category: RoomCategory.SUITE,
      price: 12500,
      description: "Our crown jewel. Hovering directly above the ocean coastline, this master suite boasts infinite panoramic views, a private heated infinity plunge pool, a private bar with professional butler service, and direct keyless entry.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "Grand Emperor Bed", "Plunge Pool", "Private Butler", "Cocktail Bar", "Bath Spa", "AC", "Surround Sound"],
      maxGuests: 3,
      rating: 5.0,
      reviewsCount: 5,
      size: 1100,
      bedType: "Emperor Bed",
      status: "Available",
      seaView: true,
      priceTrend: [
        { month: "Jan", price: 11000 },
        { month: "Feb", price: 11500 },
        { month: "Mar", price: 12500 },
        { month: "Apr", price: 14000 },
        { month: "May", price: 15500 },
        { month: "Jun", price: 12500 }
      ],
      featured: true
    },
    {
      id: "room-6",
      name: "Executive Horizon Penthouse",
      category: RoomCategory.SUITE,
      price: 9500,
      description: "Perfect for upscale business retreats or highly romantic getaways. Set on our top tier floor, the Horizon Penthouse offers premium 360-degree glass panoramas, deep jacuzzi tubs, automated mood lights, and personalized wine tasting menu access.",
      images: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities: ["Free Wi-Fi", "King Bed", "Jacuzzi Tub", "Espresso Machine", "AC", "Atmosphere Sound", "Automated Curtains"],
      maxGuests: 2,
      rating: 4.7,
      reviewsCount: 9,
      size: 850,
      bedType: "King Bed",
      status: "Available",
      seaView: true,
      priceTrend: [
        { month: "Jan", price: 9000 },
        { month: "Feb", price: 9200 },
        { month: "Mar", price: 9500 },
        { month: "Apr", price: 10500 },
        { month: "May", price: 11500 },
        { month: "Jun", price: 9500 }
      ],
      featured: false
    }
  ],
  bookings: [
    {
      id: "book-1",
      roomId: "room-1",
      roomName: "Luxury Super Deluxe",
      roomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=400",
      userId: "user-1",
      userName: "Vijay Vasanth",
      userEmail: "vasanthvijay911@gmail.com",
      checkIn: "2026-08-10",
      checkOut: "2026-08-14",
      guestsCount: 2,
      totalPrice: 18000,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: "rev-1",
      roomId: "room-1",
      userId: "user-1",
      userName: "Vijay Vasanth",
      userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vijay",
      rating: 5,
      comments: "This room is absolutely brilliant! The floor-to-ceiling glass wall gave me an breathtaking sunrise view of the sea. The Egyptian sheets are extremely soft, and the room automated assistant handles everything flawlessly. Definitely coming back!",
      likes: 5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "rev-2",
      roomId: "room-1",
      userId: "user-3",
      userName: "Aishwarya Sen",
      userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aishwarya",
      rating: 4,
      comments: "Extremely tidy, highly luxury vibes, and prompt room service. The smart assistant is helpful but could occasionally take a second to load. Overall a lovely weekend escape.",
      likes: 2,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "rev-3",
      roomId: "room-2",
      userId: "user-4",
      userName: "Karthik Raja",
      userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Karthik",
      rating: 5,
      comments: "Highly recommend for anyone with young kids! Direct pool access was a lifesaver. Extremely safe layout, clean bathrooms, and complimentary fresh juices every afternoon. The staff made us feel like royalty.",
      likes: 8,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "5 Hidden Spots to Explore Around Ooty",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
      excerpt: "Beyond the common tourist hubs, Ooty hides incredible secret trails, tea estate bungalows, and silent valleys. Here is your insider guide.",
      content: "When traveling to Ooty, most tourists crowd around the Botanical Garden or the popular Ooty Lake. However, true serene beauty lies off the beaten track. Here are 5 secret gems: 1. Cairn Hill Forest: A silent sanctuary of old pine trees, great for listening to wind and birds. 2. Avalanche Lake Valley: Pristine waters surrounded by dense Shola forests. 3. Needle Rock Viewpoint: Offering a 360-degree overlook of the Mudumalai sanctuary and surrounding states. 4. Pykara waterfalls secret upper stream. 5. Silent Valley tea trail paths.",
      date: "2026-07-15",
      category: "Travel Guide"
    },
    {
      id: "blog-2",
      title: "The Ultimate Guide to Luxury Fine Dining",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
      excerpt: "What makes luxury fine dining special? From custom molecular gastronomy to hand-picked vintage wines, we unlock the secret culinary experiences.",
      content: "Fine dining is more than just feeding yourself; it is sensory art. At Hotel Paradise, our five-star chef focuses on hyper-local ingredients paired with global classical French cooking techniques. Every plate is customized for temperature, aroma, and visual plating perfection.",
      date: "2026-07-01",
      category: "Culinary"
    }
  ],
  coupons: [
    {
      code: "PARADISE20",
      discountPercent: 20,
      description: "Enjoy a flat 20% discount on all suites and deluxe room categories.",
      validUntil: "2026-12-31"
    },
    {
      code: "WELCOME10",
      discountPercent: 10,
      description: "Introductory 10% discount for first-time guests.",
      validUntil: "2026-10-31"
    }
  ]
};

// Database local controller
const getDb = (): Database => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read database, falling back to initial data:", e);
    return initialData;
  }
};

const saveDb = (data: Database) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Helper to determine if an email represents an admin
const isEmailAdmin = (emailStr: string): boolean => {
  const normalized = emailStr.toLowerCase().trim();
  return (
    normalized === "admin@hotelparadise.com" || 
    normalized.startsWith("admin@") || 
    normalized.split("@")[0] === "admin"
  );
};

// --- AUTHENTICATION ROUTES ---
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const derivedName = email.split("@")[0];
  const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: capitalizedName,
    email: normalizedEmail,
    password: password,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(capitalizedName)}`,
    role: isEmailAdmin(normalizedEmail) ? "admin" : "user",
    wishlist: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  res.status(201).json({ user: newUser, token: "mock-jwt-token" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(400).json({ error: "Account not found. Please register first." });
  }

  // If user exists but doesn't have a password in the DB (like seed users), save the password they entered as their password
  if (!user.password) {
    user.password = password;
    saveDb(db);
  } else if (user.password !== password) {
    return res.status(401).json({ error: "Incorrect password. Please try again." });
  }

  // If the email is an admin email, dynamically ensure they have the admin role
  if (isEmailAdmin(normalizedEmail) && user.role !== "admin") {
    user.role = "admin";
    saveDb(db);
  }

  res.status(200).json({ user, token: "mock-jwt-token" });
});

// Mock google sign in
app.post("/api/auth/google", (req, res) => {
  const { name, email, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const db = getDb();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `user-${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
      role: "user",
      wishlist: [],
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveDb(db);
  }

  res.status(200).json({ user, token: "mock-jwt-token" });
});

// Update profile
app.put("/api/auth/profile", (req, res) => {
  const { userId, name, avatar } = req.body;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) db.users[userIndex].name = name;
  if (avatar) db.users[userIndex].avatar = avatar;

  saveDb(db);
  res.status(200).json({ user: db.users[userIndex] });
});

// Update Wishlist
app.post("/api/auth/wishlist", (req, res) => {
  const { userId, roomId } = req.body;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];
  const itemIndex = user.wishlist.indexOf(roomId);
  if (itemIndex > -1) {
    user.wishlist.splice(itemIndex, 1); // Remove
  } else {
    user.wishlist.push(roomId); // Add
  }

  saveDb(db);
  res.status(200).json({ wishlist: user.wishlist });
});


// --- ROOMS ROUTES ---
app.get("/api/rooms", (req, res) => {
  const db = getDb();
  res.json(db.rooms);
});

app.get("/api/rooms/:id", (req, res) => {
  const db = getDb();
  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json(room);
});

// AI Room Recommendations based on criteria
app.post("/api/rooms/recommend", async (req, res) => {
  const { budget, travelers, purpose, oceanPreference } = req.body;
  const db = getDb();

  // We can construct a smart response schema using Gemini to choose the best room ID from our list!
  const prompt = `Given the following available hotel rooms:
${JSON.stringify(db.rooms.map(r => ({ id: r.id, name: r.name, category: r.category, price: r.price, amenities: r.amenities, maxGuests: r.maxGuests, description: r.description })))}

Recommend the best rooms for a customer with these preferences:
- Budget: ${budget ? `₹${budget}` : "Any"}
- Travelers: ${travelers || "Any"}
- Purpose (e.g. Honeymoon, Family, Business, Couple): ${purpose || "Leisure"}
- Ocean View Prefered? ${oceanPreference ? "Yes" : "Doesn't matter"}

Provide a JSON array containing the selected room IDs (sorted by best fit) and a concise, personalized, high-end design-focused explanation for why this is the perfect recommendation for them.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedRoomIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Room IDs recommended based on the user's criteria."
            },
            explanation: {
              type: Type.STRING,
              description: "A gorgeous, design-focused explanation justifying the recommendation."
            }
          },
          required: ["recommendedRoomIds", "explanation"]
        }
      }
    });

    const recommendation = JSON.parse(response.text || "{}");
    res.json(recommendation);
  } catch (e) {
    console.error("AI recommendation failed, falling back to heuristic:", e);
    // Simple fallback heuristic
    const filtered = db.rooms.filter(r => {
      if (budget && r.price > budget) return false;
      return true;
    });
    res.json({
      recommendedRoomIds: filtered.map(r => r.id).slice(0, 2),
      explanation: "We selected our most popular luxury rooms that align perfectly with your budget and requirements."
    });
  }
});


// --- BOOKINGS ROUTES ---
app.post("/api/bookings", (req, res) => {
  const { roomId, userId, checkIn, checkOut, guestsCount, couponCode, paymentMethod, transactionId } = req.body;
  if (!roomId || !userId || !checkIn || !checkOut || !guestsCount) {
    return res.status(400).json({ error: "Missing required booking details" });
  }

  const db = getDb();
  const room = db.rooms.find(r => r.id === roomId);
  const user = db.users.find(u => u.id === userId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Basic check for room guest capacity
  if (guestsCount > room.maxGuests) {
    return res.status(400).json({ error: `This room accommodates maximum of ${room.maxGuests} guests.` });
  }

  // Check overlap bookings
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const daysCount = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysCount <= 0) {
    return res.status(400).json({ error: "Check-out date must be after check-in date" });
  }

  const overlapping = db.bookings.find(b => {
    if (b.roomId !== roomId || b.status === "Cancelled") return false;
    const bIn = new Date(b.checkIn);
    const bOut = new Date(b.checkOut);
    return (checkInDate < bOut && checkOutDate > bIn);
  });

  if (overlapping) {
    return res.status(400).json({ error: "The room is booked for the selected dates." });
  }

  // Price Calculation
  let basePrice = room.price * daysCount;
  let finalPrice = basePrice;
  let appliedDiscount = 0;

  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      appliedDiscount = (basePrice * coupon.discountPercent) / 100;
      finalPrice = basePrice - appliedDiscount;
    }
  }

  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    roomId,
    roomName: room.name,
    roomImage: room.images[0],
    userId,
    userName: user.name,
    userEmail: user.email,
    checkIn,
    checkOut,
    guestsCount,
    totalPrice: finalPrice,
    status: "Confirmed",
    couponCode: couponCode || undefined,
    createdAt: new Date().toISOString(),
    paymentMethod: paymentMethod || undefined,
    transactionId: transactionId || undefined
  };

  db.bookings.push(newBooking);
  saveDb(db);

  res.status(201).json({ booking: newBooking });
});

app.get("/api/bookings/user/:userId", (req, res) => {
  const db = getDb();
  const userBookings = db.bookings.filter(b => b.userId === req.params.userId);
  res.json(userBookings);
});

app.post("/api/bookings/cancel", (req, res) => {
  const { bookingId } = req.body;
  const db = getDb();
  const index = db.bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  db.bookings[index].status = "Cancelled";
  saveDb(db);
  res.json({ success: true, booking: db.bookings[index] });
});


// --- REVIEWS ROUTES ---
app.get("/api/reviews/:roomId", (req, res) => {
  const db = getDb();
  const roomReviews = db.reviews.filter(r => r.roomId === req.params.roomId);
  res.json(roomReviews);
});

app.post("/api/reviews", (req, res) => {
  const { roomId, userId, rating, comments } = req.body;
  if (!roomId || !userId || !rating || !comments) {
    return res.status(400).json({ error: "Missing review fields" });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    roomId,
    userId,
    userName: user.name,
    userAvatar: user.avatar,
    rating,
    comments,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  db.reviews.push(newReview);

  // Recalculate room rating
  const roomIndex = db.rooms.findIndex(r => r.id === roomId);
  if (roomIndex > -1) {
    const rReviews = db.reviews.filter(rev => rev.roomId === roomId);
    const sum = rReviews.reduce((acc, curr) => acc + curr.rating, 0);
    db.rooms[roomIndex].rating = Number((sum / rReviews.length).toFixed(1));
    db.rooms[roomIndex].reviewsCount = rReviews.length;
  }

  saveDb(db);
  res.status(201).json(newReview);
});

app.post("/api/reviews/like", (req, res) => {
  const { reviewId } = req.body;
  const db = getDb();
  const index = db.reviews.findIndex(r => r.id === reviewId);
  if (index === -1) {
    return res.status(404).json({ error: "Review not found" });
  }
  db.reviews[index].likes += 1;
  saveDb(db);
  res.json({ success: true, likes: db.reviews[index].likes });
});

// AI Review Summary for a room on the fly
app.get("/api/reviews/summary/:roomId", async (req, res) => {
  const db = getDb();
  const roomReviews = db.reviews.filter(r => r.roomId === req.params.roomId);

  if (roomReviews.length === 0) {
    return res.json({ summary: "No reviews available yet to summarize." });
  }

  const reviewTexts = roomReviews.map(r => `[Rating: ${r.rating}/5]: "${r.comments}"`).join("\n");
  const prompt = `Synthesize and summarize the following guest reviews for a luxury hotel room into a single concise paragraph. Keep it classy, focus on key positives (staff, bed, view, cleanness) and highlight any recurring notes (even minor constructive points):
${reviewTexts}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });
    res.json({ summary: response.text || "No summary generated." });
  } catch (e) {
    console.error("AI review summary failed:", e);
    res.json({ summary: "Guests highly praise the room's elegant decor, pristine cleanliness, and the breathtaking views offered by the floor-to-ceiling windows." });
  }
});


// --- ADMIN PANELS ROUTE ---
app.get("/api/admin/stats", (req, res) => {
  const db = getDb();
  const totalUsers = db.users.length;
  const totalBookings = db.bookings.length;
  const totalRevenue = db.bookings
    .filter(b => b.status === "Confirmed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Compute occupancy rate (e.g., booked rooms vs total rooms)
  const activeBookings = db.bookings.filter(b => {
    if (b.status === "Cancelled") return false;
    const now = new Date();
    return (now >= new Date(b.checkIn) && now <= new Date(b.checkOut));
  });
  const occupancyRate = db.rooms.length > 0 ? Math.round((activeBookings.length / db.rooms.length) * 100) : 0;

  // Simple trends
  const bookingsTrend = [
    { date: "Jul 15", bookings: 1, revenue: 18000 },
    { date: "Jul 16", bookings: 0, revenue: 0 },
    { date: "Jul 17", bookings: 1, revenue: 4500 },
    { date: "Jul 18", bookings: 2, revenue: 8400 },
    { date: "Jul 19", bookings: totalBookings, revenue: totalRevenue }
  ];

  const categories = db.rooms.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = Object.keys(categories).map(cat => ({
    name: cat,
    value: categories[cat]
  }));

  res.json({
    totalUsers,
    totalBookings,
    totalRevenue,
    occupancyRate,
    bookingsTrend,
    categoryDistribution
  });
});

app.get("/api/admin/users", (req, res) => {
  const db = getDb();
  res.json(db.users || []);
});

// --- BOOKINGS ADMINISTRATION ---
app.get("/api/bookings", (req, res) => {
  const db = getDb();
  res.json(db.bookings || []);
});

app.get("/api/admin/bookings", (req, res) => {
  const db = getDb();
  res.json(db.bookings || []);
});

app.put("/api/admin/bookings/:id", (req, res) => {
  const { status } = req.body;
  const db = getDb();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  db.bookings[index].status = status;
  saveDb(db);
  res.json(db.bookings[index]);
});

// --- SEED DATABASE RESTORATION ---
app.post("/api/admin/seed", (req, res) => {
  try {
    // deep clone initialData before saving to avoid mutated object references
    const clonedData = JSON.parse(JSON.stringify(initialData));
    saveDb(clonedData);
    res.json({ success: true, message: "Paradise database successfully reset to luxury seed metrics!" });
  } catch (err: any) {
    console.error("Failed to seed database:", err);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

// --- ROOMS ADMINISTRATION (SUPPORT BOTH ROOT AND ADMIN PREFIX PATHS) ---
const handleCreateRoom = (req: express.Request, res: express.Response) => {
  const { name, category, price, description, images, amenities, maxGuests, size, bedType, seaView } = req.body;
  if (!name || !category || !price || !description) {
    return res.status(400).json({ error: "Missing required room fields" });
  }

  const db = getDb();
  const newRoom: Room = {
    id: `room-${Date.now()}`,
    name,
    category,
    price: Number(price),
    description,
    images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200"],
    amenities: amenities || ["Free Wi-Fi", "AC", "Smart TV"],
    maxGuests: Number(maxGuests || 2),
    rating: 5.0,
    reviewsCount: 0,
    size: Number(size || 350),
    bedType: bedType || "King Bed",
    status: "Available",
    seaView: !!seaView,
    priceTrend: [
      { month: "Jan", price: Number(price) },
      { month: "Feb", price: Number(price) },
      { month: "Mar", price: Number(price) },
      { month: "Apr", price: Number(price) },
      { month: "May", price: Number(price) },
      { month: "Jun", price: Number(price) }
    ],
    featured: false
  };

  db.rooms.push(newRoom);
  saveDb(db);
  res.status(201).json(newRoom);
};

app.post("/api/admin/rooms", handleCreateRoom);
app.post("/api/rooms", handleCreateRoom);

const handleUpdateRoom = (req: express.Request, res: express.Response) => {
  const db = getDb();
  const idx = db.rooms.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Room not found" });
  }

  const updatedRoom = { ...db.rooms[idx], ...req.body };
  db.rooms[idx] = updatedRoom;
  saveDb(db);
  res.json(updatedRoom);
};

app.put("/api/admin/rooms/:id", handleUpdateRoom);
app.put("/api/rooms/:id", handleUpdateRoom);

const handleDeleteRoom = (req: express.Request, res: express.Response) => {
  const db = getDb();
  const idx = db.rooms.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Room not found" });
  }
  const deleted = db.rooms.splice(idx, 1);
  saveDb(db);
  res.json({ success: true, deleted: deleted[0] });
};

app.delete("/api/admin/rooms/:id", handleDeleteRoom);
app.delete("/api/rooms/:id", handleDeleteRoom);


// --- OTHER AUX ROUTES ---
app.get("/api/blogs", (req, res) => {
  const db = getDb();
  res.json(db.blogs);
});

app.get("/api/coupons", (req, res) => {
  const db = getDb();
  res.json(db.coupons);
});


// --- AI INTERACTIVE FEATURES (CHATBOT & TRIP PLANNER) ---
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const db = getDb();

  // Load all rooms to inject knowledge
  const roomsData = db.rooms.map(r => ({
    id: r.id,
    name: r.name,
    price: r.price,
    category: r.category,
    amenities: r.amenities,
    maxGuests: r.maxGuests,
    seaView: r.seaView
  }));

  const systemInstruction = `You are "Hotel Paradise Concierge", an elite, deeply helpful, and sophisticated AI Assistant for the luxury Hotel Paradise resort.
We are located in a stunning, scenic coastal area (with private white beaches, tropical cliff gardens, and close proximity to Ooty and regional tea trail sights).

Here is your absolute source-of-truth knowledge base about the resort:
- Current available rooms: ${JSON.stringify(roomsData)}
- Features/Offerings: Complimentary gourmet breakfast for deluxe/suite room types, ultra-fast 1Gbps mesh Wi-Fi, modern spa treatments, a cliffside open-air infinity pool, private butler service for Presidential Suite, and airport transit shuttle service.
- Active coupon codes:
  * "PARADISE20" -> flat 20% discount on any booking.
  * "WELCOME10" -> flat 10% discount for first-time guests.
- Local activities / nearby sights: Cairn Hill Pine Forest, Pykara waterfall stream, private estate tea wine tastings, botanical bird watching.

You must:
1. Always maintain a highly sophisticated, welcoming, and elite luxury service persona.
2. If requested to help plan trips or itineraries, design a custom day-by-day sequence of high-end recommendations (e.g. 3 Days in Ooty: Day 1 Check-in & botanical tea lounge, Day 2 Pykara waterfall and hike, Day 3 Cliffside Spa and candlelit dinner).
3. If requested to recommend a room, suggest the most matching room from the available list with prices, and write their ID verbatim in format [RECOMMEND: room-id] so the UI can highlight it!
4. Keep answers extremely elegant, structured, clear, and scannable. Format with bold keys and clean spacing.`;

  try {
    // Reconstruct chat history in the format Gemini expect
    const contents: any[] = [];
    if (history && history.length > 0) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Append the latest user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I am currently at your luxury service. How may I assist you today?" });
  } catch (e: any) {
    console.error("Gemini AI Chatbot failed:", e);
    res.json({ reply: "I apologize, but my connectivity to our server concierge is temporarily delayed. Rest assured, breakfast is complimentary for our Deluxe and Suite rooms, and we have premium rooms starting at ₹2800 per night. How can I assist you otherwise?" });
  }
});


// Smart Search Parser: takes natural language query and maps to query filters
app.post("/api/chat/smart-search", async (req, res) => {
  const { query } = req.body;
  const db = getDb();

  const prompt = `Map the following user search query for a hotel booking website to concrete search filters:
Query: "${query}"

Valid room categories: "Deluxe", "Suite", "Family"

Output a strictly formatted JSON object with these properties:
- budget: number or null (e.g. if under 5000, budget is 5000)
- category: string or null (one of Deluxe, Suite, Family)
- seaView: boolean or null
- guestsCount: number or null
- sort: "price_low" | "price_high" | "rating" | null`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budget: { type: Type.NUMBER },
            category: { type: Type.STRING },
            seaView: { type: Type.BOOLEAN },
            guestsCount: { type: Type.NUMBER },
            sort: { type: Type.STRING, enum: ["price_low", "price_high", "rating"] }
          }
        }
      }
    });

    const filters = JSON.parse(response.text || "{}");
    res.json(filters);
  } catch (e) {
    console.error("AI smart search mapping failed:", e);
    res.json({});
  }
});


// --- INITIALIZE INTEGRATION OR SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve fallback index.html for React Router
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hotel Paradise luxury server running on port ${PORT}`);
  });
}

startServer();
