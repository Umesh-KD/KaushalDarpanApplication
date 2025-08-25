import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementSelectedStudentsComponent } from './placement-selected-students.component';

const routes: Routes = [{ path: '', component: PlacementSelectedStudentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementSelectedStudentsRoutingModule { }
