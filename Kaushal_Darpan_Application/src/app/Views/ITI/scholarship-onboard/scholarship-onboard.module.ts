import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScholarshipOnboardRoutingModule } from './scholarship-onboard-routing.module';
import { ScholarshipOnboardComponent } from './scholarship-onboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ScholarshipOnboardComponent
  ],
  imports: [
    CommonModule,
    ScholarshipOnboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ScholarshipOnboardModule { }
