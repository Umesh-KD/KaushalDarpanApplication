import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MarksheetDownloadRoutingModule } from './marksheet-download-routing.module';
import { MarksheetDownloadComponent } from './marksheet-download.component';




@NgModule({
  declarations: [
    MarksheetDownloadComponent
  ],
  imports: [
    CommonModule,
    MarksheetDownloadRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class MarksheetDownloadModule { }
