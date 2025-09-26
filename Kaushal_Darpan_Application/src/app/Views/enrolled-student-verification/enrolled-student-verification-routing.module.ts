import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrolledStudentVerificationComponent } from './enrolled-student-verification.component';

const routes: Routes = [{ path: '', component: EnrolledStudentVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrolledStudentVerificationRoutingModule { }
