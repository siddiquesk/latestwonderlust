const Listing = require("../model/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const User = require("../model/user.js");

// Get all listings
const getDataListing = async (req, res, next) => {
  try {
    const listings = await Listing.find({});
    if (!listings) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/index.ejs", { listings });
  } catch (err) {
    next(err);
  }
};

// Show a single listing with owner & reviews
const showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

// Render new listing form
const createListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Create new listing
const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listings);

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = { url, filename };
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "🎉 Your new listing has been created successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Render edit form
const editForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  } catch (err) {
    next(err);
  }
};

// Update listing
const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listingData = req.body.listings;

    await Listing.findByIdAndUpdate(id, listingData, {
      runValidators: true,
      new: true,
    });

    req.flash("success", "✅ Listing updated successfully.");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

// Delete listing
const destroyListings = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "⚠️ Listing has been deleted successfully.");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Render signup form
const SignupForm = async (req, res, next) => {
  try {
    res.render("user/signup.ejs");
  } catch (err) {
    next(err);
  }
};

// Handle signup
const Signup = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    const newUser = new User({ email, phone, username });
    await User.register(newUser, password);
    req.flash("success", `👋 Welcome to Wanderlust, ${username}!`);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Render login form
const LoginForm = async (req, res, next) => {
  try {
    res.render("user/login.ejs");
  } catch (err) {
    next(err);
  }
};

// Logout handler
const logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "👋 You've been logged out successfully.");
    res.redirect("/listings");
  });
};

module.exports = {
  getDataListing,
  showListing,
  createListingForm,
  createListing,
  editForm,
  destroyListings,
  updateListing,
  SignupForm,
  Signup,
  LoginForm,
  logout,
};
