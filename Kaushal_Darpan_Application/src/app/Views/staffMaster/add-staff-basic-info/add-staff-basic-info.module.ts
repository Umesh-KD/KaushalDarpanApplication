import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddStaffBasicInfoRoutingModule } from './add-staff-basic-info-routing.module';
import { AddStaffBasicInfoComponent } from './add-staff-basic-info.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AddStaffBasicInfoComponent
  ],
  imports: [
    CommonModule,
    AddStaffBasicInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class AddStaffBasicInfoModule { }
