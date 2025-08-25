import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DteNodalDashboardComponent } from './dte-nodal-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, RouterLink } from '@angular/router';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';

@NgModule({
  declarations: [DteNodalDashboardComponent],
  imports: [RouterLink,
    CommonModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ], exports: [DteNodalDashboardComponent]
})
export class NodalVerifierDashboardModule { }
