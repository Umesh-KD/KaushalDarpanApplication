import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMSanctionedPostBasedInstituteListRoutingModule } from './ITI-Govt-EM-SanctionedPostBasedInstituteList-routing.module';
import { ITIGovtEMSanctionedPostBasedInstituteListComponent } from './ITI-Govt-EM-SanctionedPostBasedInstituteList.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMSanctionedPostBasedInstituteListComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMSanctionedPostBasedInstituteListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMSanctionedPostBasedInstituteListModule { }
