import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalAdmissionRoutingModule } from './final-admission-routing.module';
import { FinalAdmissionComponent } from './final-admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    FinalAdmissionComponent
  ],
  imports: [
    CommonModule,
    FinalAdmissionRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class FinalAdmissionModule { }
