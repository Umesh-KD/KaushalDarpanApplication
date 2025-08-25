import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiApplicationRoutingModule } from './iti-application-routing.module';
import { ItiApplicationComponent } from './iti-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ViewApplicationModule } from '../application-view/application-view.module';

@NgModule({
  declarations: [
    ItiApplicationComponent
  ],
  imports: [
    CommonModule,
    ItiApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ViewApplicationModule
  ]
})
export class ItiApplicationModule { }
