import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Routes, RouterModule } from '@angular/router';
import { AddITIIssueItemComponent } from './iti-issue-item.component';

const routes: Routes = [{ path: '', component: AddITIIssueItemComponent }];

@NgModule({
  declarations: [
    AddITIIssueItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class AddITIIssueItemModule { }
