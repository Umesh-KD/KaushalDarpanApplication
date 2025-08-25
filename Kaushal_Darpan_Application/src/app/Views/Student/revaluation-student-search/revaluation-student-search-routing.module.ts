import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevaluationStudentSearchComponent } from './revaluation-student-search.component';

const routes: Routes = [{ path: '', component: RevaluationStudentSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevaluationStudentSearchRoutingModule { }
