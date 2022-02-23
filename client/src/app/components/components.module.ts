import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { PosterListComponent } from './poster-list/poster-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  declarations: [EmptyStateComponent, PosterListComponent],
  exports: [EmptyStateComponent, PosterListComponent]
})
export class ComponentsModule {}
