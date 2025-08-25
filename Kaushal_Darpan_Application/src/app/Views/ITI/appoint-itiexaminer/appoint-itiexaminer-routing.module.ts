import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointITIExaminerComponent } from './appoint-itiexaminer.component';

const routes: Routes = [{ path: '', component: AppointITIExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointITIExaminerRoutingModule { }
