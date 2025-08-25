import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { BterGovtEMSanctionedPostBasedInstituteListRoutingModule } from './Bter-Govt-EM-SanctionedPostBasedInstituteList-routing.module';
import { BterGovtEMSanctionedPostBasedInstituteListComponent } from './Bter-Govt-EM-SanctionedPostBasedInstituteList.component';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    BterGovtEMSanctionedPostBasedInstituteListComponent
  ],
  imports: [
    CommonModule,
    BterGovtEMSanctionedPostBasedInstituteListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class BterGovtEMSanctionedPostBasedInstituteListModule { }
