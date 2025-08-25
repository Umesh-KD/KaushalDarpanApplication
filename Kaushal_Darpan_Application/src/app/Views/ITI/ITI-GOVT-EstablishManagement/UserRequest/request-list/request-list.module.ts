import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { UserRequestListComponent } from './request-list.component';
import { TableSearchFilterPipe } from '../../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserRequestListRoutingModule } from './request-list-routing.module';

@NgModule({
  declarations: [
    UserRequestListComponent
  ],
  imports: [
    CommonModule,
    UserRequestListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class UserRequestListModule { }
