import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyDuplicateDocRoutingModule } from './apply-duplicate-doc-routing.module';
import { ApplyDuplicateDocComponent } from './apply-duplicate-doc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ApplyDuplicateDocComponent
  ],
  imports: [
    CommonModule,
    ApplyDuplicateDocRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ApplyDuplicateDocModule { }
