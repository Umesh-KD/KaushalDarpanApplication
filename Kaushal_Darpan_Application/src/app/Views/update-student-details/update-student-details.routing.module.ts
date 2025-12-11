import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpdateStudentDetailComponent } from './update-student-details.component';





const routes: Routes = [{ path: '', component: UpdateStudentDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateStudentDetailRoutingModule { }
