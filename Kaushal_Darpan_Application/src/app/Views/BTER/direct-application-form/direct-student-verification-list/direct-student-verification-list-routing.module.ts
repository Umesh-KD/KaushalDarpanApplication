import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectStudentVerificationListComponent } from './direct-student-verification-list.component';

const routes: Routes = [{ path: '', component: DirectStudentVerificationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectStudentVerificationListRoutingModule { }
