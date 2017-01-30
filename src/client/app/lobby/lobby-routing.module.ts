import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'lobby', component: LobbyComponent }
    ])
  ],
  exports: [RouterModule]
})
export class LobbyRoutingModule { }
