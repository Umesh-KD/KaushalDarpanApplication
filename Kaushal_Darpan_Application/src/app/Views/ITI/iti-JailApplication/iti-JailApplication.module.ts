import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiJailApplicationRoutingModule } from './iti-JailApplication-routing.module';
import { ItiJailApplicationComponent } from './iti-JailApplication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ViewApplicationModule } from '../application-view/application-view.module';

@NgModule({
  declarations: [
    ItiJailApplicationComponent
  ],
  imports: [
    CommonModule,
    ItiJailApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ViewApplicationModule
  ]
})
export class ItiJailApplicationModule { }
