import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTpoComponent } from './edit-tpo/edit-tpo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { DetailsTpoRoutingModule } from './details-tpo-routing.module';
import { DetailsTpoComponent } from './details-tpo.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    DetailsTpoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetailsTpoRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ],
  
  exports: [CommonModule]
})
export class DetailsTpoModule { }
