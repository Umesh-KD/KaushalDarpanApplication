import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupcodeAddRoutingModule } from './add-groupcode-routing.module';
import { GroupcodeAddComponent } from './add-groupcode.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GroupcodeAddComponent
  ],
  imports: [
    CommonModule,
    GroupcodeAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class GroupcodeAddModule { }
