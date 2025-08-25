import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LateralEntryRoutingModule } from './lateral-entry-routing.module';
import { LateralEntryComponent } from './lateral-entry.component';


@NgModule({
  declarations: [
    LateralEntryComponent
  ],
  imports: [
    CommonModule,
    LateralEntryRoutingModule
  ]
})
export class LateralEntryModule { }
