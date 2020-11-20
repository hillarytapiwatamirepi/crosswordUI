const http = require('http');
const express= require("express");

const app =  express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static('public'))

const hostname = '127.0.0.1';
const port = 3000;







app.listen(process.env.PORT||port);