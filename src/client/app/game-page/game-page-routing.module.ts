import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamePageComponent } from './game-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'game-page', component: GamePageComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GamePageRoutingModule { }
