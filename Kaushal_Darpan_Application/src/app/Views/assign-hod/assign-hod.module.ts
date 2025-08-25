import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignHodRoutingModule } from './assign-hod-routing.module';
import { AssignHodComponent } from './assign-hod.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AssignHodComponent
  ],
  imports: [
    CommonModule,
    AssignHodRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AssignHodModule { }
