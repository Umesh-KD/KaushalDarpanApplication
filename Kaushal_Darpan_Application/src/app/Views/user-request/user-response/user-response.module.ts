import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserResponseComponent } from './user-response.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserResponseRoutingModule } from './user-response-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UserResponseComponent,
  ],
  imports: [
    CommonModule,
    UserResponseRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule,
    LoaderModule
  ]
})
export class UserResponseModule { }
