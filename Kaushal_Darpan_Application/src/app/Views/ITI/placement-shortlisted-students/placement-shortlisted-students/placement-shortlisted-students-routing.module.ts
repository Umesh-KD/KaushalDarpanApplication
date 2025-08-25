import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementShortlistedStudentsComponent } from './placement-shortlisted-students.component';

const routes: Routes = [{ path: '', component: PlacementShortlistedStudentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementShortlistedStudentsRoutingModule { }
