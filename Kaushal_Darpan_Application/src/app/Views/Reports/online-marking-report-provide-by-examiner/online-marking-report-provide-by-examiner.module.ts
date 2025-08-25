import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineMarkingReportProvideByExaminerRoutingModule } from './online-marking-report-provide-by-examiner-routing.module';
import { OnlineMarkingReportProvideByExaminerComponent } from './online-marking-report-provide-by-examiner.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { routes } from '../../../routes';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    OnlineMarkingReportProvideByExaminerComponent
  ],
  imports: [
    FormsModule,
    OnlineMarkingReportProvideByExaminerRoutingModule,
    ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class OnlineMarkingReportProvideByExaminerModule { }
