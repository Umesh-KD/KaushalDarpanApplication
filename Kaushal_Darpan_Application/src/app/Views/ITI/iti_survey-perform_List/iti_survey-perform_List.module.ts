import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { ITIsurveyperformListRoutingModule } from './iti_survey-perform_List-routing.module';
import { ITIsurveyperformListComponent } from './iti_survey-perform_List.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ITIsurveyperformListComponent
  ],
  imports: [
    CommonModule,
    ITIsurveyperformListRoutingModule,
    FormsModule, ReactiveFormsModule,
    TableSearchFilterModule,
  ]
})
export class ITIsurveyperformListModule { }
