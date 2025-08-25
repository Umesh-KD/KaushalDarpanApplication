import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgModule } from '@angular/core';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { SsoidUpdateComponent } from './ssoid-update.component';
import { SsoidUpdateRoutingModule } from './ssoid-update-routing.module';


@NgModule({
  declarations: [
    SsoidUpdateComponent
  ],
  imports: [
    CommonModule,
    SsoidUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class SsoidUpdateModule { }
