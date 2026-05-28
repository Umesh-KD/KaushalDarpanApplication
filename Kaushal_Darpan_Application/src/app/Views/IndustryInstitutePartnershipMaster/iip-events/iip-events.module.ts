import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { IIPEventsRoutingModule } from './iip-events-routing.module';
import { iipeventsComponent } from './iip-events.component';

@NgModule({
  declarations: [
    iipeventsComponent
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
