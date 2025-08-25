import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAdminRemunerationDetailsComponent } from './iti-admin-remuneration-details.component';
import { ItiAdminRemunerationDetailsRoutingModule } from './iti-admin-remuneration-details-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiAdminRemunerationDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ItiAdminRemunerationDetailsRoutingModule
  ], exports: [ItiAdminRemunerationDetailsComponent]
})
export class ItiAdminRemunerationDetailsModule { }
