import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti10ThAddmissionStatisticsRoutingModule } from './iti-10th-admission-statistics-routing.module';
import { Iti10ThAddmissionStatisticsComponent } from './iti-10th-admission-statistics.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti10ThAddmissionStatisticsComponent
  ],
  imports: [
    CommonModule,
    Iti10ThAddmissionStatisticsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti10ThAddmissionStatisticsModule { }











