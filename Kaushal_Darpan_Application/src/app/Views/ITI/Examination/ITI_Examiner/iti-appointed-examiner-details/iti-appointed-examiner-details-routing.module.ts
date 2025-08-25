import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAppointedExaminerDetailsComponent } from './iti-appointed-examiner-details.component';

const routes: Routes = [{ path: '', component: ItiAppointedExaminerDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAppointedExaminerDetailsRoutingModule { }
