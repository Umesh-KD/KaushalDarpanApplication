import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelievingPracticalExaminerComponent } from './relieving-practical-examiner.component';

const routes: Routes = [{ path: '', component: RelievingPracticalExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelievingPracticalExaminerRoutingModule { }
