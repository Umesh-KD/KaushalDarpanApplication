import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMZonalOfficeITIPrincipalMasterRoutingModule } from './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster-routing.module';
import { ITIGovtEMZonalOfficeITIPrincipalMasterComponent } from './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMZonalOfficeITIPrincipalMasterComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMZonalOfficeITIPrincipalMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMZonalOfficeITIPrincipalMasterModule { }
