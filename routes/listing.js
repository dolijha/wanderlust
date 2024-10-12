const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

router
.route("/")
//index Route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)
);


//New Route
router.get("/new",isLoggedIn,listingController.renderNewform);

router.route("/:id")
//show route
.get( wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validatelisting,wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing)
);   

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

  
module.exports=router;