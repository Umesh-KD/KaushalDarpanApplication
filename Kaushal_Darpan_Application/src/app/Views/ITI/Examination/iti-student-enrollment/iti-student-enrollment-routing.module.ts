import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiStudentEnrollmentComponent } from './iti-student-enrollment.component';

const routes: Routes = [{ path: '', component: ItiStudentEnrollmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiStudentEnrollmentRoutingModule { }
