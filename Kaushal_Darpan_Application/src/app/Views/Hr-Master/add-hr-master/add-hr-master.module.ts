import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddHrMasterComponent } from './add-hr-master.component';
import { AddHrmasterRoutingModule } from './add-hr-master.routing.module';

@NgModule({
  declarations: [
    AddHrMasterComponent
  ],
  imports: [
    CommonModule,
    AddHrmasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddHrmasterModule { }
