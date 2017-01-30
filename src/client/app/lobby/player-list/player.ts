/**
 * Class representing a player
 * Created by Robert on 1/24/2017.
 */

export class Player {
  isLeader: boolean= false;
  name: string;
  isReady: boolean = false;

  constructor(name: string,
      isLeader: any,
      isReady: any) {

    this.name = name;
    if(typeof isLeader === 'string') this.isLeader = (isLeader == "true"); //convert from strings to boolean
    if(typeof isReady === 'string') this.isReady = (isReady == "true");

  };
}
