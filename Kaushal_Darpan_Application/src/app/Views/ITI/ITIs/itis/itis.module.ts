import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITIsComponent } from './itis.component';
import { ITIsRoutingModule } from './itis-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';



@NgModule({
  declarations: [
    ITIsComponent
  ],
  imports: [
    CommonModule,
    ITIsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class ITIsModule { }
