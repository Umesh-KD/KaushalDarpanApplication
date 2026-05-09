import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffIFMSDataRoutingModule } from './staff-ifmsdata-routing.module';
import { StaffIFMSDataComponent } from './staff-ifmsdata.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StaffIFMSDataComponent
  ],
  imports: [
    CommonModule,
    StaffIFMSDataRoutingModule,
    FormsModule
  ]
})
export class StaffIFMSDataModule { }
