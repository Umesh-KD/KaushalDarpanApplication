import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentListMasterComponent } from './student-list-master.component';





const routes: Routes = [{ path: '', component: StudentListMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentListMasterRoutingModule { }
