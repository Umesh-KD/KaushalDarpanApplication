import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { ITIFinalReportComponent } from './ITI-FinalReport.component';
import { ITIFinalReportRoutingModule } from './ITI-FinalReport-routing.module';



@NgModule({
  declarations: [
    ITIFinalReportComponent
  ],
  imports: [
    CommonModule,
    ITIFinalReportRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class ITIFinalReportModule { }
