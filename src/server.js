// src/server.js
const path = require('path');
const express = require('express');
const config = require('./config');
const models = require('./models');

const app = express();

const routes = require('./routes')

const jsonParser = require('body-parser').json;
const logger = require('morgan');

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.use(logger('dev'));
app.use(jsonParser());

// Connection to mongo

var mongoose = require("mongoose");

mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

var db = mongoose.connection;

db.on("error", function(err){
  console.error("connection error:", err);
});

db.once("open", function(){
  console.log("db connection successful");
});

app.use("/agendas", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error Handler

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: { 
      message: err.message
    }
  });
});

app.use(function(req, res, next) {
  res.end("Hello World!");
});

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});