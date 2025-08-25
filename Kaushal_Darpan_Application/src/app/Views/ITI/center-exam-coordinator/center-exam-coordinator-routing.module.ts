import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterExamCoordinatorComponent } from './center-exam-coordinator.component';

const routes: Routes = [{ path: '', component: CenterExamCoordinatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterExamCoordinatorRoutingModule { }
