import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatsDistributionsListComponent } from './seats-distributions-list.component';

const routes: Routes = [{ path: '', component: SeatsDistributionsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatsDistributionsListRoutingModule { }
