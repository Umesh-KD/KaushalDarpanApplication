import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupcodeAddRevalRoutingModule } from './add-groupcode-reval-routing.module';
import { GroupcodeAddRevalComponent } from './add-groupcode-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';

@NgModule({
  declarations: [
    GroupcodeAddRevalComponent
  ],
  imports: [
    CommonModule,
    GroupcodeAddRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class GroupcodeAddRevalModule { }
