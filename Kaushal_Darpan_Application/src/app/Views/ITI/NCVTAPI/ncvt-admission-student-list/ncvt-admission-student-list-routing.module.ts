import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NcvtAdmissionStudentListComponent } from './ncvt-admission-student-list.component';

const routes: Routes = [{ path: '', component: NcvtAdmissionStudentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcvtAdmissionStudentListRoutingModule { }
