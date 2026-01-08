import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointITIExaminerRoutingModule } from './appoint-itiexaminer-routing.module';
import { AppointITIExaminerComponent } from './appoint-itiexaminer.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    AppointITIExaminerComponent
  ],
  imports: [
    CommonModule,
    AppointITIExaminerRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class AppointITIExaminerModule { }
