import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiExaminerRoutingModule } from './iti-examiner-routing.module';
import { ItiExaminerComponent } from './iti-examiner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    ItiExaminerComponent
  ],
  imports: [
    CommonModule,
    ItiExaminerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiExaminerModule { }


