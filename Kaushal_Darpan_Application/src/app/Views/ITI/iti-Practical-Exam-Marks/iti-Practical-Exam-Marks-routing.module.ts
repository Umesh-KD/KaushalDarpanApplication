import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiPracticalExamMarksComponent } from './iti-Practical-Exam-Marks.component';

const routes: Routes = [{ path: '', component: itiPracticalExamMarksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiPracticalExamMarksRoutingModule { }
