import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyStudentAllotComponent } from './direct-student-allotment.component';

const routes: Routes = [{ path: '', component: VerifyStudentAllotComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyStudentAllotRoutingModule { }
