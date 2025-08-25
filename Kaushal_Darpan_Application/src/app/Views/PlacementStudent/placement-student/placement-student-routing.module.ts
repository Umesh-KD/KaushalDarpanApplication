import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementStudentComponent } from './placement-student.component';

const routes: Routes = [{ path: '', component: PlacementStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementStudentRoutingModule { }
