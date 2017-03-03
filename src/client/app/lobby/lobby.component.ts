import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../shared/game-manager/player';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LobbyService } from './lobby-service/lobby.service';
import { OrderedMap, List } from 'immutable';
import { Router } from '@angular/router';
import { GameManagerService } from '../shared/game-manager/index';

/**
 * This component represents the lobby
 * LobbyComponent displays players in the current lobby
 * and allows lobby leader to start the game
 */
@Component({
  moduleId: module.id,
  selector: 'spy-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class LobbyComponent implements OnInit, OnDestroy {

  //Retrieve list of players in the lobby from the server
  private playersList: List<Player>; // Local List
  private playerActivityObs: any; //Player Activity Observable

  private allPlayersReady: boolean = false;

  private playerInfoForm: FormGroup;

  private currPlayer: Player; //current player

  constructor(private fb: FormBuilder, private lobbyService: LobbyService, private router: Router,
      private gm: GameManagerService) {

    this.playersList = gm.getPlayersList();
  };

  ngOnInit() {
    // this.populateData();
    this.buildForm();
    //Get a unique player signature/id from the server if creating a new player, otherwise it gets passed the player.id
    // for edits

    // this.playerListService.getLobbyPlayers().subscribe((res:Player)=>{this.players.push(res)},(err)=>{console.log(err)});
    // //Gets each player as step in observable
    this.lobbyService.getLobbyPlayers().subscribe((res: Player[]) => {
          for (let i in res) {
            this.gm.setPlayersDict(res[i].id, res[i]);
            this.playersList = this.gm.getPlayersList();
          }
        },
        (err) => {
          console.log(err);
        }
    );

    this.playerActivityObs = this.lobbyService.getPlayerActivity().subscribe((player: Player) => {
      // Update player entry if the player already exists in the players dictionary
      // Duplicate code for now, leaving structure in place for special update actions
      if (this.gm.getPlayersDict().has(player.id)) {
        if (this.currPlayer && player.id === this.currPlayer.id) {         // Current Player Check
          this.currPlayer = player; // Update State of current player
        }

        this.gm.setPlayersDict(player.id, player);
        this.playersList = this.gm.getPlayersList();
      } else {
        this.gm.setPlayersDict(player.id, player);
        this.playersList = this.gm.getPlayersList();
      }
    });

    this.lobbyService.getLobbyReadyStatus().subscribe((res: boolean) => {
      console.log("Players Ready: ", this.allPlayersReady);
      this.allPlayersReady = res;
    }, (err) => {
      console.log(err);
    });
  }

// Toggle the users' ready status
  toggleReady(): void {
    this.playerInfoForm.controls['isReady'].setValue(!this.playerInfoForm.controls['isReady'].value);
  }

  submitForm(): void {

    // TODO: Get a unique signature of a player (cookie or userID) so we can track stats/keep persistent player
    //       Integrate google login service

    // If player object already exists, updatePlayer this player. Else make a new one
    if (!
            this.currPlayer
    ) {
      this.lobbyService.addPlayer(new Player(this.playerInfoForm.value.name, this.playerInfoForm.value.isReady));
      this.lobbyService.getCurrentPlayer().subscribe(value => {
        this.currPlayer = value;
      });
      // this.currPlayer =  ...//Get player info returned from server
    }

  }

  buildForm(): void {
    this.playerInfoForm = this.fb.group({
      'name': ['', Validators.required],
      'isReady': [false]
    });

// Subscribe to changes player form changes and update server
    this.playerInfoForm.controls['name'].valueChanges.subscribe(value => {
      if (this.currPlayer) {
        this.currPlayer.name = value;
        // this.playerListService.sendUpdate(this.currPlayer);
      }
    });

    this.playerInfoForm.controls['isReady'].valueChanges.subscribe(value => {
      if (this.currPlayer) {
        this.currPlayer.isReady = value;
        this.lobbyService.sendUpdate(this.currPlayer);
      }
    })
  }

// Update currPlayer variable with formData
  updateCurrPlayer(): void {
    this.currPlayer.name = this.playerInfoForm.value.name;
    this.currPlayer.isReady = this.playerInfoForm.value.isReady;
  }

  populateData(): void {
    //Dummy Variables
    // this.playersDict.set(1, new Player('Jim Bob', false, false));
    // this.playersDict.set(2, new Player('Billy Jean', true, true));
  }

  ngOnDestroy() {
    this.playerActivityObs.unsubscribe();
  }


// After leader clicks "start" button
  launchGame() {
    this.lobbyService.launchGame();
    this.router.navigate(['/game-page']);
  }
}

