import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti10ThCategoryWiseSeatUtilizationRoutingModule } from './iti-10th-category-wise-seat-utilization-routing.module';
import { Iti10ThCategoryWiseSeatUtilizationComponent } from './iti-10th-category-wise-seat-utilization.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti10ThCategoryWiseSeatUtilizationComponent
  ],
  imports: [
    CommonModule,
    Iti10ThCategoryWiseSeatUtilizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti10ThCategoryWiseSeatUtilizationModule { }











