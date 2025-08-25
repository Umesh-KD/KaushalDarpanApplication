import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { citizenquerydetailsRoutingModule } from './citizenquery-details-routing.module';
import { CitizenqueryDetailsComponent } from './citizenquery-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CitizenqueryDetailsComponent,
  ],
  imports: [
    CommonModule,
    citizenquerydetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class CitizenqueryDetailsModule { }
