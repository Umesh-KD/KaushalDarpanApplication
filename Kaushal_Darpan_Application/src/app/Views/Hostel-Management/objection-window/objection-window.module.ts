import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { objectionwindowRoutingModule } from './objection-window-routing.module';
import { objectionwindowComponent } from './objection-window.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    objectionwindowComponent
  ],
  imports: [
    CommonModule,
    objectionwindowRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class objectionwindowModule { }
