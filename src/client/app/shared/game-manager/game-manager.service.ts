import { Injectable, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client/socket.io';
import { OrderedMap } from 'immutable';
import { Player } from './player';
import { Config } from '../../shared/config/env.config';

/**
 * Singleton service which manages game states
 * Created by Robert on 2/24/2017.
 */

@Injectable()
export class GameManagerService implements OnDestroy{

  private playersDict: OrderedMap<number,Player>;
  private socket: any; //Socket in use
  private API: string = Config.API; // Includes '/spyfall'

  constructor(){
    this.socket = io('http://192.168.1.141:8080');
    this.playersDict = OrderedMap<number, Player>();
  };

  ngOnDestroy(){
    this.socket.disconnect();
  };

  /* Accessor Methods */
  getPlayersDict(){
    return this.playersDict;
  }

  getPlayersArray(){
    return this.playersDict.toArray();
  }

  getPlayersList(){
    return this.playersDict.toList();
  }

  getConnection(){
    return this.socket;
  }

  setPlayersDict(key:number, value:any){
    this.playersDict = this.playersDict.set(key, value);
    return this.playersDict;
  }

}