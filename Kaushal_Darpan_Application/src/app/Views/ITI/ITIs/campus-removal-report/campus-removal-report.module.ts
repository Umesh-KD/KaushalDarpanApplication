import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusRemovalReportRoutingModule } from './campus-removal-report-routing.module';
import { CampusRemovalReportComponent } from './campus-removal-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    CampusRemovalReportComponent
  ],
  imports: [
    CommonModule,
    CampusRemovalReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class CampusRemovalReportModule { }
