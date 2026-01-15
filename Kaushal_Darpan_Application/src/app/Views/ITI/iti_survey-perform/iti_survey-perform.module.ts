import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ITIsurveyperformRoutingModule } from './iti_survey-perform-routing.module';
import { ITIsurveyperformComponent } from './iti_survey-perform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ITIsurveyperformComponent
  ],
  imports: [
    CommonModule,
    ITIsurveyperformRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class ITIsurveyperformModule { }
