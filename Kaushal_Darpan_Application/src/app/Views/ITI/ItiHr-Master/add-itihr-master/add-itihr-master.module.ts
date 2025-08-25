import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { AddItiHrMasterComponent } from './add-itihr-master.component';
import { AddItiHrmasterRoutingModule } from './add-itihr-master.routing.module';

@NgModule({
  declarations: [
    AddItiHrMasterComponent
  ],
  imports: [
    CommonModule,
    AddItiHrmasterRoutingModule
    ,FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddItiHrmasterModule { }
