import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddNodalRoutingModule } from './add-nodal.routing.module';
import { AddNodalComponent } from './add-nodal.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    AddNodalComponent
  ],
  imports: [
    CommonModule,
    AddNodalRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddnodalModule { }
