import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiEstablishmentListRoutingModule } from './iti-establishment-list-routing.module';
import { ItiEstablishmentListComponent } from './iti-establishment-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiEstablishmentListComponent
  ],
  imports: [
    CommonModule,
    ItiEstablishmentListRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class ItiEstablishmentListModule { }
