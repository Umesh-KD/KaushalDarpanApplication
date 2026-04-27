import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiExaminationTradeComponent } from './iti-examination-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ItiExaminationTradeComponent }];


@NgModule({
  declarations: [
    ItiExaminationTradeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ItiExaminationTradeModule { }
