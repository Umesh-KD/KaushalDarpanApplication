import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatIntakePlanningRoutingModule } from './seat-intake-planning-routing.module';
import { SeatIntakePlanningComponent } from './seat-intake-planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SeatIntakePlanningComponent
  ],
  imports: [
    CommonModule,
    SeatIntakePlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    NgSelectModule
  ]
})
export class SeatIntakePlanningModule { }
