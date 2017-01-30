/**
 * Created by Robert on 1/28/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Player } from './player';
import 'rxjs/add/operator/do';  // for debugging
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/from'

/**
 * This class provides the Player service
 *   with methods to get players in the lobby and add a player to the lobby
 */
@Injectable()
export class PlayerListService {

  API: string = 'http://localhost:8080/spyfall/';
  playerList: Player[] = [];

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
  getPlayers(): Observable<Player[]> {
    return this.http.get('/assets/players.json')
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
          jsonArray.forEach((jsonObj: any) => {
            playerList.push(new Player(jsonObj.name, jsonObj.isLeader, jsonObj.isReady))
          });
          return playerList;
        })
        // .do(data => console.log('server data:', data))  // debug
        .catch(this.handleError);

  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

