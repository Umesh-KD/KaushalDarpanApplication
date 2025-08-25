import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectStudentJanAadharDetailComponent } from './iti-direct-student-jan-aadhar-detail.component';

const routes: Routes = [{ path: '', component: ITIDirectStudentJanAadharDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectStudentJanAadharDetailRoutingModule { }
