const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['Flight', 'Hotel'], required: true },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'itemType'
    },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
