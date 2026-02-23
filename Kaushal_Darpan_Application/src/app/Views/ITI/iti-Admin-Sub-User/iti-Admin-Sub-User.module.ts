import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiAdminSubUserRoutingModule } from './iti-Admin-Sub-User-routing.module';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { itiAdminSubUserComponent } from './iti-Admin-Sub-User.component';  


@NgModule({
  declarations: [
    itiAdminSubUserComponent
  ],
  imports: [
    CommonModule,
    itiAdminSubUserRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class itiAdminSubUserModule { }
