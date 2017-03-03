/**
 * Middleware for expressJS server
 */

const express = require('express');

let applyMiddleware = function (app) {

  //CORS
  app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    next();
  });

  console.log('Express Middleware Applied')
};

module.exports = applyMiddleware;