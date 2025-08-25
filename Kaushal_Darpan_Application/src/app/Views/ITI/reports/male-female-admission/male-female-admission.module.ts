import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaleFemaleAdmissionComponentRoutingModule } from './male-female-admission-routing.module';
import { MaleFemaleAdmissionComponent } from './male-female-admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    MaleFemaleAdmissionComponent
  ],
  imports: [
    CommonModule,
    MaleFemaleAdmissionComponentRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class MaleFemaleAdmissionModule { }
