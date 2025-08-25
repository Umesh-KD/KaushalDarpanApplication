import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffDashboardRoutingModule } from '../staff-dashboard/staff-dashboard.routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { SecretaryJdConfidentialDashboardComponent } from './secretary-jd-confidential-dashboard.component';
import { SecretaryJdConfidentialDashboardRoutingModule } from './secretary-jd-confidential-dashboard-routing.module';


@NgModule({
  declarations: [
    SecretaryJdConfidentialDashboardComponent
  ],
  imports: [
    CommonModule,
    SecretaryJdConfidentialDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [ SecretaryJdConfidentialDashboardComponent]
})
export class SecretaryJdConfidentialDashboardModule { }
