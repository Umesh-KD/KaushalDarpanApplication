import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPlanningRoutingModule } from './iti-planning-routing.module';
import { ItiPlanningComponent } from './iti-planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ItiPlanningComponent
  ],
  imports: [
    CommonModule,
    ItiPlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OTPModalModule,
    MatIconModule,
    MatTooltipModule

  ]
})
export class ItiPlanningModule { }
