import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { DownloadsComponent } from './downloads.component';
import { DownloadsRoutingModule } from './downloads-routing.module';


@NgModule({
  declarations: [
    DownloadsComponent
  ],
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class DownloadsModule { }
