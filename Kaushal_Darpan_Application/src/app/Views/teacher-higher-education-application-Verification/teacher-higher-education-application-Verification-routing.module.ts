import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHigherEducationApplicationVerificationComponent } from './teacher-higher-education-application-Verification.component';

const routes: Routes = [{ path: '', component: TeacherHigherEducationApplicationVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherHigherEducationApplicationVerificationRoutingModule { }
