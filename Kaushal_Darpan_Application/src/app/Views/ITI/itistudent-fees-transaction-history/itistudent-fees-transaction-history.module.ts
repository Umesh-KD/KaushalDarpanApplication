import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITIStudentFeesTransactionHistoryRoutingModule } from './itistudent-fees-transaction-history-routing.module';
import { ITIStudentFeesTransactionHistoryComponent } from './itistudent-fees-transaction-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: ITIStudentFeesTransactionHistoryComponent }];

@NgModule({
  declarations: [
    ITIStudentFeesTransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    ITIStudentFeesTransactionHistoryRoutingModule,
    FormsModule,
    RouterModule.forChild(routes),
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ITIStudentFeesTransactionHistoryModule { }
