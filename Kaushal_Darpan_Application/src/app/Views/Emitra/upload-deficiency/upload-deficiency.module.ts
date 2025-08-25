import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { UploadDeficiencyComponent } from './upload-deficiency.component';
import { UploadDeficiencyRoutingModule } from './upload-deficiency-routing.module';


@NgModule({
  declarations: [
    UploadDeficiencyComponent
  ],
  imports: [
    CommonModule,
    UploadDeficiencyRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UploadDeficiencyModule { }
