import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateLetterRoutingModule } from './certificate-letter-routing.module';
import { CertificateLetterComponent } from './certificate-letter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    CertificateLetterComponent
  ],
  imports: [
    CommonModule,
    CertificateLetterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class CertificateLetterModule { }


