import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';

import { SignedCopyOfResultMasterComponent } from './SignedCopyOfResultMaster.component';
import { SignedCopyOfResultMasterRoutingModule } from './SignedCopyOfResultMaster.routing.module';

@NgModule({
  declarations: [
    SignedCopyOfResultMasterComponent
  ],
  imports: [
    CommonModule,
    SignedCopyOfResultMasterRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class SignedCopyOfResultMasterModule { }
