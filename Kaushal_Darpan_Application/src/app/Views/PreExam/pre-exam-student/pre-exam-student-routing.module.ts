import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreExamStudentComponent } from './pre-exam-student.component';

const routes: Routes = [{ path: '', component: PreExamStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreExamStudentRoutingModule { }
