import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationAccountsRoutingModule } from './renumeration-accounts-routing.module';
import { RenumerationAccountsComponent } from './renumeration-accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationAccountsComponent
  ],
  imports: [
    CommonModule,
    RenumerationAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationAccountsModule { }
