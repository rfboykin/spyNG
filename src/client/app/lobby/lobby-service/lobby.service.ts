/**
 * Created by Robert on 1/28/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Player } from '../../shared/game-manager/index';
import 'rxjs/add/operator/do';  // for debugging
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/from'
import { Config } from '../../shared/config/env.config';
import * as io from 'socket.io-client/socket.io';

/**
 * This class provides the Player service
 *   with methods to get players in the lobby and addNewPlayer a player to the lobby
 */
@Injectable()
export class LobbyService {

  API: string = Config.API + 'lobby';
  // API: string = '/assets/players.json';
  playerList: Player[] = [];

  private socket: any; //Socket in use

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {

  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  getLobbyPlayers(): Observable<Player[]> {
    return this.http.get(this.API)
        .map((res: Response) => res.json())
        .do(data => console.log('server data:', data))  // debug

        // .map((jsonArray: any) =>{new Player(jsonArray.name, jsonArray.isLeader, jsonArray.isReady)})
        // .map((jsonArray: any[]) => jsonArray.forEach((jsonObj: any) => {
        //   return new Player(jsonObj.name, jsonObj.isLeader, jsonObj.isReady)
        // }))

        //Working, returns each player as "step" in subscription
        //     .concatMap((jsonArray: any, index: number) => {
        //           return Observable.from(jsonArray)
        //               .map((jsonObj:any) => {return new Player(jsonObj.name, jsonObj.isLeader, jsonObj.isReady)})
        //         }
        //     )

        .map((jsonArray: any[]) => {
              let playerList: Player[] = [];

              if (jsonArray.length) jsonArray.forEach((jsonObj: any) => {
                playerList.push(new Player(jsonObj.name, jsonObj.isLeader, jsonObj.isReady).setId(jsonObj.id))
              });

              return playerList;
            }
        )
        // .do(data => console.log('server data:', data))  // debug
        .catch(this.handleError);

  }

  updatePlayer(player: Player): Observable < Response > {
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let bodyString: string = JSON.stringify(player);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.put(this.API, bodyString, options)
        .map((res: Response) => {
          res.json()
        })
        .catch(this.handleError);
  }

  addPlayerToLobby(value: any): Observable < Response > {
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let bodyString: string = JSON.stringify(value);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.API, bodyString, options)
        .map((res: Response) => {
          res.json()
        })
        .catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    // In a real world server, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error); // log to console instead
    return Observable.throw(errMsg);
  }

  /**
   * Creates observables for socket events
   */
  addPlayer(player: Player): void {
    this.socket.emit('new-player', player);
  }

  sendUpdate(player: Player): void {
    this.socket.emit('update-player', player);
  }

  launchGame(): void{
    this.socket.emit('launch-game');
  }

  // Returns observable watching for Player Activity in the lobby
  getPlayerActivity(): Observable<Player> {
    return new Observable((observer: any) => {

      this.socket.on('new-player', (data: Player) => {
        console.log('receiving new-player');
        observer.next(data);
      });

      this.socket.on('update-player', (data: Player) => {
        console.log('receiving update-player');
        observer.next(data);
      });

      this.socket.on('remove-player', (data: Player) => {
        console.log('receiving remove-player');
        observer.next(data);
      });

      return () => {
        // this.socket.disconnect(); //Don't disconnect from socket here
      };
    })

  }

  getLobbyReadyStatus() : Observable<boolean>{
    return new Observable((observer: any) => {
      this.socket.on('players-ready-status', (data: boolean)=>{
        observer.next(data);
      })
    })
  }

  getCurrentPlayer(): Observable<Player> {
    return new Observable((observer: any) => {
      this.socket.on('new-player-response', (data: Player) => {
        observer.next(data);
      })
    })
  }



}

