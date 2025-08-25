import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiExaminerComponent } from './iti-examiner.component';

const routes: Routes = [{ path: '', component: ItiExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiExaminerRoutingModule { }
