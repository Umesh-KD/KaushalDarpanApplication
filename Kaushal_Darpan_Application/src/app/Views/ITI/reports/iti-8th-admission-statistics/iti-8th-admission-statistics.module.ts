import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti8ThAddmissionStatisticsRoutingModule } from './iti-8th-admission-statistics-routing.module';
import { Iti8ThAddmissionStatisticsComponent } from './iti-8th-admission-statistics.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti8ThAddmissionStatisticsComponent
  ],
  imports: [
    CommonModule,
    Iti8ThAddmissionStatisticsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti8ThAddmissionStatisticsModule { }











