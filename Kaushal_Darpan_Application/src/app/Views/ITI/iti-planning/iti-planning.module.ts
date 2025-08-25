import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPlanningRoutingModule } from './iti-planning-routing.module';
import { ItiPlanningComponent } from './iti-planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ItiPlanningComponent
  ],
  imports: [
    CommonModule,
    ItiPlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OTPModalModule

  ]
})
export class ItiPlanningModule { }
