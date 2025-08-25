import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItiHrMasterValidationComponent } from './itihr-master-validation.component';
import { ItiHrMasterValidationRoutingModule } from './itihr-master-validation-routing.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ItiHrMasterValidationComponent
  ],
  imports: [
    CommonModule,
    ItiHrMasterValidationRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ItiHrMasterValidationModule { }
