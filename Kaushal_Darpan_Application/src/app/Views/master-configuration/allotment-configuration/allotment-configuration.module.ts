import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentConfigurationRoutingModule } from './allotment-configuration-routing.module';
import { AllotmentConfigurationComponent } from './allotment-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AllotmentConfigurationComponent
  ],
  imports: [
    CommonModule,
    AllotmentConfigurationRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AllotmentConfigurationModule { }
