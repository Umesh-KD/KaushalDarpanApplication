import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementShortlistedStudentsRoutingModule } from './placement-shortlisted-students-routing.module';
import { PlacementShortlistedStudentsComponent } from './placement-shortlisted-students.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PlacementShortlistedStudentsComponent
  ],
  imports: [
    CommonModule,
    PlacementShortlistedStudentsRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class PlacementShortlistedStudentsModule { }
