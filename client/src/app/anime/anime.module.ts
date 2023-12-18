import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimePageRoutingModule } from './anime-routing.module';

import { AnimePage } from './anime.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AnimePage]
})
export class AnimePageModule {}
