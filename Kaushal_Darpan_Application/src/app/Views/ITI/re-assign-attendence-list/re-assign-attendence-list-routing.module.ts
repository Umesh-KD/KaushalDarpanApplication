import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReAssignAttendenceListComponent } from './re-assign-attendence-list.component';

const routes: Routes = [{ path: '', component: ReAssignAttendenceListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReAssignAttendenceListRoutingModule { }
