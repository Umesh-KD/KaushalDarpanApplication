import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffIFMSDataRoutingModule } from './staff-ifmsdata-routing.module';
import { StaffIFMSDataComponent } from './staff-ifmsdata.component';


@NgModule({
  declarations: [
    StaffIFMSDataComponent
  ],
  imports: [
    CommonModule,
    StaffIFMSDataRoutingModule
  ]
})
export class StaffIFMSDataModule { }
