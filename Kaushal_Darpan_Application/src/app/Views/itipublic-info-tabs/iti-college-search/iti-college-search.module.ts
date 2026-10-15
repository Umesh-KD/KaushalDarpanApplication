import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeSearchRoutingModule } from './iti-college-search-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ItiCollegeSearchComponent } from './iti-college-search.component';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

/*const routes: Routes = [{ path: '', component: ItiCollegeSearchComponent }];*/
@NgModule({
  declarations: [
    /*    KnowMeritITIComponent*/
    ItiCollegeSearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    ItiCollegeSearchRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule,

    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ], providers: [TableSearchFilterModule]
})
export class ItiCollegeSearchModule { }
