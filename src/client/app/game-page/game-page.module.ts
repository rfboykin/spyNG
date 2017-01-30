/**
 * Created by Robert on 1/23/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePageComponent } from './game-page.component';
import { GamePageRoutingModule } from './game-page-routing.module';

@NgModule({
  imports: [CommonModule, GamePageRoutingModule],
  declarations: [GamePageComponent],
  exports: [GamePageComponent]
})
export class GamePageModule { }
