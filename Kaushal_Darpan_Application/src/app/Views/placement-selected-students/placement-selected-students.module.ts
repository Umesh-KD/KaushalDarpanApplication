import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementSelectedStudentsRoutingModule } from './placement-selected-students-routing.module';
import { PlacementSelectedStudentsComponent } from './placement-selected-students.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PlacementSelectedStudentsComponent
  ],
  imports: [
    CommonModule,
    PlacementSelectedStudentsRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,NgSelectModule
  ]
})
export class PlacementSelectedStudentsModule { }
