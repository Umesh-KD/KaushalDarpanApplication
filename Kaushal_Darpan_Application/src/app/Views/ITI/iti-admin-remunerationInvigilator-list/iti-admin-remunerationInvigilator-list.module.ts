import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAdminremunerationInvigilatorlistComponent } from './iti-admin-remunerationInvigilator-list.component';
import { ItiAdminRemunerationInvigilatorlistRoutingModule } from './iti-admin-remunerationInvigilator-list-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiAdminremunerationInvigilatorlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ItiAdminRemunerationInvigilatorlistRoutingModule
  ], exports: [ItiAdminremunerationInvigilatorlistComponent]
})
export class ItiAdminRemunerationInvigilatorlistModule { }
