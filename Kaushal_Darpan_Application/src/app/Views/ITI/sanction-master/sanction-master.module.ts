import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanctionMasterRoutingModule } from './sanction-master-routing.module';
import { SanctionMasterComponent } from './sanction-master.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SanctionMasterComponent
  ],
  imports: [
    CommonModule,
    SanctionMasterRoutingModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SanctionMasterModule { }
