import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListhostelfeemanagementRoutingModule } from './List-hostel-fee-management-routing.module';
import { ListhostelfeemanagementComponent } from './List-hostel-fee-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
@NgModule({
  declarations: [
    ListhostelfeemanagementComponent
  ],
  imports: [
    CommonModule,
    ListhostelfeemanagementRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, MatTooltipModule,
    TableSearchFilterModule
  ]
})
export class ListhostelfeemanagementModule { }
