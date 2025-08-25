import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITICollegeAdmissionComponent } from './iticollege-admission.component';
import { ITICollegeAdmissionRoutingModule } from './iticollege-admission-routing.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ITICollegeAdmissionComponent
  ],
  imports: [
    CommonModule,
    ITICollegeAdmissionRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class ITICollegeAdmissionModule { }
