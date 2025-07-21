const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../utils/Cloudinary_config.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
} = require("../middleware/middleware.js");

const {
  getDataListing,
  showListing,
  createListingForm,
  createListing,
  destroyListings,
  editForm,
  updateListing,
  SignupForm,
  Signup,
  LoginForm,
  logout,
} = require("../controllers/listingController.js");

const validateListing = require("../utils/validateListing.js");

// ---------- LISTING ROUTES ---------- //

// Show form to create a new listing
router.get("/listings/new", isLoggedIn, createListingForm);

// Create a new listing
router.post(
  "/listings",
  (req, res, next) => {
    upload.single("listings[image]")(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  },
  validateListing,
  createListing
);

// Show a single listing
router.get("/listings/:id", showListing);

// Show all listings
router.get("/", getDataListing);

// Show edit form
router.get("/listings/:id/edit", isLoggedIn, isOwner, editForm);

// Update a listing
router.put(
  "/listings/:id",
  isLoggedIn,
  validateListing,
  isOwner,
  updateListing
);

// Delete a listing
router.delete("/listings/:id", isLoggedIn, isOwner, destroyListings);

// ---------- AUTH ROUTES ---------- //

// Signup form
router.get("/signup", SignupForm);

// Handle signup logic
router.post("/signup", Signup);

// Login form
router.get("/login", LoginForm);

// Handle login logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = res.locals.redirectUserUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

// Logout
router.get("/logout", logout);

module.exports = router;
