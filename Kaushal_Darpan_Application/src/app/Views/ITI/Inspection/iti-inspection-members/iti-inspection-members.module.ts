import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIInspectionMembersComponent } from './iti-inspection-members.component';
import { ITIInspectionMembersRoutingModule } from './iti-inspection-members-routing.module';

@NgModule({
  declarations: [
    ITIInspectionMembersComponent
  ],
  imports: [
    CommonModule,
    ITIInspectionMembersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIInspectionMembersModule { }
