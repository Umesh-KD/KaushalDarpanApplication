import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { IIPEventsComponent } from './iip-events.component';
import { IIPEventsRoutingModule } from './iip-events-routing.module';

@NgModule({
  declarations: [
    IIPEventsComponent
  ],
  imports: [
    CommonModule,
    IIPEventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule
  ]
})
export class IIPEventsModule { }
