import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAssignTeacherRoutingModule } from './bter-assign-teacher-routing.module';
import { BterAssignTeacherComponent } from './bter-assign-teacher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { routes } from '../../routes';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    BterAssignTeacherComponent
  ],
  imports: [
    CommonModule,
    BterAssignTeacherRoutingModule,
    FormsModule, ReactiveFormsModule, NgxMaterialTimepickerModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes),
  ]
})
export class BterAssignTeacherModule { }
