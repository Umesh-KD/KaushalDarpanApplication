import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPlanningListRoutingModule } from './iti-planning-list-routing.module';
import { ItiPlanningListComponent } from './iti-planning-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ItiPlanningListComponent
  ],
  imports: [
    CommonModule,
    ItiPlanningListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    MatTooltipModule,
    TableSearchFilterModule
  ]
})
export class ItiPlanningListModule { }
