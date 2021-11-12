const mongoose = require('mongoose');
require('dotenv').config();

// URL local de nuestra base de datos en mongoose y su nombre upgrade_class_3
const urlDB = process.env.MONGO_URI;

const connectWithDB = async () => {
    try {
        const db = await mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true});
        const { name, host } = db.connection;
        console.log(`Connected with db name: ${name} in host: ${host}`);
    } catch (error) {
        console.error('Error to connect to MongoDB');
    }
}

module.exports = {
    connectWithDB
}