import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { MaterialModule } from '../../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { MasterConfigurationBTERComponent } from './master-configuration-bter.component';
import { DateConfigurationBTERComponent } from './date-configuration-bter/date-configuration-bter.component';
import { FeeConfigurationBTERComponent } from './fee-configuration-bter/fee-configuration-bter.component';
import { SerialMasterBTERComponent } from './serial-master-bter/serial-master-bter.component';
import { SessionConfigurationBTERComponent } from './session-configuration-bter/session-configuration-bter.component';
import { MasterConfigurationBTERRoutingModule } from './master-configuration-bter-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllotmentConfigurationBTERComponent } from './allotment-configuration-bter/allotment-configuration-bter.component';
import { BterSignatureMasterComponent } from './signature-bter/bter-signature.component';


@NgModule({
  declarations: [MasterConfigurationBTERComponent, DateConfigurationBTERComponent, FeeConfigurationBTERComponent, SerialMasterBTERComponent, SessionConfigurationBTERComponent, AllotmentConfigurationBTERComponent, BterSignatureMasterComponent],
  imports: [
    CommonModule,
    MasterConfigurationBTERRoutingModule,
    LoaderModule,
    FormsModule, ReactiveFormsModule, MaterialModule, NgxMaterialTimepickerModule, TableSearchFilterModule, NgMultiSelectDropDownModule.forRoot()  
  ]
})
export class MasterConfigurationBTERModule { }
