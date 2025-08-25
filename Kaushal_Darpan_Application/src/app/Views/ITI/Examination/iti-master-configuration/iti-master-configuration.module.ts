import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITIMasterConfigurationRoutingModule } from './iti-master-configuration-routing.module';



import { ITISerialMasterComponent } from './serial-master/iti-serial-master.component';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ITISessionConfigurationComponent } from './session-configuration/iti-session-configuration.component';
import { ITIFeeConfigurationComponent } from './fee-configuration/iti-fee-configuration.component';
import { ITIMasterConfigurationComponent } from './iti-master-configuration.component';
import { MaterialModule } from '../../../../material.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ITIDateConfigurationComponent } from './date-configuration/iti-date-configuration.component';
import { ITISignatureMasterComponent } from './signature/iti-signature.component';


@NgModule({
  declarations: [ITIMasterConfigurationComponent, ITIDateConfigurationComponent, ITIFeeConfigurationComponent, ITISerialMasterComponent, ITISessionConfigurationComponent, ITISignatureMasterComponent],
  imports: [
    CommonModule,
    ITIMasterConfigurationRoutingModule,
    LoaderModule,
    FormsModule, ReactiveFormsModule, MaterialModule, NgxMaterialTimepickerModule,TableSearchFilterModule  
  ]
})
export class ITIMasterConfigurationModule { }
