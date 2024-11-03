const express = require('express');
const db = require('./src/db/dbconfig');
const services = require('./src/services/services');

const port = 8463;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/userProfile', services.getAllUserProfile);
app.post('/register', services.registerUser);
app.post('/login', services.loginUser);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

