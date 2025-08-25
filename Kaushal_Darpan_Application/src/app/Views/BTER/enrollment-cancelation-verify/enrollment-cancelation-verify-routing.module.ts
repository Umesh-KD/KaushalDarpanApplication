import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrollmentCancelationVerifyComponent } from './enrollment-cancelation-verify.component';

const routes: Routes = [{ path: '', component: EnrollmentCancelationVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentCancelationVerifyRoutingModule { }
