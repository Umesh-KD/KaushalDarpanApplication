import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCenterSuperintendentRoutingModule } from './iti-center-superintendent-routing.module';
import { ItiCenterSuperintendentComponent } from './iti-center-superintendent.component';
import { RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ItiCenterSuperintendentComponent
  ],
  imports: [
    CommonModule,
    TableSearchFilterModule,
    FormsModule, ReactiveFormsModule,
    ItiCenterSuperintendentRoutingModule,
    OTPModalModule
  ]
})
export class ItiCenterSuperintendentModule { }
