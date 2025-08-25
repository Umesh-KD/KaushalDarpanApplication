import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PaperSetterVerifyComponent } from './paper-setter-verify.component';
import { PaperSetterVerifyRoutingModule } from './paper-setter-verify-routing.module';


@NgModule({
  declarations: [
    PaperSetterVerifyComponent
  ],
  imports: [
    CommonModule,
    PaperSetterVerifyRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PaperSetterVerifyModule { }
