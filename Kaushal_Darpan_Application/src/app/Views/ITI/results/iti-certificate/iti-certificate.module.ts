import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCertificateRoutingModule } from './iti-certificate-routing.module';
import { ItiCertificateComponent } from './iti-certificate.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiCertificateComponent
  ],
  imports: [
    CommonModule,
    ItiCertificateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiCertificateModule { }











