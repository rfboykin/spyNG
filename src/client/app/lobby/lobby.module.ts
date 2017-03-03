/**
 * Created by Robert on 1/23/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { LobbyComponent } from './lobby.component';
import { LobbyRoutingModule } from './lobby-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LobbyService } from './lobby-service/lobby.service';

@NgModule({
  imports: [CommonModule, LobbyRoutingModule, ReactiveFormsModule, SharedModule, MaterialModule],
  declarations: [LobbyComponent],
  providers: [LobbyService],
  exports: [LobbyComponent]
})
export class LobbyModule {
}
