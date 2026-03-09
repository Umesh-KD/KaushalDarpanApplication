import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAttendencePercentRoutingModule } from './iti-attendence-percent-routing.module';
import { ItiAttendencePercentComponent } from './iti-attendence-percent.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { routes } from '../../../routes';

@NgModule({
  declarations: [
    ItiAttendencePercentComponent
  ],
  imports: [
    CommonModule,
    ItiAttendencePercentRoutingModule,
    FormsModule, ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ItiAttendencePercentModule { }
