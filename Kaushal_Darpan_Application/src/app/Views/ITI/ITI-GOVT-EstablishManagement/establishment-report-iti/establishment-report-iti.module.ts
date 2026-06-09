import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';

import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EstablishmentReportITIComponent } from './establishment-report-iti.component';
import { EstablishmentReportITIRoutingModule } from './establishment-report-iti-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    EstablishmentReportITIComponent
  ],
  imports: [
    CommonModule,
    EstablishmentReportITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
  ]
})
export class EstablishmentReportITIModule { }
