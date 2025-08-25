import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevaluationStudentSearchRoutingModule } from './revaluation-student-search-routing.module';
import { RevaluationStudentSearchComponent } from './revaluation-student-search.component';


@NgModule({
  declarations: [
    RevaluationStudentSearchComponent
  ],
  imports: [
    CommonModule,
    RevaluationStudentSearchRoutingModule
  ]
})
export class RevaluationStudentSearchModule { }
