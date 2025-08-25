import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ApplicationFeesTransactionHistoryComponent } from './application-fees-transaction-history.component';
import { ApplicationFeesTransactionHistoryRoutingModule } from './application-fees-transaction-history-routing.module';


@NgModule({
    declarations: [
        ApplicationFeesTransactionHistoryComponent
    ],
    imports: [
        CommonModule,
        ApplicationFeesTransactionHistoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class ApplicationFeesTransactionHistoryModule { }
