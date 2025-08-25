import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementStudentRoutingModule } from './placement-student-routing.module';
import { PlacementStudentComponent } from './placement-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PlacementStudentComponent
  ],
  imports: [
    CommonModule,
    PlacementStudentRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class PlacementStudentModule { }
