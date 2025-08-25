import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiExaminerListComponent } from './iti-examiner-list.component';
import { ItiExaminerListRoutingModule } from './iti-examiner-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiExaminerListComponent
  ],
  imports: [
    CommonModule,
    ItiExaminerListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ItiExaminerListModule { }
