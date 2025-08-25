import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointExaminerComponent } from './appoint-examiner.component';


const routes: Routes = [{ path: '', component: AppointExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointExaminerRoutingModule { }
