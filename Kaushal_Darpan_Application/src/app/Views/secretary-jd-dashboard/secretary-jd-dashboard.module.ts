import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffDashboardRoutingModule } from '../staff-dashboard/staff-dashboard.routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { SecretaryJDDashboardComponent } from './secretary-jd-dashboard.component';
import { SecretaryJDDashboardRoutingModule } from './secretary-jd-dashboard-routing.module';


@NgModule({
  declarations: [
    SecretaryJDDashboardComponent
  ],
  imports: [
    CommonModule,
    SecretaryJDDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [ SecretaryJDDashboardComponent]
})
export class SecretaryJDDashboardModule { }
