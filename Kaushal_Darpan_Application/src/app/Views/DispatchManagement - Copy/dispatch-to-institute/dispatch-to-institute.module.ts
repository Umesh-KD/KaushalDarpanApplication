import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchToInstituteRoutingModule } from './dispatch-to-institute-routing.module';
import { DispatchToInstituteComponent } from './dispatch-to-institute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    DispatchToInstituteComponent
  ],
  imports: [
    CommonModule,
    DispatchToInstituteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule,
  ]
})
export class DispatchToInstituteModule { }
