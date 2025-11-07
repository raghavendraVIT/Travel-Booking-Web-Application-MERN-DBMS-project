
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    description: { type: String },
    amenities: [String],
    images: [String]
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
