import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryTrainingListRoutingModule } from './IndustryTraining-list-routing.module';
import { IndustryTrainingListComponent } from './IndustryTraining-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';


@NgModule({
  declarations: [
    IndustryTrainingListComponent
  ],
  imports: [
    CommonModule,
    IndustryTrainingListRoutingModule,
    FormsModule,
    TableSearchFilterModule,

  ]
})
export class IndustryTrainingListModule { }
