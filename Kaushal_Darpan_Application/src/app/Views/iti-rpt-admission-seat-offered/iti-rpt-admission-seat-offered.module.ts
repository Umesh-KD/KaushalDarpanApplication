import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITIRPTAdmissionSeatOfferedComponent } from './iti-rpt-admission-seat-offered.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path: '', component: ITIRPTAdmissionSeatOfferedComponent
  }
];

@NgModule({
  declarations: [ITIRPTAdmissionSeatOfferedComponent],
  imports: [
    CommonModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes)
  ]
})
export class ITIRPTAdmissionSeatOfferedModule { }
