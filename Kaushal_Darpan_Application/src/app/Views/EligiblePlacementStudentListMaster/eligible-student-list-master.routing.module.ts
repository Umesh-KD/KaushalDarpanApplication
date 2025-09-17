import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EligibleStudentListMasterComponent } from './eligible-student-list-master.component';





const routes: Routes = [{ path: '', component: EligibleStudentListMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EligibleStudentListMasterRoutingModule { }
