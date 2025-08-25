import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EligibleVerificationEnrollNoComponent } from './eligible-verification-enroll-no.component';

const routes: Routes = [{ path: '', component: EligibleVerificationEnrollNoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EligibleVerificationEnrollNoRoutingModule { }
