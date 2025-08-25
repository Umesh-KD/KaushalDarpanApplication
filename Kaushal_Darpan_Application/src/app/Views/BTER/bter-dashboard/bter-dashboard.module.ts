import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BterDashboardComponent } from './bter-dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: BterDashboardComponent }];


@NgModule({
  declarations: [BterDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [BterDashboardComponent]
})
export class BterDashboardModule { }
