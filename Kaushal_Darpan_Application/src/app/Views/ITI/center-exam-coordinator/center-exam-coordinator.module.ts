import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterExamCoordinatorRoutingModule } from './center-exam-coordinator-routing.module';
import { CenterExamCoordinatorComponent } from './center-exam-coordinator.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CenterExamCoordinatorComponent
  ],
  imports: [
    CommonModule,
    CenterExamCoordinatorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class CenterExamCoordinatorModule { }
