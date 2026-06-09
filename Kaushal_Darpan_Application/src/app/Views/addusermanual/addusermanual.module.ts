import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddusermanualRoutingModule } from './addusermanual-routing.module';
import { AddusermanualComponent } from './addusermanual.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddusermanualComponent
  ],
  imports: [
    CommonModule,
    AddusermanualRoutingModule,
     FormsModule, ReactiveFormsModule, TableSearchFilterModule, LoaderModule,
        NgSelectModule
  ]
})
export class AddusermanualModule { }
