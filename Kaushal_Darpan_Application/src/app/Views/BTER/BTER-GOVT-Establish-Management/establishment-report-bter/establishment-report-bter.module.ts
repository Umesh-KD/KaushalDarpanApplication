import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ViewStaffProfileModalModule } from '../view-staff-profile-modal/view-staff-profile-modal.model';
import { EstablishmentReportBTERComponent } from './establishment-report-bter.component';
import { EstablishmentReportBTERRoutingModule } from './establishment-report-bter-routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EstablishmentReportBTERComponent,
  ],
  imports: [
    CommonModule,
    EstablishmentReportBTERRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
    ViewStaffProfileModalModule,
    NgSelectModule, 
    // NgLabelTemplateDirective, 
    // NgOptionTemplateDirective, 
    // NgSelectComponent,
  ]
})
export class EstablishmentReportBTERModule { }
