import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiTradeSearchRoutingModule } from './iti-trade-search-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ItiTradeSearchComponent } from './iti-trade-search.component';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{ path: '', component: ItiTradeSearchComponent }];
@NgModule({
  declarations: [
    /*    KnowMeritITIComponent*/
    ItiTradeSearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    ItiTradeSearchRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ], providers: [TableSearchFilterModule]
})
export class ItiTradeSearchModule { }
