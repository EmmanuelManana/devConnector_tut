const mongoose = require('mongoose');

//require the mongoDbURI from default.js
const config = require('config');
const db = config.get('mongoURI');

//establic the connectio to the db
const connectDB = async () => {
    try {
        //return a promise to the connection
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB :)')
    } catch (err) {
        console.error(err.message);
        //Exit proccess with failure, upon connectin fail
        process.exit(1);
    }
}

module.exports = connectDB;