import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { VerifyCenterSuperintendentComponent } from './verify-center-superintendent.component';
import { VerifyCenterSuperintendentRoutingModule } from './verify-center-superintendent-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';



@NgModule({
  declarations: [
    VerifyCenterSuperintendentComponent
  ],
  imports: [
    CommonModule,
    VerifyCenterSuperintendentRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    OTPModalModule
  ]
})
export class VerifyCenterSuperintendentModule { }
