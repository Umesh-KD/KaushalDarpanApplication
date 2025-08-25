import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllotmentStatusITIRoutingModule } from './allotment-status-iti-routing.module';
import { AllotmentStatusITIComponent } from './allotment-status-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AllotmentStatusITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule

  ]
})
export class AllotmentStatusITIModule { }
