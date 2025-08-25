import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiRemunerationDetailsComponent } from './iti-practical-remuneration-details.component';
import { ItiRemunerationDetailsRoutingModule } from './iti-practical-remuneration-details-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiRemunerationDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ItiRemunerationDetailsRoutingModule
  ], exports: [ItiRemunerationDetailsComponent]
})
export class ItiRemunerationDetailsModule { }
