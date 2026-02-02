const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
image: {
  url: {
    type: String,
    default: "https://www.stockvault.net/data/2011/02/21/117750/thumb16.jpg",
  },
  filename: {
    type: String,
  }
},


    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [lng, lat]
    default: [88.3639, 22.5726], // fallback (Kolkata)
  },
},

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;