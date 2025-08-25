import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { TheoryMarksRptViewComponent } from './theory-marks-rpt-view.component';
import { TheoryMarksRptViewRoutingModule } from './theory-marks-rpt-view-routing.module';


@NgModule({
  declarations: [
    TheoryMarksRptViewComponent
  ],
  imports: [
    CommonModule,
    TheoryMarksRptViewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class TheoryMarksRptViewModule { }
