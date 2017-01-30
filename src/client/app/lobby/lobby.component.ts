import { Component, OnInit } from '@angular/core';
import { Player } from './player-list/player';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlayerListService } from './player-list/player-list.service';

/**
 * This component represents the lobby
 * LobbyComponent displays players in the current lobby
 * and allows lobby leader to start the game
 */
@Component({
  moduleId: module.id,
  selector: 'spy-lobby',
  templateUrl: 'lobby.component.html',
  styleUrls: ['lobby.component.css']
})
export class LobbyComponent implements OnInit {

  //Retrieve list of players in the lobby from the server

  private players: Player[] = [];
  //Pick random person to be first
  private isReady: boolean = false; //represents if This Player is ready
  private playerInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private playerListService: PlayerListService) {
  };

  ngOnInit() {
    // this.populateData();
    this.buildForm();
    //Get a unique player signature from the server
    // this.playerListService.getPlayers().subscribe((res:Player)=>{this.players.push(res)},(err)=>{console.log(err)});
    this.playerListService.getPlayers().subscribe((res:Player[])=>{this.players = res},(err)=>{console.log(err)});
  }

  // Toggle the users' ready status
  toggleReady(): void {
    this.playerInfoForm.controls['isReady'].setValue(!this.playerInfoForm.controls['isReady'].value);
  }

  submitForm(): void {

    //dummy data add
    this.players.push(new Player(this.playerInfoForm.value.name, "false", this.playerInfoForm.value.isReady.toString()))
  }

  buildForm(): void {
    this.playerInfoForm = this.fb.group({
      'name': ['', Validators.required],
      'isReady': [false]
    })
  }

  populateData(): void {
    //Dummy Variables
    this.players.push(new Player('Jim Bob', false, false));
    this.players.push(new Player('Billy Jean', true, true));
  }

}
