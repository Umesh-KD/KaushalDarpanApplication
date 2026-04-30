import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiStudentdetailByEnrollmentComponent } from './iti-studentdetail-by-enrollment.component';

const routes: Routes = [{ path: '', component: ItiStudentdetailByEnrollmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiStudentdetailByEnrollmentRoutingModule { }
