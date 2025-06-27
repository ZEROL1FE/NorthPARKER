// ───────────────────────────────────────────────────────────────
// server/server.js
// ───────────────────────────────────────────────────────────────
require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");

const app  = express();
const PORT = process.env.PORT || 10000;

// middleware
app.use(cors());
app.use(express.json());


const path = require("path");          // <─ add this import

// Serve static files from the Client folder
app.use(express.static(path.join(__dirname, "..", "..", "Client")));

// Optional SPA fallback (so refreshing /client-side.html works)
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "Client", "login.html")); // or index.html
});


// ───── Connect to MongoDB ─────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// ───── Mongoose models ─────
const userSchema = new mongoose.Schema({
  email   : { type: String, unique: true },
  password: String,
  name    : String,
  role    : { type: String, default: "user" },
});
const User = mongoose.model("User", userSchema);

const orderSchema = new mongoose.Schema(
  {
    table  : Number,
    userEmail: String,
    userName : String,
    items  : [{ name: String, qty: Number, price: Number }],
    status : { type: String, default: "pending" },

    // 🆕 payment info
    paymentMethod : { type: String, default: null },   // 'cash' | 'gcash' | 'card'
    paymentStatus : { type: String, default: "unpaid"} // 'unpaid' | 'paid'
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

const settingsSchema = new mongoose.Schema({
  tableLimits: {
    min: { type: Number, default: 1 },
    max: { type: Number, required: true }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

const menuSchema = new mongoose.Schema({
  name       : String,
  description: String,
  price      : Number,
  categories : [String],
  soldOut    : { type: Boolean, default: false },

  // NEW — keep one of the two:
  imageData  : String,   // base-64 payload (recommended for this project) OR
  // imageUrl: String    // external url if you later move to Cloudinary/S3
});

const Menu = mongoose.model("Menu", menuSchema);

const ratingSchema = new mongoose.Schema(
  {
    userId   : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName : String,                // display name or email
    ratings  : {                      // each 0-5
      food    : Number,
      service : Number,
      overall : Number
    },
    comments : String,
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

// ───── Auth middleware ─────

function authRequired(req, res, next) {
  const hdr   = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid / expired token" });
  }
}

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function adminOnly (req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
}

app.post("/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;

  // basic checks
  if (!email || !password || !name)
    return res.status(400).json({ error: "Missing required fields" });

  // reject duplicates
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashed,
    name,
    role: "user"
  });

  // auto-login right after sign-up (optional)
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(201).json({ token, role: user.role, name: user.name });
});
// ───── Auth routes ─────
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token, role: user.role, name: user.name });
});

app.post("/ratings", authRequired, async (req, res) => {
  const { ratings, comments } = req.body;
  if (!ratings) return res.status(400).json({ error: "Missing ratings" });

  const doc = await Rating.create({
    userId   : req.user.id,
    userName : req.user.name || req.user.email,
    ratings,
    comments : comments || ""
  });
  res.status(201).json(doc);
});

// ───── Protected order routes ─────




app.post("/orders", authRequired, async (req, res) => {
  const newOrder = await Order.create({
    ...req.body,
    userEmail: req.user?.email || "",
    userName : req.user?.name  || "",
  });
  res.status(201).json(newOrder);
});
app.get("/settings/table-limits", async (_, res) => {
  const doc = await Settings.findOne();
  if (!doc) return res.json({ min: 1, max: 20 }); // default fallback
  res.json(doc.tableLimits);
});

app.get("/orders", authRequired, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
app.get("/menu", async (_, res) => {
  const menu = await Menu.find().sort({ name: 1 });
  res.json(menu);
});
app.post("/menu", authRequired, async (req, res) => {
  // optional: adminOnly(req, res, next)
  const { name, price, description, categories, imageData } = req.body;

  if (!imageData?.startsWith("data:image/")) {
    return res.status(400).json({ error: "imageData must be a base-64 data URL" });
  }

  const doc = await Menu.create({
    name, price, description, categories, imageData, soldOut: false
  });

  res.status(201).json(doc);
});
app.post("/settings/table-limits", authRequired, adminOnly, async (req, res) => {
  const { min = 1, max } = req.body;
  if (!max || max < 1) return res.status(400).json({ error: "Invalid max" });

  let doc = await Settings.findOne();
  if (!doc) doc = new Settings();
  doc.tableLimits = { min, max };
  await doc.save();
  res.json(doc.tableLimits);
});

// Update an item by id    (PUT /menu/:id)
app.put('/menu/:id', authRequired, adminOnly,
  asyncHandler(async (req, res) => {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body,
                     { new:true, runValidators:true });
    if (!updated) return res.status(404).json({ error:'Item not found' });
    res.json(updated);
}));

// Delete an item by id    (DELETE /menu/:id)
app.delete('/menu/:id', authRequired, adminOnly,
  asyncHandler(async (req, res) => {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error:'Item not found' });
    res.json({ success:true });
}));

// --- route to mark an order as paid ---
app.patch("/orders/:id/pay", authRequired, async (req, res) => {
  const { method } = req.body;               // 'cash' | 'gcash' | 'card'
  if (!method) return res.status(400).json({ error: "Missing payment method" });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { paymentMethod: method, paymentStatus: "paid" },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: "Order not found" });

  res.json(order);
});

//route for default menu
const fs = require("fs");

app.post("/menu/reset-default", authRequired, adminOnly, async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../seed/defaultMenu.json");
    const defaultData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Clear current menu
    await Menu.deleteMany({});
    // Insert new defaults
    await Menu.insertMany(defaultData);

    res.json({ success: true, message: "Menu reset to default." });
  } catch (err) {
    console.error("Error resetting menu:", err);
    res.status(500).json({ error: "Failed to reset menu" });
  }
});

// ───── Startup ─────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});