import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSsoMappingRoutingModule } from './student-sso-mapping-routing.module';
import { StudentSsoMappingComponent } from './student-sso-mapping.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StudentSsoMappingComponent
  ],
  imports: [
    CommonModule,
    StudentSsoMappingRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class StudentSsoMappingModule { }
