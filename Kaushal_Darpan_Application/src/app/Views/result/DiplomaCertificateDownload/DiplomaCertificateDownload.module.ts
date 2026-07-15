import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

import { DiplomaCertificateDownloadComponent } from './DiplomaCertificateDownload.component';
import { DiplomaCertificateDownloadRoutingModule } from './DiplomaCertificateDownload-routing.module';




@NgModule({
  declarations: [
    DiplomaCertificateDownloadComponent
  ],
  imports: [
    CommonModule,
    DiplomaCertificateDownloadRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
  ]
})
export class DiplomaCertificateDownloadModule { }
