import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentExaminationITIComponent } from './student-examination-iti.component';

const routes: Routes = [{ path: '', component: StudentExaminationITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentExaminationITIRoutingModule { }
