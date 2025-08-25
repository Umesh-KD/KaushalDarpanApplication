import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppointExaminerListComponent } from './appoint-examiner-list.component';


const routes: Routes = [{ path: '', component: AppointExaminerListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointExaminerListRoutingModule { }
