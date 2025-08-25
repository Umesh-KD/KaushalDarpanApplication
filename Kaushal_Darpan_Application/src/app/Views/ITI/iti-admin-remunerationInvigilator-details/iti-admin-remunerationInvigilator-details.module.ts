import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAdminremunerationInvigilatorDetailsComponent } from './iti-admin-remunerationInvigilator-details.component';
import { ItiAdminRemunerationInvigilatorDetailsRoutingModule } from './iti-admin-remunerationInvigilator-details-routing.module';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';



@NgModule({
  declarations: [
    ItiAdminremunerationInvigilatorDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ItiAdminRemunerationInvigilatorDetailsRoutingModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ], exports: [ItiAdminremunerationInvigilatorDetailsComponent]
})
export class ItiAdminRemunerationInvigilatorDetailsModule { }
