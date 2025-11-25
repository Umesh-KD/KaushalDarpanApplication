import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UpdateStudentQualificationComponent } from './update-student-qualification.component';

const routes: Routes = [{ path: '', component: UpdateStudentQualificationComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateStudentQualificationRoutingModule { }
