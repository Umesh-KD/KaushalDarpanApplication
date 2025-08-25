import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { PlacementVerifiedStudentTpoComponent } from './placement-verified-student-tpo.component';
import { PlacementVerifiedStudentTpoRoutingModule } from './placement-verified-student-tpo-routing.module';

@NgModule({
  declarations: [
    PlacementVerifiedStudentTpoComponent
  ],
  imports: [
    CommonModule,
    PlacementVerifiedStudentTpoRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class PlacementVerifiedStudentTpoModule { }
