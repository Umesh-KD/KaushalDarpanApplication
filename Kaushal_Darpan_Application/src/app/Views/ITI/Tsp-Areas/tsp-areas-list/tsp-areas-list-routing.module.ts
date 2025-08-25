import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TspAreasListComponent } from './tsp-areas-list.component';

const routes: Routes = [{ path: '', component: TspAreasListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TspAreasListRoutingModule { }
