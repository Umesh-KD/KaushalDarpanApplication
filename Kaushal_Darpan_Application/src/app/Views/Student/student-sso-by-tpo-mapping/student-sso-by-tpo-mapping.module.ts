import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { StudentSsoByTpoMappingComponent } from './student-sso-by-tpo-mapping.component';
import { StudentSsoByTpoMappingRoutingModule } from './student-sso-by-tpo-mapping-routing.module';


@NgModule({
  declarations: [
    StudentSsoByTpoMappingComponent
  ],
  imports: [
    CommonModule,
    StudentSsoByTpoMappingRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class StudentSsoByTpoMappingModule { }
