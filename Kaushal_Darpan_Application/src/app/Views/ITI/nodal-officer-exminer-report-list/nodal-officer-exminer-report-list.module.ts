import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NodalOfficerExminerReportListComponent } from './nodal-officer-exminer-report-list.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NodalOfficerExminerReportListRoutingModule } from './nodal-officer-exminer-report-list-routing.module';

@NgModule({
  declarations: [
    NodalOfficerExminerReportListComponent
  ],
  imports: [
    CommonModule,    
    NodalOfficerExminerReportListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class NodalOfficerExminerReportListModule { }
