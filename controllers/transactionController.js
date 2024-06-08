const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

exports.transact = async (req, res) => {
    try {
        const walletId = req.params.walletId;
        const { amount, description } = req.body;

        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const newBalance = wallet.balance + amount;
        if (newBalance < 0) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        wallet.balance = newBalance;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            amount: amount,
            balance: newBalance,
            description: description,
            type: amount > 0 ? 'CREDIT' : 'DEBIT'
        });
        await transaction.save();

        res.status(200).json({
            balance: wallet.balance,
            transactionId: transaction._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { walletId, skip = 0, limit = 10 } = req.query;

        const transactions = await Transaction.find({ walletId })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
