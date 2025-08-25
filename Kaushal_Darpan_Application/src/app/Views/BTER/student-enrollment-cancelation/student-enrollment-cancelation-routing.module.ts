import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEnrollmentCancelationComponent } from './student-enrollment-cancelation.component';

const routes: Routes = [{ path: '', component: StudentEnrollmentCancelationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEnrollmentCancelationRoutingModule { }
