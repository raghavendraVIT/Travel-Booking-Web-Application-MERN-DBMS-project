const Hotel = require('../models/Hotel');


exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getHotels = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, minRating } = req.query;
        const query = {};

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        const hotels = await Hotel.find(query).sort({ price: 1 });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
