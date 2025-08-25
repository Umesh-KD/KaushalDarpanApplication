import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AllotmentConfigurationBTERRoutingModule } from './allotment-configuration-bter-routing.module';
import { AllotmentConfigurationBTERComponent } from './allotment-configuration-bter.component';


@NgModule({
  declarations: [
    AllotmentConfigurationBTERComponent
  ],
  imports: [
    CommonModule,
    AllotmentConfigurationBTERRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AllotmentConfigurationBTERModule { }
