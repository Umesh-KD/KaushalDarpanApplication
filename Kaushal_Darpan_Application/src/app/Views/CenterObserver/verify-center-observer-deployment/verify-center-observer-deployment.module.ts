import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { VerifyCenterObserverDeploymentComponent } from './verify-center-observer-deployment.component';
import { VerifyCenterObserverDeploymentRoutingModule } from './verify-center-observer-deployment-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';



@NgModule({
  declarations: [
    VerifyCenterObserverDeploymentComponent
  ],
  imports: [
    CommonModule,
    VerifyCenterObserverDeploymentRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    OTPModalModule
  ]
})
export class VerifyCenterObserverDeploymentModule { }
