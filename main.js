const express = require('express');
const { connectWithDB } = require('./_shared/utils/db/db');
const { isAuth } = require('./_shared/middleware/auth.middleware');
const { defaults } = require('./_shared/utils/utils.utils');
const cloudinary = require("cloudinary").v2;
// Middleweare logging
const logging = require('./_shared/middleware/logging.middleware');

require('dotenv').config();

/* cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}); */

const PORT = defaults(process.env.PORT, 3000);
const app = express();

connectWithDB();

app.use(express.limit('5mb'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logging);

// Routes
app.use('/users', usersRoutes);

app.use('*', (req, res, next) => {
    const error = new Error();
    error.message="Path not existing";
    error.status=404;
    return next(error);
});

// Base Error Handler
app.use((error, req, res, next) => {

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