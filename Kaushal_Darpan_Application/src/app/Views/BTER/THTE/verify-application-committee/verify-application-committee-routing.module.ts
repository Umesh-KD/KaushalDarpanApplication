import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyApplicationCommitteeComponent } from './verify-application-committee.component';

const routes: Routes = [{ path: '', component: VerifyApplicationCommitteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyApplicationCommitteeRoutingModule { }