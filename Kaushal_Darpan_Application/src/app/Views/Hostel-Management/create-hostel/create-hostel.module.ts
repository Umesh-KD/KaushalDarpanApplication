import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateHostelRoutingModule } from './create-hostel-routing.module';
import { CreateHostelComponent } from './create-hostel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    CreateHostelComponent
  ],
  imports: [
    CommonModule,
    CreateHostelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class CreateHostelModule { }


