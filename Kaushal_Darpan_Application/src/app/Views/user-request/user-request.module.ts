import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRequestRoutingModule } from './user-request-routing.module';
import { UserRequestComponent } from './user-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UserRequestComponent
  ],
  imports: [
    CommonModule,
    UserRequestRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UserRequestModule { }
