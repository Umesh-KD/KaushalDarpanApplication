import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { JanaadharListComponent } from './janaadhar-list.component';



const routes: Routes = [
  { path: '', component: JanaadharListComponent },
];

@NgModule({
  declarations: [JanaadharListComponent],
  imports: [
    CommonModule, TableSearchFilterModule, ReactiveFormsModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class JanaadharModule { }
