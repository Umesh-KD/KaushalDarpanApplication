import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelMeritlistRoutingModule } from './HostelMerit-list-routing.module';
import { HostelMeritlistComponent } from './HostelMerit-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelMeritlistComponent
  ],
  imports: [
    CommonModule,
    HostelMeritlistRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelMeritlistModule { }
