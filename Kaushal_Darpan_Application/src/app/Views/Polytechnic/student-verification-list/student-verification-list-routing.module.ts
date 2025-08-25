import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentVerificationListComponent } from './student-verification-list.component';

const routes: Routes = [{ path: '', component: StudentVerificationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentVerificationListRoutingModule { }
