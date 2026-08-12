import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

import { MigrationCertificateDownloadComponent } from './MigrationCertificateDownload.component';
import { MigrationCertificateDownloadRoutingModule } from './MigrationCertificateDownload-routing.module';




@NgModule({
  declarations: [
    MigrationCertificateDownloadComponent
  ],
  imports: [
    CommonModule,
    MigrationCertificateDownloadRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
  ]
})
export class MigrationCertificateDownloadModule { }
