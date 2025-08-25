import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchSuperintendentAllottedExamDateListComponent } from './DispatchSuperintendentAllottedExamDateList.component';

const routes: Routes = [{ path: '', component: DispatchSuperintendentAllottedExamDateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchSuperintendentAllottedExamDateListRoutingModule { }
