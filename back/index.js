const express = require('express');
const endpoints = require('./model/user');
const topic = require('./model/topic');
const swaggerDoc = require('./swaggerDoc');
const bodyParser = require('body-parser');
const app = express(express);
app.use(express.static('upload'));
app.use(bodyParser.json());
endpoints(app);
topic(app);
swaggerDoc(app);

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

app.use((err,req,res,next) => console.error('There was an error',err));

app.listen(11123,()=>console.log('App started'));
