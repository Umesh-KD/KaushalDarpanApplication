import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMasterRoutingModule } from './user-master-routing.module';
import { UserMasterComponent } from './user-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UserMasterComponent
  ],
  imports: [
    CommonModule,
    UserMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UserMasterModule { }
