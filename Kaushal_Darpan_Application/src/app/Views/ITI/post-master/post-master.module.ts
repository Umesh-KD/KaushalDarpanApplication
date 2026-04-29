import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostMasterRoutingModule } from './post-master-routing.module';
import { PostMasterComponent } from './post-master.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    PostMasterComponent
  ],
  imports: [
    CommonModule,
    PostMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    OTPModalModule
  ]
})
export class PostMasterModule { }
