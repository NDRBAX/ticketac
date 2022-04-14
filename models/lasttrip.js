var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: String,
    departureTime: String,
    price: Number,
    id: String,
    iduser: String
})

var cityModel = mongoose.model('lasttrip', citySchema);

module.exports = cityModel;