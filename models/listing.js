const { ref, string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        default: 1000,
    },
    location: {
        type: String,
        default: "Unknown",
    },
    country: {
        type: String,
        default: "India",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // 'Point'
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    // to add the filter options to show only listing which satisfy that category
    // category: {
    //     type: String,
    //     enum: ["Rooms","Mountains", "Iconic Cities", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"],
    // }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

