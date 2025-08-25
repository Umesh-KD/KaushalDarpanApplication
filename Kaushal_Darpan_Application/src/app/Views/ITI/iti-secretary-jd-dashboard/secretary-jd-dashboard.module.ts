import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { SecretaryJDDashboardComponent } from '../../secretary-jd-dashboard/secretary-jd-dashboard.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ITISecretaryJDDashboardComponent } from './iti-secretary-jd-dashboard.component';

const routes: Routes = [{ path: '', component: SecretaryJDDashboardComponent }];

@NgModule({
  declarations: [
    ITISecretaryJDDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [ITISecretaryJDDashboardComponent]
})
export class ITISecretaryJDDashboardModule { }
