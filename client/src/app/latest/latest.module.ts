import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LatestPageRoutingModule } from './latest-routing.module';

import { LatestPage } from './latest.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LatestPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LatestPage]
})
export class LatestPageModule {}
