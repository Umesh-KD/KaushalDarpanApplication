import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMZonalOfficeListRoutingModule } from './ITI-Govt-EM-ZonalOfficeList-routing.module';
import { ITIGovtEMZonalOfficeListComponent } from './ITI-Govt-EM-ZonalOfficeList.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMZonalOfficeListComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMZonalOfficeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMZonalOfficeListModule { }
