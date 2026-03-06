import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReAssignAttendenceListRoutingModule } from './re-assign-attendence-list-routing.module';
import { ReAssignAttendenceListComponent } from './re-assign-attendence-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { routes } from '../../../routes';


@NgModule({
  declarations: [
    ReAssignAttendenceListComponent
  ],
  imports: [
    CommonModule,
    ReAssignAttendenceListRoutingModule,
    FormsModule, ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ReAssignAttendenceListModule { }
