import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentAdditionalQualiComponent } from './student-additional-qualification.component';





const routes: Routes = [{ path: '', component: StudentAdditionalQualiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAdditionalQualiRoutingModule { }
