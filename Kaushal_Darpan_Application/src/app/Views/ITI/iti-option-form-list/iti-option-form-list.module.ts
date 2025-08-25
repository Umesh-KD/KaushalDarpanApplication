import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiOptionFormListRoutingModule } from './iti-option-form-list-routing.module';
import { ItiOptionFormListComponent } from './iti-option-form-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    ItiOptionFormListComponent
  ],
  imports: [
    CommonModule,
    ItiOptionFormListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   LoaderModule,
   TableSearchFilterModule
  ]
})
export class ItiOptionFormListModule { }
