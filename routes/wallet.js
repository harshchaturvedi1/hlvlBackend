const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

// Setup new wallet
router.post('/setup', async (req, res) => {
    try {
        const { name, balance } = req.body;
        const wallet = new Wallet({ name, balance });
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            amount: balance,
            description: 'Setup',
            balance,
            type: 'CREDIT',
        });
        await transaction.save();

        res.status(200).json({
            id: wallet._id,
            balance: wallet.balance,
            transactionId: transaction._id,
            name: wallet.name,
            date: wallet.date,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Fetch wallet details by ID
router.get('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.status(200).json({
            id: wallet._id,
            balance: wallet.balance,
            name: wallet.name,
            date: wallet.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
