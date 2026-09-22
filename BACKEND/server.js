require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./nuzzo-api/users/auth.router');

const app = express();
app.use(cors());
app.use(express.json());
app.set('query parser', 'extended');

app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO_CONNECTION_STRING);
app.listen(process.env.PORT, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    } else {
        console.log('Server is running on port', process.env.PORT);
    }
});

module.exports = app;
