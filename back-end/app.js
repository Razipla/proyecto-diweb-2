const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authenticate = require('./Auth/authenticate');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/user', authenticate, require('./routes/user'));
// app.use('/api/update-user', authenticate, require('./routes/updateUser'));

app.use('/api/refresh-token', require('./routes/refreshToken'));
app.use('/api/signout', require('./routes/signout'));
app.use('/api/todos', require('./routes/todos'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.send('API is working');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});