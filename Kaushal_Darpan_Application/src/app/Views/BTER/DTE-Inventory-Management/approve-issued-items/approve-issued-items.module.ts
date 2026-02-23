import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApproveIssuedItemsComponent } from './approve-issued-items.component';
import { ApproveIssuedItemsRoutingModule } from './approve-issued-items-routing.module';

@NgModule({
  declarations: [
    ApproveIssuedItemsComponent
  ],
  imports: [
    CommonModule,
    ApproveIssuedItemsRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class ApproveIssuedItemsModule { }
