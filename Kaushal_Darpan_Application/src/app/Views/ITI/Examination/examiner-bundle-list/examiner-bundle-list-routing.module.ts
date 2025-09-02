import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminerBundleListComponent } from './examiner-bundle-list.component';

const routes: Routes = [{ path: '', component: ExaminerBundleListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerBundleListRoutingModule { }
