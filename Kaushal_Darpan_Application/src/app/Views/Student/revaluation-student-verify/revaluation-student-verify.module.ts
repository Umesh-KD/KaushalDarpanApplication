import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevaluationStudentVerifyRoutingModule } from './revaluation-student-verify-routing.module';
import { RevaluationStudentVerifyComponent } from './revaluation-student-verify.component';


@NgModule({
  declarations: [
    RevaluationStudentVerifyComponent
  ],
  imports: [
    CommonModule,
    RevaluationStudentVerifyRoutingModule
  ]
})
export class RevaluationStudentVerifyModule { }
