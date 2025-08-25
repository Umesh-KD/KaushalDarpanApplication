import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiExamCoordinatorComponent } from './iti-exam-coordinator.component';

const routes: Routes = [{ path: '', component: ItiExamCoordinatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiExamCoordinatorRoutingModule { }
