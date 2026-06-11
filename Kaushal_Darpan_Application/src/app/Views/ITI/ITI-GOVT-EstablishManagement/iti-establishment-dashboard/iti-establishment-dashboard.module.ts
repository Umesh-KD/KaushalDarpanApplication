import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';

import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ITIEstablishmentDashboardComponent } from './iti-establishment-dashboard.component';
import { ITIEstablishmentDashboardRoutingModule } from './iti-establishment-dashboard-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    ITIEstablishmentDashboardComponent
  ],
  imports: [
    CommonModule,
    ITIEstablishmentDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    HighchartsChartModule,
  ]
})
export class ITIEstablishmentDashboardModule { }
