import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { TheoryMarksRptViewComponent } from './theory-marks-rpt-view.component';
import { TheoryMarksRptViewRoutingModule } from './theory-marks-rpt-view-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    TheoryMarksRptViewComponent
  ],
  imports: [
    CommonModule,
    TheoryMarksRptViewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule,
    NgSelectModule,
  ]
})
export class TheoryMarksRptViewModule { }
