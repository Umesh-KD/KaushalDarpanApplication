import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterPracticalExaminerComponent } from './center-practical-examiner.component';

const routes: Routes = [{ path: '', component: CenterPracticalExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterPracticalExaminerRoutingModule { }
