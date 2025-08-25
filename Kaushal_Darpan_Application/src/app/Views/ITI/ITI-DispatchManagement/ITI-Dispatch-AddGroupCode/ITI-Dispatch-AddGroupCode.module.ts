import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchAddGroupCodeRoutingModule } from './ITI-Dispatch-AddGroupCode-routing.module';
import { ITIDispatchAddGroupCodeComponent } from './ITI-Dispatch-AddGroupCode.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ITIDispatchAddGroupCodeComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchAddGroupCodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class ITIDispatchAddGroupCodeModule { }
