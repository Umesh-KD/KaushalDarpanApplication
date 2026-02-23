import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointInstructorListRoutingModule } from './appoint-instructor-list-routing.module';
import { AppointInstructorListComponent } from './appoint-instructor-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AppointInstructorListComponent
  ],
  imports: [
    CommonModule,
    AppointInstructorListRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AppointInstructorListModule { }
