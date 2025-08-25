import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditStudentJanaadharComponent } from './add-edit-student-janaadhar.component';

const routes: Routes = [{ path: '', component: AddEditStudentJanaadharComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditStudentJanaadharRoutingModule { }
