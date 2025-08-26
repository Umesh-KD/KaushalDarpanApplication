import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEnrollNoComponent } from './verify-enroll-no.component';

const routes: Routes = [{ path: '', component: VerifyEnrollNoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyEnrollNoRoutingModule { }
