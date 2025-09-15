import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ExtraOrdinaryLeavesForStaffRoutingModule } from './ExtraOrdinaryLeavesForStaff-routing.module';
import { ExtraOrdinaryLeavesForStaffComponent } from './ExtraOrdinaryLeavesForStaff.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ExtraOrdinaryLeavesForStaffComponent
  ],
  imports: [
    CommonModule,
    ExtraOrdinaryLeavesForStaffRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ExtraOrdinaryLeavesForStaffModule { }
