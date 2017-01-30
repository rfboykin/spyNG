import { Component } from '@angular/core';

/**
 * This component represents the in-game page during play
 * This component is responsible for displaying all information the player needs
 *  and allowing user to restart the round
 */
@Component({
  moduleId: module.id,
  selector: 'spy-game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.css']
})
export class GamePageComponent {
  private isSpy = false;

}
