const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect to database, through mongoose
connectDB();

//end points
app.get('/', (req, res) => {

    res.send('API running');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`(express) Server started on port ${PORT}`)
})

//"mongodb://localhost/nameofdb" 