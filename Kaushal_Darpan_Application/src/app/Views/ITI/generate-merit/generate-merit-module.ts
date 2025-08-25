import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { GenerateMeritComponent } from './generate-merit.component';
import { GenerateMeritRoutingModule } from './generate-merit.routing.module';

@NgModule({
  declarations: [
    GenerateMeritComponent
  ],
  imports: [
    CommonModule,
    GenerateMeritRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GenerateMeritModule { }
