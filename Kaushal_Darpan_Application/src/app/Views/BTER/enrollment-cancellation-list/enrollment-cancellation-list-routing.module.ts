import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrollmentCancellationListComponent } from './enrollment-cancellation-list.component';

const routes: Routes = [{ path: '', component: EnrollmentCancellationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentCancellationListRoutingModule { }
