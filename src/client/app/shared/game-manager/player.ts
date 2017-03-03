/**
 * Class representing a player
 * Created by Robert on 1/24/2017.
 */

export class Player {
  id: number;
  name: string;
  isLeader: boolean = false;
  isReady: boolean = false;
  isActive: boolean; // True as long as player is online. False if player leaves
  socketId: string; // Alphanumeric Socket.IO socket ID

  constructor(_name: string,
      _isReady?: any,
      _isLeader?: any) {

    this.name = _name;

    //convert from strings to boolean
    (typeof _isLeader === 'string') ? this.isLeader = (_isLeader == "true") : this.isLeader = _isLeader;
    (typeof _isReady === 'string') ? this.isReady = (_isReady == "true") : this.isReady = _isReady;

    this.isActive = true;
  };

  getId(): number {
    return this.id;
  }

  setId(_id: number): Player {
    this.id = _id;
    return this;
  }

  makeLeader() : void {
    this.isLeader = true;
  }
}
