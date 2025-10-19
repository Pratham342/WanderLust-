const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

router.route("/")
// Listings index route or the main route 
.get(wrapAsync(listingController.index))
// Listings create - create route that will add the details filled in the form of new.ejs into the database
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createNewListing));


// Listings create- new route which will render the form to create the new user
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
// Listings show route or Read route
.get(wrapAsync(listingController.showListing))
// Listings update- update route 
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
// Listings delete route 
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



// Listings update- towards edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;