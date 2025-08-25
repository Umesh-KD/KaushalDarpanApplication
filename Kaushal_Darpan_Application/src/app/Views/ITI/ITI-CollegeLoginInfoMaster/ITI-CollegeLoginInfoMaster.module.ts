import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITICollegeLoginInfoMasterRoutingModule } from './ITI-CollegeLoginInfoMaster-routing.module';
import { ITICollegeLoginInfoMasterComponent } from './ITI-CollegeLoginInfoMaster.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
@NgModule({
  declarations: [
    ITICollegeLoginInfoMasterComponent
  ],
  imports: [
    CommonModule,
    ITICollegeLoginInfoMasterRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ITICollegeLoginInfoMasterModule { }
