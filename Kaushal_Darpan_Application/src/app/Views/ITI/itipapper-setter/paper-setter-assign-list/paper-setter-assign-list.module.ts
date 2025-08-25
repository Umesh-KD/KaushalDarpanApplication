import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperSetterAssignListRoutingModule } from './paper-setter-assign-list-routing.module';
import { PaperSetterAssignListComponent } from './paper-setter-assign-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PaperSetterAssignListComponent
  ],
  imports: [
    CommonModule,
    PaperSetterAssignListRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PaperSetterAssignListModule { }
