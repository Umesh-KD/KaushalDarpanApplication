import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceTimeTableComponent } from './attendance-time-table.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [{
  path: '', component: AttendanceTimeTableComponent
}];


@NgModule({
  declarations: [AttendanceTimeTableComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule, 
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class AttendanceTimeTableModule { }
