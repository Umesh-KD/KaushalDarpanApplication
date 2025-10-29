import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteLaboratoryMasterComponent } from './dtelaboratory-master.component';
import { DteLaboratoryMasterRoutingModule } from './dtelaboratory-master.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    DteLaboratoryMasterComponent
  ],
  imports: [
    CommonModule,
    DteLaboratoryMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class DteLaboratoryMasterModule { }
