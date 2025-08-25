import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { PublishedRollNoITIComponent } from './published-roll-no-iti.component';
import { PublishedRollNoITIRoutingModule } from './published-roll-no-iti-routing.module';


@NgModule({
  declarations: [
    PublishedRollNoITIComponent
  ],
  imports: [
    CommonModule,
    PublishedRollNoITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class PublishedRollNoITIModule { }
