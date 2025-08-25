import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpwardMomentComponent } from './upward-moment.component';
import { UpwardMomentRoutingModule } from './upward-moment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UpwardMomentComponent
  ],
  imports: [
    CommonModule,
    UpwardMomentRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule
  ]
})
export class UpwardMomentModule { }
