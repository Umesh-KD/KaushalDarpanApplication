import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiNodelUserListRoutingModule } from './iti-Nodel-User-List-routing.module';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { itiNodelUserListComponent } from './iti-Nodel-User-List.component';  


@NgModule({
  declarations: [
    itiNodelUserListComponent
  ],
  imports: [
    CommonModule,
    itiNodelUserListRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class itiNodelUserListModule { }
