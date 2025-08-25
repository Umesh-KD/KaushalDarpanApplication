import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamCoOrdinatorRelivingFormatRoutingModule } from './exam-co-ordinator-reliving-format-routing.module';
import { ExamCoOrdinatorRelivingFormatComponent } from './exam-co-ordinator-reliving-format.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ExamCoOrdinatorRelivingFormatComponent
  ],
  imports: [
    CommonModule,
    ExamCoOrdinatorRelivingFormatRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule
  ]
})
export class ExamCoOrdinatorRelivingFormatModule { }
