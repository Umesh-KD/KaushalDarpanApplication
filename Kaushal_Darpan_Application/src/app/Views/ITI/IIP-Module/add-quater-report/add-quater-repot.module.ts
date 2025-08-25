import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { AddITIQuarterReportComponent } from './add-quater-repot.component';
import { AddITIQuarterReportRoutingModule } from './add-quater-repot-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [
    AddITIQuarterReportComponent
  ],
  imports: [
    CommonModule,
    AddITIQuarterReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AddITIQuarterReportModule { }
