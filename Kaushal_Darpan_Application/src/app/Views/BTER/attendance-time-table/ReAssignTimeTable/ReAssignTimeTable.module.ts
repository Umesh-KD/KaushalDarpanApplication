import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReAssignTimeTableComponent } from './ReAssignTimeTable.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';

const routes: Routes = [{
  path: '', component: ReAssignTimeTableComponent
}];


@NgModule({
  declarations: [ReAssignTimeTableComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule, 
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ReAssignTimeTableModule { }
