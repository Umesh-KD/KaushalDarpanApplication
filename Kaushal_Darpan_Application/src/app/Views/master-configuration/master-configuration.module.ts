import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterConfigurationRoutingModule } from './master-configuration-routing.module';
import { MasterConfigurationComponent } from './master-configuration.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { DateConfigurationComponent } from './date-configuration/date-configuration.component';

import { SerialMasterComponent } from './serial-master/serial-master.component';
import { MaterialModule } from '../../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { SessionConfigurationComponent } from './session-configuration/session-configuration.component';
import { FeeConfigurationComponent } from './fee-configuration/fee-configuration.component';


@NgModule({
  declarations: [MasterConfigurationComponent, DateConfigurationComponent, FeeConfigurationComponent, SerialMasterComponent, SessionConfigurationComponent],
  imports: [
    CommonModule,
    MasterConfigurationRoutingModule,
    LoaderModule,
    FormsModule, ReactiveFormsModule, MaterialModule, NgxMaterialTimepickerModule,TableSearchFilterModule  
  ]
})
export class MasterConfigurationModule { }
