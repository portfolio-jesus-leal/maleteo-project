const express = require('express');
const cors = require('cors');
const { connectWithDB } = require('./_shared/utils/db/db');
const { isAuth } = require('./_shared/middleware/auth.middleware');
const { defaults } = require('./_shared/utils/utils.utils');
const cloudinary = require("cloudinary").v2;
// Main routes
const usersRoutes = require('./user/user.routes');
const ratesRoutes = require('./rate/rate.routes');
const chatsRoutes = require('./chat/chat.routes');
const bookingsRoutes = require('./booking/booking.routes');
const lockersRoutes = require('./locker/locker.routes');
// Middleweare logging
const logging = require('./_shared/middleware/logging.middleware');

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const app = express();
const PORT = defaults(process.env.PORT, 4000);
connectWithDB();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200'],
    credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(logging);

// Routes
app.use('/users', usersRoutes);
app.use('/rates', ratesRoutes);
app.use('/chats', chatsRoutes);
app.use('/bookings', [isAuth], bookingsRoutes);
app.use('/lockers', lockersRoutes);

app.use('*', (req, res, next) => {
    const error = new Error();
    error.message="Path not existing";
    error.status=404;
    return next(error);
});

// Base Error Handler
app.use((error, req, res, next) => {

    console.log("error->", error);
    console.log("error.status->", error.status);
    console.log("error.message->", error.message);

    const exception = {
        status: defaults(error.status, 500),
        message: defaults(error.message, 'An unexpected error happened'),
    }

    if (process.env.NODE_ENV !== 'production') {
        exception['callstack'] = error.stack;
    }

    console.error(exception);
    res.status(exception.status).json(exception)
});

app.listen(PORT, () => {
    console.info(`Server is running in http://localhost:${PORT}`)
})