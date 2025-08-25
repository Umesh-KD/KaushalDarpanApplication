import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectStudentVerificationListRoutingModule } from './direct-student-verification-list-routing.module';
import { DirectStudentVerificationListComponent } from './direct-student-verification-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';


@NgModule({
  declarations: [
    DirectStudentVerificationListComponent
  ],
  imports: [
    CommonModule,
    DirectStudentVerificationListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, StudentStatusHistoryModule
  ]
})
export class DirectStudentVerificationListModule { }
