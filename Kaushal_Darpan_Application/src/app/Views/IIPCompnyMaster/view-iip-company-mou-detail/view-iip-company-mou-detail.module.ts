import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewIipCompanyMouDetailRoutingModule } from './view-iip-company-mou-detail-routing.module';
import { ViewIipCompanyMouDetailComponent } from './view-iip-company-mou-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ViewIipCompanyMouDetailComponent
  ],
  imports: [
    CommonModule,
    ViewIipCompanyMouDetailRoutingModule
    , FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ViewIipCompanyMouDetailModule { }
