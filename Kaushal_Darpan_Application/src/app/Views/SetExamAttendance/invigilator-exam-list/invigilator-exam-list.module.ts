import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvigilatorExamListRoutingModule } from './invigilator-exam-list-routing.module';
import { InvigilatorExamListComponent } from './invigilator-exam-list.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InvigilatorExamListComponent
  ],
  imports: [
    CommonModule,
    InvigilatorExamListRoutingModule,
    LoaderModule
  ]
})
export class InvigilatorExamListModule { }
