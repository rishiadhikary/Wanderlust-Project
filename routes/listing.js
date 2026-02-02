const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{isLoggedIn, isOwner} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderNewEditForm, editForm, deleteForm } = require("../controllers/listing.js");
const multer  = require('multer');
const { storage }= require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el=>el.message)).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

router.route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );


router.get("/new",isLoggedIn,renderNewForm);

router.route("/:id")
.put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(editForm))
.get(wrapAsync(showListing));



//index route
//create route



//edit route

router.get("/:id/edit",isLoggedIn,wrapAsync(renderNewEditForm));

//show route

//delete route

router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(deleteForm));

module.exports = router;