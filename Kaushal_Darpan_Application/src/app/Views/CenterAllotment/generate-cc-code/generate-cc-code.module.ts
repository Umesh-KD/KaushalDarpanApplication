import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { GenerateCcCodeComponent } from './generate-cc-code.component';
import { GenerateCcCodeRoutingModule } from './generate-cc-code-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    GenerateCcCodeComponent
  ],
  imports: [
    CommonModule,
    GenerateCcCodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class GenerateCcCodeModule { }
