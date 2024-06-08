const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

exports.setupWallet = async (req, res) => {
    try {
        const { balance, name } = req.body;
        const wallet = new Wallet({ balance, name });
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            amount: balance,
            balance: balance,
            description: 'Setup',
            type: 'CREDIT'
        });
        await transaction.save();

        res.status(200).json({
            id: wallet._id,
            balance: wallet.balance,
            transactionId: transaction._id,
            name: wallet.name,
            date: wallet.date
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.status(200).json({
            id: wallet._id,
            balance: wallet.balance,
            name: wallet.name,
            date: wallet.date
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
