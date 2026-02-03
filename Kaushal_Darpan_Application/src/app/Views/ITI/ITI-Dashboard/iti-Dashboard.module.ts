import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiDashboardRoutingModule } from './iti-Dashboard-routing.module';
import { itiDashboardComponent } from './iti-Dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    itiDashboardComponent
  ],
  imports: [
    CommonModule,
    itiDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    MatTooltipModule,
    TableSearchFilterModule
  ]
})
export class itiDashboardModule { }
