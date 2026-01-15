import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvigilatorExamListRoutingModule } from './invigilator-exam-list-routing.module';
import { InvigilatorExamListComponent } from './invigilator-exam-list.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    InvigilatorExamListComponent
  ],
  imports: [
    CommonModule,
    InvigilatorExamListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule
  ]
})
export class InvigilatorExamListModule { }
