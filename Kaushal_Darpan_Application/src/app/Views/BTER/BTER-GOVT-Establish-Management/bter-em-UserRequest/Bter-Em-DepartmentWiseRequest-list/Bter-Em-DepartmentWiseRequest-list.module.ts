import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { BterEmDepartmentWiseRequestlistComponent } from './Bter-Em-DepartmentWiseRequest-list.component';
import { TableSearchFilterPipe } from '../../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BterEmDepartmentWiseRequestlistRoutingModule } from './Bter-Em-DepartmentWiseRequest-list-routing.module';

@NgModule({
  declarations: [
    BterEmDepartmentWiseRequestlistComponent
  ],
  imports: [
    CommonModule,
    BterEmDepartmentWiseRequestlistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class BterEmDepartmentWiseRequestlistModule { }
