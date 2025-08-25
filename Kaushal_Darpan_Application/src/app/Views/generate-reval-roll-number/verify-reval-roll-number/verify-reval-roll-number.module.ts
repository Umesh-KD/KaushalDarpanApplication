import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { VerifyRevalRollNumberComponent } from './verify-reval-roll-number.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

const routes: Routes = [{ path: '', component: VerifyRevalRollNumberComponent }];

@NgModule({
  declarations: [VerifyRevalRollNumberComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule,
    TableSearchFilterModule
  ]
})
export class VerifyRevalRollNumberModule { }
