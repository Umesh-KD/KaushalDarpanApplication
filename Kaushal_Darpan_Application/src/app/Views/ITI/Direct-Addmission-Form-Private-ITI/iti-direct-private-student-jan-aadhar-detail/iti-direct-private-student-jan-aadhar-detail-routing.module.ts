import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectprivateStudentJanAadharDetailComponent } from './iti-direct-private-student-jan-aadhar-detail.component';

const routes: Routes = [{ path: '', component: ITIDirectprivateStudentJanAadharDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectprivateStudentJanAadharDetailRoutingModule { }
