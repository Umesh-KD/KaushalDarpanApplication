import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { AddRequestLabelingEquipmentsComponent } from './add-request-labeling-equipments.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddRequestLabelingEquipmentsRoutingModule } from './add-request-labeling-equipments.routing.module';


@NgModule({
  declarations: [
    AddRequestLabelingEquipmentsComponent
  ],
  imports: [
    CommonModule,
    AddRequestLabelingEquipmentsRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class AddRequestLabelingEquipmentsModule { }
