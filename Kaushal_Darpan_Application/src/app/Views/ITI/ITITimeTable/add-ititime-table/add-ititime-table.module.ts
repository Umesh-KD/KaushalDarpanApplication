import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddITITimeTableRoutingModule } from './add-ititime-table-routing.module';
import { AddITITimeTableComponent } from './add-ititime-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AddITITimeTableComponent
  ],
  imports: [
    CommonModule,
    AddITITimeTableRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AddITITimeTableModule { }
