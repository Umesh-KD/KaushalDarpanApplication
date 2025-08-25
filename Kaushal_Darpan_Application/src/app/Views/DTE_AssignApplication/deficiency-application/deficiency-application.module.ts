import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeficiencyApplicationRoutingModule } from './deficiency-application-routing.module';
import { DeficiencyApplicationComponent } from './deficiency-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ViewApplicationModule } from '../../BTER/application-view/application-view.module';


@NgModule({
  declarations: [
    DeficiencyApplicationComponent
  ],
  imports: [
    CommonModule,
    DeficiencyApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ViewApplicationModule
  ]
})
export class DeficiencyApplicationModule { }
