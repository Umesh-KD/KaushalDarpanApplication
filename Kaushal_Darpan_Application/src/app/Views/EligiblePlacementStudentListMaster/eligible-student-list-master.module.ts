import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { EligibleStudentListMasterComponent } from './eligible-student-list-master.component';
import { EligibleStudentListMasterRoutingModule } from './eligible-student-list-master.routing.module';

@NgModule({
  declarations: [
    EligibleStudentListMasterComponent
  ],
  imports: [
    CommonModule,
    EligibleStudentListMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class EligibleStudentListMasterModule { }
