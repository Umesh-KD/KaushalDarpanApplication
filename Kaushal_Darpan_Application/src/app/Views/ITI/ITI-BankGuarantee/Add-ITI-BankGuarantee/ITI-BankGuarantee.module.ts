import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIBankGuaranteeRoutingModule } from './ITI-BankGuarantee-routing.module';
import { ITIBankGuaranteeComponent } from './ITI-BankGuarantee.component';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITIBankGuaranteeComponent
  ],
  imports: [
    CommonModule,
    ITIBankGuaranteeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, MatTooltipModule,
    TableSearchFilterModule
  ]
})
export class ITIBankGuaranteeModule { }
