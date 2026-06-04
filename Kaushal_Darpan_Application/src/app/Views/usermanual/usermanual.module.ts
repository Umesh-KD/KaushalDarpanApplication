import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermanualRoutingModule } from './usermanual-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { UsermanualComponent } from './usermanual.component';


@NgModule({
  declarations: [
    UsermanualComponent
  ],
  imports: [
    CommonModule,
    UsermanualRoutingModule,
     FormsModule, ReactiveFormsModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UsermanualModule { }
