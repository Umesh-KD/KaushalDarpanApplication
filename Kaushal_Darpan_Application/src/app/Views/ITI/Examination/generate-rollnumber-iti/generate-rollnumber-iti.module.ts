import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateRollnumberITIRoutingModule } from './generate-rollnumber-iti-routing.module';
import { GenerateRollnumberITIComponent } from './generate-rollnumber-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    GenerateRollnumberITIComponent
  ],
  imports: [
    CommonModule,
    GenerateRollnumberITIRoutingModule, ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class GenerateRollnumberITIModule { }
