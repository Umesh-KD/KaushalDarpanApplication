import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenumerationAccountsRevalRoutingModule } from './renumeration-accounts-reval-routing.module';
import { RenumerationAccountsRevalComponent } from './renumeration-accounts-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RenumerationAccountsRevalComponent
  ],
  imports: [
    CommonModule,
    RenumerationAccountsRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationAccountsRevalModule { }
