import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteItemsMasterComponent } from './dteitems-master.component';
import { DteItemsMasterRoutingModule } from './dteitems-master.routing.module';

@NgModule({
  declarations: [
    DteItemsMasterComponent
  ],
  imports: [
    CommonModule,
    DteItemsMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteItemsMasterModule { }
