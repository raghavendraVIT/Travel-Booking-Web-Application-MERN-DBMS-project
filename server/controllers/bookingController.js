const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');


exports.createBooking = async (req, res) => {
    const { itemId, itemType } = req.body;
    const userId = req.user.id;

    try {
        let item;
        let Model;

        if (itemType === 'Hotel') {
            Model = Hotel;
        } else if (itemType === 'Flight') {
            Model = Flight;
        } else {
            return res.status(400).json({ message: 'Invalid item type' });
        }

        item = await Model.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }

        const totalAmount = item.price;

        const booking = await Booking.create({
            userId,
            itemId,
            itemType,
            totalAmount,
            status: 'Confirmed',
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.find({ userId })
            .populate('itemId')
            .sort({ bookingDate: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        
        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('itemId') 
            .sort({ bookingDate: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
