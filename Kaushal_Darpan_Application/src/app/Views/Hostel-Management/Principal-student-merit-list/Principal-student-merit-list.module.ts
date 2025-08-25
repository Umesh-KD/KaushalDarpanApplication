import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalstudentmeritlistRoutingModule } from './Principal-student-merit-list-routing.module';
import { PrincipalstudentmeritlistComponent } from './Principal-student-merit-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PrincipalstudentmeritlistComponent
  ],
  imports: [
    CommonModule,
    PrincipalstudentmeritlistRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class PrincipalstudentmeritlistModule { }
