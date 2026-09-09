import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCategoryWiseSeatUtilizationRoutingModule } from './iti-category-wise-seat-utilization-routing.module';
import { ItiCategoryWiseSeatUtilizationComponent } from './iti-category-wise-seat-utilization.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiCategoryWiseSeatUtilizationComponent
  ],
  imports: [
    CommonModule,
    ItiCategoryWiseSeatUtilizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiCategoryWiseSeatUtilizationModule { }











