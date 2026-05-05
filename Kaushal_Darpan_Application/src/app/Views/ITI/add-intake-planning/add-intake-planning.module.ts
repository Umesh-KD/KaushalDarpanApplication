import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddIntakePlanningRoutingModule } from './add-intake-planning-routing.module';
import { AddIntakePlanningComponent } from './add-intake-planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddIntakePlanningComponent
  ],
  imports: [
    CommonModule,
    AddIntakePlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class AddIntakePlanningModule { }
