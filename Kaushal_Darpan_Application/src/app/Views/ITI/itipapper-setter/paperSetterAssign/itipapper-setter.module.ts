import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPapperSetterRoutingModule } from './itipapper-setter-routing.module';
import { ITIPapperSetterComponent } from './itipapper-setter.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITIPapperSetterComponent
  ],
  imports: [
    CommonModule,
    ITIPapperSetterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIPapperSetterModule { }
