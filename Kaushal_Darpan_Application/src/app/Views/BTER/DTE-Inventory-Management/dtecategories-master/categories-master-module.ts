import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteCategoriesMasterRoutingModule } from './dtecategories-master.routing.module';
import { DteCategoriesMasterComponent } from './dtecategories-master.component';

@NgModule({
  declarations: [
    DteCategoriesMasterComponent
  ],
  imports: [
    CommonModule,
    DteCategoriesMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteCategoriesMasterModule { }
