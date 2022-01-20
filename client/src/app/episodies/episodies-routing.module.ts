import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EpisodiesPage } from './episodies.page';

const routes: Routes = [
  {
    path: '',
    component: EpisodiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EpisodiesPageRoutingModule {}
