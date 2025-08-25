import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushedDataComponent } from './pushed-data.component';
import { PushedDataRoutingModule } from './pushed-data-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';



@NgModule({
  declarations: [
    PushedDataComponent
  ],
  imports: [
    CommonModule,
    PushedDataRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class PushedDataModule { }
