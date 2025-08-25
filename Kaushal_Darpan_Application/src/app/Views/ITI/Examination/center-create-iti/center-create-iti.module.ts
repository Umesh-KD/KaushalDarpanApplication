import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterCreateITIRoutingModule } from './center-create-iti-routing.module';
import { CenterCreateITIComponent } from './center-create-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CenterCreateITIComponent
  ],
  imports: [
    CommonModule,
    CenterCreateITIRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class CenterCreateITIModule { }
