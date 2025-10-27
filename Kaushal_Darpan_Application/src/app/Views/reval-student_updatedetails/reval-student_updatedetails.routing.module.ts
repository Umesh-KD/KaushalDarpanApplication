import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RevalStudentUpdateDetailsComponent } from './reval-student_updatedetails.component';





const routes: Routes = [{ path: '', component: RevalStudentUpdateDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevalStudentUpdateDetailsRoutingModule { }
