import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReAssignAttendenceComponent } from './re-assign-attendence.component';

const routes: Routes = [{ path: '', component: ReAssignAttendenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReAssignAttendenceRoutingModule { }
