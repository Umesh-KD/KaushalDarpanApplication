import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectStudentJanAadharDetailComponent } from './direct-student-jan-aadhar-detail.component';

const routes: Routes = [{ path: '', component: DirectStudentJanAadharDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectStudentJanAadharDetailRoutingModule { }
