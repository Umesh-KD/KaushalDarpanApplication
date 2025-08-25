import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ItiFormsPriorityListComponent } from './iti-forms-priority-list.component';
import { ItiFormsPriorityListRoutingModule } from './iti-forms-priority-list-routing.module';

@NgModule({
  declarations: [
    ItiFormsPriorityListComponent
  ],
  imports: [
    CommonModule,
    ItiFormsPriorityListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [ItiFormsPriorityListComponent] 
})
export class ItiFormsPriorityListModule { }
