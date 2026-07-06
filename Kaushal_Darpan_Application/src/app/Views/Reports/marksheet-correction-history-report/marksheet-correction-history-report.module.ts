import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarksheetCorrectionHistoryReportRoutingModule } from './marksheet-correction-history-report-routing.module';
import { MarksheetCorrectionHistoryReportComponent } from './marksheet-correction-history-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    MarksheetCorrectionHistoryReportComponent
  ],
  imports: [
    CommonModule,
    MarksheetCorrectionHistoryReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class  MarksheetCorrectionHistoryReportModule { }
