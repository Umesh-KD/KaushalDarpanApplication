import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyStudentPhoneComponent } from './verify-student-phone.component';

const routes: Routes = [{ path: '', component: VerifyStudentPhoneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyStudentPhoneRoutingModule { }
