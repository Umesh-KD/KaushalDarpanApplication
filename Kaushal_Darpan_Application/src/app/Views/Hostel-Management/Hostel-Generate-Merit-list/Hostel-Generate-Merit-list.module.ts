import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelGenerateMeritlistRoutingModule } from './Hostel-Generate-Merit-list-routing.module';
import { HostelGenerateMeritlistComponent } from './Hostel-Generate-Merit-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelGenerateMeritlistComponent
  ],
  imports: [
    CommonModule,
    HostelGenerateMeritlistRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelGenerateMeritlistModule { }
