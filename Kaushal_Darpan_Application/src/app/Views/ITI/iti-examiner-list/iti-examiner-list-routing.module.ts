import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiExaminerListComponent } from './iti-examiner-list.component';

const routes: Routes = [{ path: '', component: ItiExaminerListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiExaminerListRoutingModule { }
