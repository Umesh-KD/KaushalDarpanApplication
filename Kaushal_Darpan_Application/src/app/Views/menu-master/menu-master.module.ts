import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuMasterRoutingModule } from './menu-master.routing.module';
import { MenuMasterComponent } from './menu-master.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';

@NgModule({
  declarations: [
    MenuMasterComponent
  ],
  imports: [
    CommonModule,
    MenuMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class MenuMasterModule { }
