import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceListComponent } from './GrievanceList.component';

const routes: Routes = [{ path: '', component: GrievanceListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceListRoutingModule { }
