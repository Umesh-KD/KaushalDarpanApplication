import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadProvisionalCertificateRoutingModule } from './download-provisional-certificate-routing.module';
import { DownloadProvisionalCertificateComponent } from './download-provisional-certificate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    DownloadProvisionalCertificateComponent
  ],
  imports: [
    CommonModule,
    DownloadProvisionalCertificateRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DownloadProvisionalCertificateModule { }
