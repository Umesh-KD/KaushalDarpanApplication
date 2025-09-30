import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { StaffWorkRegularArrangementReortComponent } from './StaffWorkRegularArrangementReort.component';
import { StaffWorkRegularArrangementReortRoutingModule } from './StaffWorkRegularArrangementReort-routing.module';


@NgModule({
  declarations: [
    StaffWorkRegularArrangementReortComponent,
  ],
  imports: [
    CommonModule,
    StaffWorkRegularArrangementReortRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule
  ]
})
export class StaffWorkRegularArrangementReortModule { }
