import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItiHrMasterComponent } from './itihr-master.component';
import { ItiHrmasterRoutingModule } from './itihr-master.routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ItiHrMasterComponent
  ],
  imports: [
    CommonModule,
    ItiHrmasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiHrmasterModule { }
