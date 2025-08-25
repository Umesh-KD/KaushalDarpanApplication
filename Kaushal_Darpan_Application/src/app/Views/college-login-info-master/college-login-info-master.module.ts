import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegeLoginInfoMasterRoutingModule } from './college-login-info-master-routing.module';
import { CollegeLoginInfoMasterComponent } from './college-login-info-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CollegeLoginInfoMasterComponent
  ],
  imports: [
    CommonModule,
    CollegeLoginInfoMasterRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class CollegeLoginInfoMasterModule { }
