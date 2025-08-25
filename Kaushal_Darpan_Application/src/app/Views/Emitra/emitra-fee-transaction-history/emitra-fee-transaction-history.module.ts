import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmitraFeeTransactionHistoryComponent } from './emitra-fee-transaction-history.component';

const routes: Routes = [{ path: '', component: EmitraFeeTransactionHistoryComponent }];

@NgModule({
  declarations: [
    EmitraFeeTransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [EmitraFeeTransactionHistoryComponent]
})
export class EmitraFeeTransactionHistoryModule { }
