import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RevalAppointExaminerListComponent } from './reval-appoint-examiner-list.component';


const routes: Routes = [{ path: '', component: RevalAppointExaminerListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevalAppointExaminerListRoutingModule { }
