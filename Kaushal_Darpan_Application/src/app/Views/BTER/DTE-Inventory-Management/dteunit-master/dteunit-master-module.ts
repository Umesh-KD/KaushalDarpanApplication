import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteUnitMasterComponent } from './dteunit-master.component';
import { DteUnitMasterRoutingModule } from './dteunit-master.routing.module';

@NgModule({
  declarations: [
    DteUnitMasterComponent
  ],
  imports: [
    CommonModule,
    DteUnitMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteUnitMasterModule { }
