import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TPOHomeRoutingModule } from './tpo-home-routing.module';
import { TPOHomeComponent } from './tpo-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    TPOHomeComponent
  ],
  imports: [
    CommonModule,
    TPOHomeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class TPOHomeModule { }
