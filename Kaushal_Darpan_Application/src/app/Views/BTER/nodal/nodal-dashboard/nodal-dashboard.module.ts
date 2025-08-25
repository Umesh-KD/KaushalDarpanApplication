import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodalDashboardComponent } from './nodal-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, RouterLink } from '@angular/router';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { VerifierAddComponent } from '../verifier/verifier-add/verifier-add.component';

const routes: Routes = [{ path: '', component: DashboardListComponent },
  { path: 'add-verifier', component: VerifierAddComponent }];

@NgModule({
  declarations: [NodalDashboardComponent, DashboardListComponent, VerifierAddComponent],
  imports: [RouterLink,
    CommonModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule, RouterModule.forChild(routes)
  ], exports: [NodalDashboardComponent]
})
export class NodalDashboardModule { }
