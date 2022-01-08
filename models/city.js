const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
    city: {
        type: String,
        require: true
    },

    // comment belongs to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true,
});

const City = mongoose.model('City', citySchema);
module.exports = City;