import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIGovtEMSanctionedPostBasedInstituteRoutingModule } from './ITI-Govt-EM-SanctionedPostBasedInstitute-routing.module';
import { ITIGovtEMSanctionedPostBasedInstituteComponent } from './ITI-Govt-EM-SanctionedPostBasedInstitute.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ITIGovtEMSanctionedPostBasedInstituteComponent
  ],
  imports: [
    CommonModule,
    ITIGovtEMSanctionedPostBasedInstituteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ITIGovtEMSanctionedPostBasedInstituteModule { }
