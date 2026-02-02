const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async (req,res,next)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("./listings/create.ejs");
};
module.exports.showListing = async (req,res,next)=>{
     let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings");
    }
    else{
        res.render("./listings/listing.ejs",{listing});
    }
};
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  // 🔵 STEP 2.1 — Call OpenStreetMap Nominatim
  const location = req.body.listing.location;

  const geoResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
  );

  const geoData = await geoResponse.json();

  // 🔴 If location not found
  if (!geoData.length) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  // 🔵 STEP 2.2 — Save coordinates
  listing.geometry = {
    type: "Point",
    coordinates: [
      geoData[0].lon,
      geoData[0].lat,
    ],
  };

  // image (Cloudinary)
  listing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await listing.save();

  req.flash("success", "New listing created");
  res.redirect("/listings");
};



module.exports.renderNewEditForm = async (req,res,next)=>{
        let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    else{
        let originalImageUrl = listing.image.url;
       originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
    }

};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // 🔵 If location changed → re-geocode
  if (req.body.listing.location !== listing.location) {
    const location = req.body.listing.location;

    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );

    const geoData = await geoResponse.json();

    if (!geoData.length) {
      req.flash("error", "Location not found");
      return res.redirect(`/listings/${id}/edit`);
    }

    listing.geometry = {
      type: "Point",
      coordinates: [
        geoData[0].lon,
        geoData[0].lat,
      ],
    };
  }

  // 🔵 Update other fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;

  // 🔵 Update image only if new one uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};


module.exports.deleteForm = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings")
}