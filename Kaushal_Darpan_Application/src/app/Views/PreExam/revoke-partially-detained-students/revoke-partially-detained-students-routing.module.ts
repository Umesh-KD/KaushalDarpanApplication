import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevokePartiallyDetainedStudentsComponent } from './revoke-partially-detained-students.component';

const routes: Routes = [{ path: '', component: RevokePartiallyDetainedStudentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevokePartiallyDetainedStudentsRoutingModule { }
