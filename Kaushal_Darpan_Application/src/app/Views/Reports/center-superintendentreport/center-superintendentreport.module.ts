import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterSuperintendentreportRoutingModule } from './center-superintendentreport-routing.module';
import { CenterSuperintendentreportComponent } from './center-superintendentreport.component';

//import { ItiCenterSuperintendentRoutingModule } from './iti-center-superintendent-routing.module';
//import { ItiCenterSuperintendentComponent } from './iti-center-superintendent.component';
import { RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';



@NgModule({
  declarations: [
    CenterSuperintendentreportComponent
  ],
  imports: [
    CommonModule,
    TableSearchFilterModule,
    FormsModule, ReactiveFormsModule,


  
    CenterSuperintendentreportRoutingModule
  ]
})
export class CenterSuperintendentreportModule { }
