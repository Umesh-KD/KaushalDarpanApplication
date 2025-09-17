import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { StudentListMasterComponent } from './student-list-master.component';
import { StudentListMasterRoutingModule } from './student-list-master.routing.module';

@NgModule({
  declarations: [
    StudentListMasterComponent
  ],
  imports: [
    CommonModule,
    StudentListMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentListMasterModule { }
