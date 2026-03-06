import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReAssignAttendenceRoutingModule } from './re-assign-attendence-routing.module';
import { ReAssignAttendenceComponent } from './re-assign-attendence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';
import { routes } from '../../../routes';


@NgModule({
  declarations: [
    ReAssignAttendenceComponent
  ],
  imports: [
    CommonModule,
    ReAssignAttendenceRoutingModule,
    FormsModule, ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ReAssignAttendenceModule { }
