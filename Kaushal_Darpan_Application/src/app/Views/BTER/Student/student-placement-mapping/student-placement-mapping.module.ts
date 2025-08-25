import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPlacementMappingRoutingModule } from './student-placement-mapping-routing.module';
import { StudentPlacementMappingComponent } from './student-placement-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    StudentPlacementMappingComponent
  ],
  imports: [
    CommonModule,
    StudentPlacementMappingRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class StudentPlacementMappingModule { }
