import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddhostelfeemanagementRoutingModule } from './Add-hostel-fee-management-routing.module';
import { AddhostelfeemanagementComponent } from './Add-hostel-fee-management.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    AddhostelfeemanagementComponent
  ],
  imports: [
    CommonModule,
    AddhostelfeemanagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, MatTooltipModule,
    TableSearchFilterModule
  ]
})
export class AddhostelfeemanagementModule { }
