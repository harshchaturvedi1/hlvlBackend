const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wallet', walletSchema);
