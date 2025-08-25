import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFeesTransactionHistoryRptComponent } from './student-fees-transaction-history-rpt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: StudentFeesTransactionHistoryRptComponent }];

@NgModule({
  declarations: [
    StudentFeesTransactionHistoryRptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class StudentFeesTransactionHistoryRptModule { }
