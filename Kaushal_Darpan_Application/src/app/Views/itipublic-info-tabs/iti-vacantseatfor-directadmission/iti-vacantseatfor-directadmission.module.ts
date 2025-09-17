import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiVacantSeatDirectAdmissionRoutingModule } from './iti-vacantseatfor-directadmission-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ItiVacantSeatDirectAdmissionComponent } from './iti-vacantseatfor-directadmission.component';


@NgModule({
  declarations: [
    /*    KnowMeritITIComponent*/
    ItiVacantSeatDirectAdmissionComponent
  ],
  imports: [
    CommonModule,
    ItiVacantSeatDirectAdmissionRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ], providers: [TableSearchFilterModule]
})
export class ItiVacantSeatDirectAdmissionModule { }
