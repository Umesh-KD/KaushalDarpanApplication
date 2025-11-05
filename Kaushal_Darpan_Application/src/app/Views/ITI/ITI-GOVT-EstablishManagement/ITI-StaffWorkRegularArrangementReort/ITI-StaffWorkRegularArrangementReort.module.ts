import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { ITIStaffWorkRegularArrangementReortComponent } from './ITI-StaffWorkRegularArrangementReort.component';
import { ITIStaffWorkRegularArrangementReortRoutingModule } from './ITI-StaffWorkRegularArrangementReort-routing.module';


@NgModule({
  declarations: [
    ITIStaffWorkRegularArrangementReortComponent,
  ],
  imports: [
    CommonModule,
    ITIStaffWorkRegularArrangementReortRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule
  ]
})
export class ITIStaffWorkRegularArrangementReortModule { }
