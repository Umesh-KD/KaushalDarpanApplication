import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';

import { AddStaffInitialDetailsComponent } from './add-staff-initial-details.component';
import { AddStaffInitialDetailsRoutingModule } from './add-staff-initial-details-routing.module';


@NgModule({
  declarations: [
    AddStaffInitialDetailsComponent,
  ],
  imports: [
    CommonModule,
    AddStaffInitialDetailsRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule
  ]
})
export class AddStaffInitialDetailsModule { }
