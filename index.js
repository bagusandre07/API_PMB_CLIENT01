 'strict'
const express = require('express')
const app = express();
const indexRoute = require('./routes/main_routes');
const userRoutes = require('./routes/Users');

app.use(express.json()); 
app.use('/',indexRoute);

app.use('/users',userRoutes);
module.exports = app;
