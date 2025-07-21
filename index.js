const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");
const connectDb = require("./database/db.js");
const dotenv = require("dotenv");
dotenv.config();

// Routes
const listingRoutes = require("./routes/listingsRoute.js");
const reviewRoutes = require("./routes/reviewRoutes.js");

// Third-party Middleware
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
// User Model for Auth
const User = require("./model/user.js");

// Connect to MongoDB
connectDb();
const DbUrl = process.env.MONGO_URL;
// Template Engine Setup
app.engine("ejs", ejsMate); // Support for EJS partials/layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Static Files & Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

const store = MongoStore.create({
  mongoUrl: DbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
// Session Configuration
const sessionOption = {
  store,
  secret: process.env.SESSION_SECRET, // Should be stored in env in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

// Passport Auth Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // Local Strategy for login
passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// Global Middleware to pass flash messages & logged-in user to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Current logged-in user
  next();
});

// Main Routes
app.use("/", listingRoutes);
app.use("/", reviewRoutes);

// Error Handling Middleware (fallback)
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
