import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlacementAllStudentListComponent } from './placement-allstudentlist.component';





const routes: Routes = [{ path: '', component: PlacementAllStudentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementAllStudentListRoutingModule { }
