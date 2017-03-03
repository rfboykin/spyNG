/**
 * Created by Robert on 1/23/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePageComponent } from './game-page.component';
import { GamePageRoutingModule } from './game-page-routing.module';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, GamePageRoutingModule, MaterialModule],
  declarations: [GamePageComponent],
  exports: [GamePageComponent]
})
export class GamePageModule { }
