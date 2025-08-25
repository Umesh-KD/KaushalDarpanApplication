import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';

import { BterEMAddStaffDetailsComponent } from './bter-em-add-staff-details.component';
import { BterEMAddStaffDetailsRoutingModule } from './bter-em-add-staff-details-routing.module';


@NgModule({
  declarations: [
    BterEMAddStaffDetailsComponent,
  ],
  imports: [
    CommonModule,
    BterEMAddStaffDetailsRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule
  ]
})
export class BterEMAddStaffDetailsModule { }
