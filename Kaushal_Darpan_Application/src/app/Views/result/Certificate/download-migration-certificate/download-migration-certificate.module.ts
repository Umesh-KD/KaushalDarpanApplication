import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadMigrationCertificateRoutingModule } from './download-migration-certificate-routing.module';
import { DownloadMigrationCertificateComponent } from './download-migration-certificate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    DownloadMigrationCertificateComponent
  ],
  imports: [
    CommonModule,
    DownloadMigrationCertificateRoutingModule,
     FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DownloadMigrationCertificateModule { }
