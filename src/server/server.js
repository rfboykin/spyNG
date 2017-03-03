/**
 * Created by Robert on 2/4/2017.
 */
'use strict';

/** Imports and Dependencies */
const restify = require('restify');
const socketio = require('socket.io');
// const jwt = require('express-jwt'); //for auto0 authentication
const mongoose = require('mongoose');
const db = require('./models/db');
const lobby = require('./lobby/lobby');

/** Models */
// const Location = require('./models/location');
const Location = mongoose.model('Location');

/** Variables */


const server = restify.createServer({
  name: 'spyNG',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.CORS());

// server.use(restify.fullResponse());

const io = socketio.listen(server.server);

restify.CORS.ALLOW_HEADERS.push('Accept-Encoding');
restify.CORS.ALLOW_HEADERS.push('Accept-Language');
server.use(restify.CORS());

/** Controller */
server.get('/spyfall/lobby', (req, res, next) => {
  console.log('GET request at /lobby');
  //Return list of current lobby players
  res.json(lobby.getAllPlayers());
});

server.post('/spyfall/lobby', (req, res, next) => {
  // If player already exists, updatePlayer player details.
  // If player is new, addNewPlayer player to lobby
  console.log(req.query);
  if (!req.body) return res.status(400);

  let player = req.body;

  //Check if player has been assigned an id by our server
  if (player.hasOwnProperty('id')) {
    player = lobby.updatePlayer(player);
  } else {
    player = lobby.addNewPlayer(player);
  }
  res.send(player);
});

server.get('/spyfall/locations', (req, res, next) => {
  Location.find((err, locations) => {
    if (err) return console.error(err);
    res.json(locations);
  })
});

server.post('/spyfall/locations', (req, res, next) => {

  let body = req.body;
  if (!req.body) return res.status(400);

  let location = new Location({name: body.name, pictureLocation: body.picPath, roles: body.roles});

  location.save((err, location) => {
    if (err) console.error(err);
    return res.send(location);
  });

});

server.post('/spyfall/locations/test', (req, res, next) => {
  let body = {name: "Spy", picPath: "spy.jpeg"};
  body._id = body.name;

});

io.origins('*:*'); // Enable Cross Origin Requests

io.on('connection', function (socket) {
  let playerId; // Id of currently connected player

  console.log('new connection');

  socket.on('player-connected', () => {
    lobby.getAllPlayers();
  });

  socket.on('disconnect', () => {
    if (typeof playerId !== "undefined") {
      if(lobby.checkLeader(playerId, true)) io.emit('update-player',lobby.getLeader()); // check if player was leader and reassign leader if so
      let removedPlayer = lobby.removePlayer(playerId);
      io.emit('remove-player', removedPlayer);
      console.log('Player Disconnected: ', removedPlayer.name);
    }
  });

  socket.on('new-player', (player) => {
    console.log("new player: ", player);

    //Assign player's socketId
    player.socketId = socket.id;

    let newPlayer = lobby.addNewPlayer(player);
    io.to(socket.id).emit('new-player-response', newPlayer);

    playerId = newPlayer.id;
    console.log('new player added: ', newPlayer);
    //broadcast a new player has joined
    io.emit('new-player', newPlayer);
    io.emit('players-ready-status', lobby.isLobbyReady());
  });

  socket.on('update-player', (player) => {

    // Test if incoming player has an id
    if (player.hasOwnProperty('id')) {
      let updatedPlayer = lobby.updatePlayer(player);   // Update player in dictionary
      console.log('player updated: ', updatedPlayer);
      io.emit('update-player', updatedPlayer);
    }

    // Check if all players are ready
    io.emit('players-ready-status', lobby.isLobbyReady());

  });
});

console.log('Launching Backend Server...');
// Launch our API Server and have it listen to port 8080
server.listen(8080);


