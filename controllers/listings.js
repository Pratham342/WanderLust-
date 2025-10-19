const Listing = require("../models/listing.js");
const maptilerClient = require('@maptiler/client');
const mapToken = process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;
const geocodingClient = maptilerClient.geocoding;

// Listings index route or the main route 
module.exports.index = async (req, res) =>{
    let allList = await Listing.find({});
    res.render("listings/index.ejs", {allList});
};

// Listings create- new route which will render the form to create the new user
module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

// Listings create - create route that will add the details filled in the form of new.ejs into the database
module.exports.createNewListing = async(req, res, next) =>{
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename};
    
    // for map 
    const geoData = await geocodingClient.forward(req.body.listing.location, {limit: 1});
    if(geoData.features && geoData.features.length > 0){
        //assinging the coordinate data returned from maptiler to newListing's geometry field
        newList.geometry = geoData.features[0].geometry; 
    }

    let savedListing = await newList.save();
    // console.log(savedListing);
    req.flash("success", "New Listing created");
    res.redirect("/listings");
};

// Listings show route or Read route
module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    let allData = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
    if(!allData){
        req.flash("error", "Listing you requested for, Does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {allData});
};

// Listings update- towards edit route 
module.exports.renderEditForm = async(req,res) =>{
    let { id } = req.params;
    let listData = await Listing.findById(id);
    if(!listData){
        req.flash("error", "Listing you requested for, Does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listData, originalImageUrl});
};

// Listings update- update route 
module.exports.updateListing = async(req,res) =>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// Listings delete route 
module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};


