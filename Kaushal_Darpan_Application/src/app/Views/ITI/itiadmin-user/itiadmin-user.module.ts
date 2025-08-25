import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIAdminUserRoutingModule } from './itiadmin-user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ITIAdminUserComponent } from './itiadmin-user.component';


@NgModule({
  declarations: [
    ITIAdminUserComponent
  ],
  imports: [
    CommonModule,
    ITIAdminUserRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ITIAdminUserModule { }
