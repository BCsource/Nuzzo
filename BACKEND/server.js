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

//PARA QUANDO LIGAR O VERCEL
/* mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error.message));

// No Vercel não existe um servidor à escuta numa porta: ele usa o app
// exportado em baixo. A variável VERCEL é definida por eles automaticamente.
if (!process.env.VERCEL) {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port', process.env.PORT);
    });
}

module.exports = app; */