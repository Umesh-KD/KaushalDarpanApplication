import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

import { ProvisionalDiplomaCertificateDownloadComponent } from './ProvisionalDiplomaCertificateDownload.component';
import { ProvisionalDiplomaCertificateDownloadRoutingModule } from './ProvisionalDiplomaCertificateDownload-routing.module';




@NgModule({
  declarations: [
    ProvisionalDiplomaCertificateDownloadComponent
  ],
  imports: [
    CommonModule,
    ProvisionalDiplomaCertificateDownloadRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
  ]
})
export class ProvisionalDiplomaCertificateDownloadModule { }
