import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EpisodiesPageRoutingModule } from './episodies-routing.module';

import { EpisodiesPage } from './episodies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EpisodiesPageRoutingModule
  ],
  declarations: [EpisodiesPage]
})
export class EpisodiesPageModule {}
