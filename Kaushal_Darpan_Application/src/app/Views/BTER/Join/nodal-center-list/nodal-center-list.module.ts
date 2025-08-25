import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalCenterListRoutingModule } from './nodal-center-list-routing.module';
import { NodalCenterListComponent } from './nodal-center-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../../material.module';


@NgModule({
  declarations: [
    NodalCenterListComponent
  ],
  imports: [
    CommonModule,
    NodalCenterListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    NgbPopoverModule, MaterialModule
  ]
})
export class NodalCenterListModule { }
