import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';

import { EMPrincipleStaffComponent } from './em-principle-staff.component';
import { EMPrincipleStaffRoutingModule } from './em-principle-staff-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    EMPrincipleStaffComponent,
  ],
  imports: [
    CommonModule,
    EMPrincipleStaffRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class EMPrincipleStaffModule { }
