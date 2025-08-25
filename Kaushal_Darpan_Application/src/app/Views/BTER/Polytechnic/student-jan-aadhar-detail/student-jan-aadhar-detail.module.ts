import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentJanAadharDetailRoutingModule } from './student-jan-aadhar-detail-routing.module';
import { StudentJanAadharDetailComponent } from './student-jan-aadhar-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StudentJanAadharDetailComponent
  ],
  imports: [
    CommonModule,
    StudentJanAadharDetailRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentJanAadharDetailModule { }
