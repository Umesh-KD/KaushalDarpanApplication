import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentAdditionalQualificationComponent } from './student-additional-qualification.component';





const routes: Routes = [{ path: '', component: StudentAdditionalQualificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAdditionalQualificationRoutingModule { }
