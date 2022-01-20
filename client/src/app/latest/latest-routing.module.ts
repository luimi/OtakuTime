import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LatestPage } from './latest.page';

const routes: Routes = [
  {
    path: '',
    component: LatestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LatestPageRoutingModule {}
