/**
 * Player Lobby Singleton
 */

const Immutable = require('immutable');

const lobby = function () {

  let activePlayers = Immutable.Map(); // Players in this lobby

  // State variables (it's cheating, I know)
  let idCount = 0;  // Count of IDs assigned
  let leaderId = 0;

  return {

    // Get a lobby player
    // Preferred method for accessing most updated player obj
    getPlayer(id){
      return activePlayers.get(id);
    },

    getAllPlayers: function () {
      return activePlayers.toArray();
    },

    getPlayerCount: function () {
      return Object.keys(activePlayers).length;
    },

    // Add new player to the lobby
    addNewPlayer: function (newPlayer) {

      //Assign this player an id
      newPlayer.id = idCount;
      idCount++;

      //If this is the first player, make them the lobby leader
      if (!activePlayers.size){
        newPlayer.isLeader = true;
        leaderId = newPlayer.id;
      }

      activePlayers = activePlayers.set(newPlayer.id, newPlayer);

      return activePlayers.get(newPlayer.id);
    },

    updatePlayer: function (updatedPlayer) {
      // console.log("updating player with id: ", updatedPlayer.id);
      activePlayers = activePlayers.set(updatedPlayer.id, updatedPlayer);
      return activePlayers.get(updatedPlayer.id);
    },

    /* Function to remove a player
     If the player was the party leader, assign a new leader and return the new leader
     Else, return
     */
    removePlayer: function (removedPlayerId) {
      let removedPlayer = activePlayers.get(removedPlayerId);
      removedPlayer.isActive = false;   // Flag for deletion
      activePlayers = activePlayers.delete(removedPlayerId);  // Remove from player dict

      if (!this.getPlayerCount()) this.resetLobby();  //If no players are connected, reset count

      return removedPlayer;
    },

    /** Utility Functions **/

    resetLobby: function () {
      console.log('Resetting Lobby');
      idCount = 0;
      leaderId = 0;
    },

    isLobbyReady: function () {

      return activePlayers.reduce((allReady, player) => {
        if (player.isReady)
          allReady = true;
        return allReady;
      }, false);

    },

    /* Assigns a new leader, returns the playerRecord updated new leader */
    assignNewLeader: function (oldLeaderId, playersRecord) {
      let players = playersRecord.toArray();
      let newLeaderId = oldLeaderId;

      // Scroll through players until a new, active id is chosen
      while (newLeaderId === oldLeaderId && players.length) {
          let candidate = players.pop();
          // console.log(candidate);
          if (candidate.isActive && candidate.id !== oldLeaderId) {
            newLeaderId = candidate.id;
            console.log('New leader: ', newLeaderId);
          }
      }
      if(newLeaderId === oldLeaderId) this.resetLobby(); // If no change made to leaderId, there must not be any other active players

      console.log(activePlayers.toJS());
      console.log('newLeader: ', newLeaderId, '\t oldLeader: ', oldLeaderId);
      let newLeader = activePlayers.get(newLeaderId);
      let oldLeader = activePlayers.get(oldLeaderId);
      newLeader.isLeader = true;
      oldLeader.isLeader = false;

      leaderId = newLeaderId;
      return activePlayers.set(newLeaderId, newLeader).set(oldLeaderId, oldLeader);

      // let newLeaderId = oldLeaderId;
      // // Look for player that is still connected
      // while (!playersRecord[newLeaderId]) {
      //   newLeaderId++;
      // }
      // playersRecord[newLeaderId].isLeader = true;
      // return playersRecord;
    },

    /* Check if playerId is leader
     If assignNew flag is true, assign new leader

     Return whether playerId is the leader (before reassignment)
     */
    checkLeader: function (playerId, assignNew = false) {
      let wasLeader = activePlayers.get(playerId).isLeader;
      console.log('Leader check: ', playerId, ' ', wasLeader);
      if (assignNew && wasLeader) {
        activePlayers = this.assignNewLeader(playerId, activePlayers);
      }
      return wasLeader;
    },

    getLeader: function(){
      return activePlayers.get(leaderId);
    }

  }
}();

module.exports = lobby;