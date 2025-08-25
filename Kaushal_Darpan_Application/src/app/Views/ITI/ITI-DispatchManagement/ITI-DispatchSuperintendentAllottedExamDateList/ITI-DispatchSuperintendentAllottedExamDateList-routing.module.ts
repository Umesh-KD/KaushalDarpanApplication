import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchSuperintendentAllottedExamDateListComponent } from './ITI-DispatchSuperintendentAllottedExamDateList.component';

const routes: Routes = [{ path: '', component: ITIDispatchSuperintendentAllottedExamDateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchSuperintendentAllottedExamDateListRoutingModule { }
