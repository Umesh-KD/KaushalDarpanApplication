import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankGuaranteeConsolidatedReportRoutingModule } from './bank-guarantee-consolidated-report-routing.module';
import { BankGuaranteeConsolidatedReportComponent } from './bank-guarantee-consolidated-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    BankGuaranteeConsolidatedReportComponent
  ],
  imports: [
    CommonModule,
    BankGuaranteeConsolidatedReportRoutingModule,
    FormsModule,
        ReactiveFormsModule,
        OTPModalModule,
        MatIconModule,
        MatTooltipModule,
         NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
            TableSearchFilterModule
  ]
})
export class BankGuaranteeConsolidatedReportModule { }
