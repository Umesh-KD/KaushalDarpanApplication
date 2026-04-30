import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAttendencePercentReportRoutingModule } from './bter-attendence-percent-report-routing.module';
import { BterAttendencePercentReportComponent } from './bter-attendence-percent-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { routes } from '../../routes';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    BterAttendencePercentReportComponent
  ],
  imports: [
    CommonModule,
    BterAttendencePercentReportRoutingModule,

    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class BterAttendencePercentReportModule { }
