import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMZonalOfficeMasterRoutingModule } from './ITI-Govt-EM-ZonalOfficeMaster-routing.module';
import { ITIGovtEMZonalOfficeMasterComponent } from './ITI-Govt-EM-ZonalOfficeMaster.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMZonalOfficeMasterComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMZonalOfficeMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMZonalOfficeMasterModule { }
