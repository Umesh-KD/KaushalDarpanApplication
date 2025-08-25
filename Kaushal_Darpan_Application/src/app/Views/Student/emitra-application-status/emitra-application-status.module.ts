import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitraApplicationStatusRoutingModule } from './emitra-application-status-routing.module';
import { EmitraApplicationStatusComponent } from './emitra-application-status.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmitraApplicationStatusComponent
  ],
  imports: [
    CommonModule,
    EmitraApplicationStatusRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class EmitraApplicationStatusModule { }
