import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTpoRoutingModule } from './create-tpo-routing.module';
import { CreateTpoComponent } from './create-tpo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { EditTpoComponent } from '../details-tpo/edit-tpo/edit-tpo.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CreateTpoComponent, EditTpoComponent,
  ],
  imports: [
    CommonModule,
    CreateTpoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule, MaterialModule
  ], exports: [CommonModule, EditTpoComponent]
})
export class CreateTpoModule { }
