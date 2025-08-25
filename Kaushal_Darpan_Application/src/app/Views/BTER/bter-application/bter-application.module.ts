import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BTERApplicationRoutingModule } from './bter-application-routing.module';
import { BTERApplicationComponent } from './bter-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ViewApplicationModule } from '../application-view/application-view.module';

@NgModule({
  declarations: [
    BTERApplicationComponent
  ],
  imports: [
    CommonModule,
    BTERApplicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ViewApplicationModule
  ]
})
export class BTERApplicationModule { }
