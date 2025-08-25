import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementVerifiedStudentTpoComponent } from './placement-verified-student-tpo.component';

const routes: Routes = [{ path: '', component: PlacementVerifiedStudentTpoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementVerifiedStudentTpoRoutingModule { }
