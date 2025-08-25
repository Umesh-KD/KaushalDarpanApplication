import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedirectToSsoLoginRoutingModule } from './redirect-to-sso-login-routing.module';
import { RedirectToSsoLoginComponent } from './redirect-to-sso-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RedirectToSsoLoginComponent
  ],
  imports: [
    CommonModule,
    RedirectToSsoLoginRoutingModule,
    MaterialModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class RedirectToSsoLoginModule { }
