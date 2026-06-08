import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RelievingJoiningRequestReportComponent } from './relieving-joining-request-report.component';
import { RelievingJoiningRequestReportRoutingModule } from './relieving-joining-request-report-routing.module';


@NgModule({
  declarations: [
    RelievingJoiningRequestReportComponent
  ],
  imports: [
    CommonModule,
    RelievingJoiningRequestReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule,
  ]
})
export class RelievingJoiningRequestReportModule { }
