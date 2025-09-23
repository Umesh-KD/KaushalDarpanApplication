import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { IIPWebAllPostComponent } from './iip-web-all-post.component';
import { IIPWebAllPostRoutingModule } from './iip-web-all-post-routing.module';

@NgModule({
  declarations: [
    IIPWebAllPostComponent
  ],
  imports: [
    CommonModule,
    IIPWebAllPostRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule
  ]
})
export class IIPWebAllPostModule { }
