import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmitraFeePaymentListComponent } from './emitra-fee-payment-list.component';

const routes: Routes = [{ path: '', component: EmitraFeePaymentListComponent }];

@NgModule({
  declarations: [
    EmitraFeePaymentListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [EmitraFeePaymentListComponent]
})
export class EmitraFeePaymentListModule { }
