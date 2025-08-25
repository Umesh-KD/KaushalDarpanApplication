import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentJanAadharDetailComponent } from './student-jan-aadhar-detail.component';

const routes: Routes = [{ path: '', component: StudentJanAadharDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentJanAadharDetailRoutingModule { }
