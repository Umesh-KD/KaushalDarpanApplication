import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { SetPaperComponent } from './set-paper/set-paper.component';
import { StaffSetPaperComponent } from './staff-set-paper/staff-set-paper.component';

const routes: Routes = [{ path: 'set-paper', component: SetPaperComponent }, { path: 'staff-set-paper', component: StaffSetPaperComponent }];

@NgModule({
  declarations: [SetPaperComponent, StaffSetPaperComponent],
  imports: [
    CommonModule, ReactiveFormsModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SetPaperModule { }

