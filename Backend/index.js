const express = require('express');
const db = require('./src/db/dbconfig');

const port = 8463;

const app = express();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

