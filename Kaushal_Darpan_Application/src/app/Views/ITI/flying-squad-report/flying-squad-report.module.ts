import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlyingSquadReportRoutingModule } from './flying-squad-report-routing.module';
import { FlyingSquadReportComponent } from './flying-squad-report.component';


@NgModule({
  declarations: [
    FlyingSquadReportComponent
  ],
  imports: [
    CommonModule,
    FlyingSquadReportRoutingModule
  ]
})
export class FlyingSquadReportModule { }
