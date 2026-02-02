const express = require("express");
const app = express();
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{isLoggedIn,isReviewAuthor} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

 



const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el=>el.message)).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//reviews

//post review route
router.post("/",validateReview, isLoggedIn, wrapAsync(createReview));

//delete review route

router.delete("/:reviewId",isReviewAuthor,wrapAsync(destroyReview));

module.exports = router;





