const Flight = require('../models/Flight');


exports.createFlight = async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json(flight);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getFlights = async (req, res) => {
    try {
        const { source, destination, date } = req.query;
        let query = {};

        if (source) query.source = { $regex: new RegExp(source, 'i') };
        if (destination) query.destination = { $regex: new RegExp(destination, 'i') };

        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json(flight);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json({ message: 'Flight removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
