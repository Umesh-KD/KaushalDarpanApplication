import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { THTEPrincipleApplicationListComponent } from './thte-principle-application-list.component';
import { THTEPrincipleApplicationListRoutingModule } from './thte-principle-application-list-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    THTEPrincipleApplicationListComponent
  ],
  imports: [
    CommonModule,
    THTEPrincipleApplicationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    OTPModalModule,
  ]
})
export class THTEPrincipleApplicationListModule { }
