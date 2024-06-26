const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    balance: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
