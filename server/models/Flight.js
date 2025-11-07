const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: { type: String, required: true },
    source: { type: String, required: true, index: true },
    destination: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    duration: { type: String }
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;

/*

{
    "airline": "SpiceJet",
    "source": "Chennai",
    "destination": "Tirupati",
    "date": "2025-11-27T10:00:00.000Z",
    "price": 5200,
    "duration": "2h 35m"
  }


   {
    "airline": "Air India",
    "source": "Chennai",
    "destination": "Tirupati",
    "date": "2025-11-27T13:15:00.000Z",
    "price": 3300,
    "duration": "1h 20m"
  }
    {
    "airline": "IndiGo",
    "source": "benguluru",
    "destination": "Chennai",
    "date": "2025-11-27T2:00:00.000Z",
    "price": 2500,
    "duration": "1h 15m"
  }
*/