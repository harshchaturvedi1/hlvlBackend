const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const connectDB = require('./utils/db');
const dotenv = require('dotenv');
const cors = require('cors')
const PORT = process.env.PORT || 5000;
dotenv.config();


const app = express();
app.use(cors())

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, async () => {
    // MongoDB connection
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
