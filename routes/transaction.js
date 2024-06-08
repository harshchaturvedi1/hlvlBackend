const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');



// Transact on wallet
router.post('/transact/:walletId', async (req, res) => {
    try {
        const { walletId } = req.params;
        const { amount, description } = req.body;
        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (amount < 0 && wallet.balance + amount < 0) {
            return res.status(400).json({ error: 'Available balance not sufficient' });
        }

        wallet.balance += amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId,
            amount,
            description,
            balance: wallet.balance,
            type: amount > 0 ? 'CREDIT' : 'DEBIT',
        });
        await transaction.save();

        res.status(200).json({
            balance: wallet.balance,
            transactionId: transaction._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch transactions
router.get('/', async (req, res) => {
    try {
        const { walletId, skip = 0, limit = 10, sort = 'date', order = 'desc' } = req.query;

        // Determine the sort criteria based on the sort parameter
        let sortCriteria = {};
        if (sort === 'amount') {
            sortCriteria = { amount: order === 'asc' ? 1 : -1 }; // Sort by amount
        } else {
            sortCriteria = { date: order === 'asc' ? 1 : -1 }; // Sort by date (default)
        }

        const transactions = await Transaction.find({ walletId })
            .sort(sortCriteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const totalCount = await Transaction.countDocuments({ walletId });

        res.status(200).json({ transactions, totalCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
