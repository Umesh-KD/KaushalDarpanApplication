import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { UnlockApplicationFormComponent } from './unlock-application-form.component';
import { UnlockApplicationFormRoutingModule } from './unlock-application-form-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    UnlockApplicationFormComponent
  ],
  imports: [
    CommonModule,
    UnlockApplicationFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class UnlockApplicationFormModule { }
