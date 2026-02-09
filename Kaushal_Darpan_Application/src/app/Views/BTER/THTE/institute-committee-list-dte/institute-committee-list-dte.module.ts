import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { InstituteCommitteeListDTEComponent } from './institute-committee-list-dte.component';
import { InstituteCommitteeListDTERoutingModule } from './institute-committee-list-dte-routing.module';


@NgModule({
  declarations: [
    InstituteCommitteeListDTEComponent
  ],
  imports: [
    CommonModule,
    InstituteCommitteeListDTERoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    OTPModalModule,
  ]
})
export class InstituteCommitteeListDTEModule { }
